#!/usr/bin/env node
/**
 * Provision an app user: creates a confirmed auth.users account via the
 * Supabase Admin API, then links it into public.users/public.roles — the
 * two tables src/lib/rbac.ts reads to decide what a signed-in user can see.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (never expose this key client-side).
 * Reads .env.local automatically; no extra dependencies.
 *
 * Usage:
 *   node src/scripts/create-user.mjs --email you@example.com --name "Full Name" --role admin [--password 'Str0ngPass!']
 *
 * If --password is omitted, a random one is generated and printed once.
 * Re-running with the same --email is safe: the existing password is left
 * alone and only the name/role link is refreshed.
 */

import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROLES = ['admin', 'salesperson', 'store_manager'];

function loadEnvLocal() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  let contents;
  try {
    contents = readFileSync(path.join(root, '.env.local'), 'utf8');
  } catch {
    return;
  }
  for (const line of contents.split('\n')) {
    const match = /^\s*([\w.-]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, '');
  }
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

function generatePassword() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
  const bytes = randomBytes(20);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

async function findUserByEmail(supabase, email) {
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (match) return match;
    if (data.users.length < 200) break;
  }
  return null;
}

async function main() {
  loadEnvLocal();
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.h) {
    console.log(
      'Usage: node src/scripts/create-user.mjs --email you@example.com --name "Full Name" --role admin [--password \'Str0ngPass!\'] [--reset-password]'
    );
    console.log(`Valid roles: ${ROLES.join(', ')}`);
    console.log('--reset-password: overwrite the password of an already-existing account (no-op otherwise).');
    return;
  }

  const email = args.email;
  const fullName = args.name ?? args['full-name'];
  const role = args.role;
  const explicitPassword = typeof args.password === 'string' ? args.password : undefined;

  if (!email || !fullName || !role) {
    console.error('Missing required arguments. --email, --name and --role are all required.');
    process.exitCode = 1;
    return;
  }

  if (!ROLES.includes(role)) {
    console.error(`--role must be one of: ${ROLES.join(', ')} (got "${role}")`);
    process.exitCode = 1;
    return;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (checked process.env and .env.local).'
    );
    process.exitCode = 1;
    return;
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const resetPassword = Boolean(args['reset-password']);
  const password = explicitPassword ?? generatePassword();
  let userId;
  let passwordChanged = false;

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role },
  });

  if (createError) {
    const alreadyExists = /already.*(registered|exists)/i.test(createError.message);
    if (!alreadyExists) {
      console.error('Failed to create auth user:', createError.message);
      process.exitCode = 1;
      return;
    }
    const existing = await findUserByEmail(supabase, email);
    if (!existing) {
      console.error('Supabase reported the email as taken, but it could not be found via listUsers().');
      process.exitCode = 1;
      return;
    }
    userId = existing.id;

    if (resetPassword) {
      const { error: updateError } = await supabase.auth.admin.updateUserById(userId, { password });
      if (updateError) {
        console.error(`Failed to reset password: ${updateError.message}`);
        process.exitCode = 1;
        return;
      }
      passwordChanged = true;
      console.log(`auth user for ${email} already existed — password reset.`);
    } else {
      console.log(`auth user for ${email} already exists — leaving their password untouched.`);
    }
  } else {
    userId = created.user.id;
    passwordChanged = true;
    console.log(`Created auth user ${email} (id: ${userId})`);
  }

  const { data: roleRow, error: roleError } = await supabase
    .from('roles')
    .upsert({ name: role }, { onConflict: 'name' })
    .select('id')
    .single();

  if (roleError) {
    console.error(
      `Auth user is set up, but linking the "${role}" role failed: ${roleError.message}`
    );
    console.error(
      'This usually means the schema migration (supabase/migrations/001_initial_schema.sql) has not been applied yet. Apply it, then re-run this script to finish the link.'
    );
    process.exitCode = 1;
    return;
  }

  const { error: linkError } = await supabase
    .from('users')
    .upsert(
      { id: userId, email, full_name: fullName, role_id: roleRow.id },
      { onConflict: 'id' }
    );

  if (linkError) {
    console.error(`Auth user is set up, but writing public.users failed: ${linkError.message}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Linked ${email} to role "${role}" in public.users.`);
  console.log('');
  console.log('--- Summary ---');
  console.log(`Email:    ${email}`);
  console.log(`Name:     ${fullName}`);
  console.log(`Role:     ${role}`);
  console.log(`User ID:  ${userId}`);
  if (passwordChanged) {
    console.log(`Password: ${password}`);
    console.log('(shown once — store it now; this script does not save it anywhere)');
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
