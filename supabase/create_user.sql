-- =============================================
-- Create an application user — THE LEDGER ERP
-- =============================================
-- Run this in the Supabase Dashboard SQL Editor (or `psql` / `supabase db
-- execute -f supabase/create_user.sql`) against your project's database.
--
-- What it does:
--   1. Creates a confirmed email/password user in auth.users + auth.identities
--      (confirmed = can sign in immediately, no verification email needed)
--   2. Ensures the target role exists in public.roles
--   3. Links the two via public.users, which src/lib/rbac.ts reads to decide
--      what the signed-in user can see
--
-- Safe to re-run: if the email already exists, auth creation is skipped
-- (the existing password is left untouched) and only the public.users/role
-- link is refreshed — so this also works to change someone's role later.
--
-- Note: Supabase recommends creating users through the Admin API
-- (supabase.auth.admin.createUser) or the Dashboard rather than raw SQL,
-- because the exact auth.* schema can shift between platform versions. This
-- targets the schema stable across Supabase Postgres as of 2026; if a column
-- below has been renamed on your project, that's the first thing to check.
--
-- Do not commit this file with a real password filled in — treat it as a
-- template, and rotate the password after first use if you do.

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

do $$
declare
  -- ---- Edit these before running ----
  v_email     text := 'owner@yourbusiness.com';
  v_password  text := 'ChangeMe123!';
  v_full_name text := 'Admin User';
  v_role_name text := 'admin'; -- one of: admin, salesperson, store_manager
  -- ------------------------------------

  v_user_id  uuid;
  v_role_id  uuid;
  v_existing uuid;
begin
  if v_role_name not in ('admin', 'salesperson', 'store_manager') then
    raise exception 'v_role_name must be admin, salesperson, or store_manager (got %)', v_role_name;
  end if;

  select id into v_existing from auth.users where email = v_email;

  if v_existing is not null then
    v_user_id := v_existing;
    raise notice 'auth user for % already exists (id: %) — leaving their password untouched', v_email, v_user_id;
  else
    v_user_id := uuid_generate_v4();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, last_sign_in_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000',
      v_user_id, 'authenticated', 'authenticated', v_email,
      crypt(v_password, gen_salt('bf')),
      now(), now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('full_name', v_full_name, 'role', v_role_name),
      now(), now(),
      '', '', '', ''
    );

    -- Required alongside auth.users for email/password sign-in to work.
    insert into auth.identities (
      id, provider_id, user_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      uuid_generate_v4(), v_user_id::text, v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true, 'phone_verified', false),
      'email', now(), now(), now()
    );

    raise notice 'created auth user % (id: %)', v_email, v_user_id;
  end if;

  insert into public.roles (name)
  values (v_role_name)
  on conflict (name) do nothing;

  select id into v_role_id from public.roles where name = v_role_name;

  insert into public.users (id, email, full_name, role_id)
  values (v_user_id, v_email, v_full_name, v_role_id)
  on conflict (id) do update
    set email     = excluded.email,
        full_name = excluded.full_name,
        role_id   = excluded.role_id;

  raise notice 'linked % to role "%" in public.users', v_email, v_role_name;
end $$ language plpgsql;
