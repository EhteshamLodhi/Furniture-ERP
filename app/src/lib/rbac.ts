import { UserRole } from './types';

/**
 * Role-Based Access Control — The Ledger ERP
 *
 * Admin: Full access
 * Accounts Manager: Finance dashboards, Receivables, Payables, Reports
 * Salesperson: Customers, Orders
 * Store Manager: Materials, Purchases, Stock movement
 */

type Module =
  | 'dashboard'
  | 'customers'
  | 'orders'
  | 'inventory'
  | 'receivables'
  | 'payables'
  | 'showrooms'
  | 'ledger'
  | 'reports'
  | 'notifications'
  | 'settings'
  | 'suppliers';

type Action = 'view' | 'create' | 'edit' | 'delete';

const permissions: Record<UserRole, Record<Module, Action[]>> = {
  admin: {
    dashboard: ['view'],
    customers: ['view', 'create', 'edit', 'delete'],
    orders: ['view', 'create', 'edit', 'delete'],
    inventory: ['view', 'create', 'edit', 'delete'],
    receivables: ['view', 'create', 'edit', 'delete'],
    payables: ['view', 'create', 'edit', 'delete'],
    showrooms: ['view', 'create', 'edit', 'delete'],
    ledger: ['view', 'create', 'edit', 'delete'],
    reports: ['view', 'create'],
    notifications: ['view', 'create', 'edit'],
    settings: ['view', 'create', 'edit', 'delete'],
    suppliers: ['view', 'create', 'edit', 'delete'],
  },

  salesperson: {
    dashboard: ['view'],
    customers: ['view', 'create', 'edit'],
    orders: ['view', 'create', 'edit'],
    inventory: ['view'],
    receivables: ['view'],
    payables: [],
    showrooms: ['view'],
    ledger: ['view'],
    reports: ['view'],
    notifications: ['view', 'edit'],
    settings: [],
    suppliers: [],
  },
  store_manager: {
    dashboard: ['view'],
    customers: ['view'],
    orders: ['view'],
    inventory: ['view', 'create', 'edit'],
    receivables: [],
    payables: ['view'],
    showrooms: ['view'],
    ledger: ['view'],
    reports: ['view'],
    notifications: ['view', 'edit'],
    settings: [],
    suppliers: ['view', 'create', 'edit'],
  },
};

export function hasPermission(role: UserRole, module: Module, action: Action): boolean {
  return permissions[role]?.[module]?.includes(action) ?? false;
}

export function getAccessibleModules(role: UserRole): Module[] {
  return Object.entries(permissions[role])
    .filter(([, actions]) => actions.length > 0)
    .map(([module]) => module as Module);
}

export function canAccessModule(role: UserRole, module: Module): boolean {
  return (permissions[role]?.[module]?.length ?? 0) > 0;
}
