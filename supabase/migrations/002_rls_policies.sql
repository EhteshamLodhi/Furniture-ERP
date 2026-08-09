-- =============================================
-- THE LEDGER ERP — Row Level Security
-- =============================================
-- This app gates access at the application layer (src/proxy.ts redirects any
-- signed-out request to /login before it reaches a page or Server Action),
-- not through per-row Postgres policies. If a table has RLS enabled with no
-- policy attached, Postgres denies every operation on it by default — which
-- is what "new row violates row-level security policy" means. That state
-- can be reached by toggling RLS on a table from the Dashboard UI at any
-- point; it isn't set by 001_initial_schema.sql, so re-running that
-- migration doesn't clear it.
--
-- This migration makes the actual security model explicit: every table is
-- RLS-enabled, and any authenticated session (any signed-in app user) can
-- read and write it. The service_role key (used by src/scripts/create-user.mjs
-- and Supabase's own Admin API) always bypasses RLS regardless of policies,
-- so it needs nothing added here. Unauthenticated (anon) access is denied
-- everywhere, since no page or Server Action in this app runs as anon.
--
-- Safe to re-run: policies are dropped and recreated by name.

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'roles', 'users', 'customers', 'suppliers', 'materials',
    'sales', 'sale_items', 'material_usage', 'inventory_additions',
    'accounts_receivable', 'accounts_payable',
    'payments_received', 'payments_made', 'notifications'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('DROP POLICY IF EXISTS authenticated_full_access ON %I;', t);
    EXECUTE format(
      'CREATE POLICY authenticated_full_access ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true);',
      t
    );
  END LOOP;
END $$;
