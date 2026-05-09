/**
 * Demo Data Provider — The Ledger ERP
 * Provides realistic seed data matching the design screen values.
 * Used when Supabase is not configured or for development.
 */

import {
  Customer, Supplier, Material,
  AccountReceivable, AccountPayable,
  Notification, DashboardKPIs
} from './types';

// ---- Dashboard KPIs ----
export const demoKPIs: DashboardKPIs = {
  totalSalesMonth: 142850.00,
  paymentsReceivedMonth: 98000.00,
  outstandingReceivablesTotal: 42105,
  outstandingPayablesTotal: 12440,
  stockValue: 128650,
  lowStockCount: 14,
};

// ---- Customers ----
export const demoCustomers: Customer[] = [
  {
    id: '1', name: 'Bark & Steel Co.',
    email: 'info@barksteel.com', phone: '+1-555-0101', address: '42 Industrial Ave, NY',
    total_sales: 50000, total_payments_received: 37550, balance: 12450.00,
    created_at: '2024-01-15T00:00:00Z', updated_at: '2024-10-20T00:00:00Z',
  },
  {
    id: '2', name: 'Loom & Oak Interiors',
    email: 'sales@loomoak.com', phone: '+1-555-0202', address: '18 Design Blvd, LA',
    total_sales: 30000, total_payments_received: 25879.50, balance: 4120.50,
    created_at: '2024-03-22T00:00:00Z', updated_at: '2024-10-18T00:00:00Z',
  },
  {
    id: '3', name: 'Forge & Velvet',
    email: 'hello@forgevelvet.com', phone: '+1-555-0303', address: '99 Craft St, Chicago',
    total_sales: 25000, total_payments_received: 25000, balance: 0.00,
    created_at: '2024-02-10T00:00:00Z', updated_at: '2024-08-05T00:00:00Z',
  },
  {
    id: '4', name: 'Midnight Craftsmen',
    email: 'team@midnightcraft.com', phone: '+1-555-0404', address: '7 Workshop Lane, SF',
    total_sales: 40000, total_payments_received: 31059.25, balance: 8940.75,
    created_at: '2024-04-01T00:00:00Z', updated_at: '2024-10-22T00:00:00Z',
  },
  {
    id: '5', name: 'Grand Oak Interiors',
    email: 'info@grandoak.com', phone: '+1-555-0505', address: '120 Main St, Boston',
    total_sales: 150000, total_payments_received: 107149.88, balance: 42850.12,
    created_at: '2023-06-15T00:00:00Z', updated_at: '2024-10-14T00:00:00Z',
  },
];

// ---- Suppliers ----
export const demoSuppliers: Supplier[] = [
  {
    id: '1', name: 'Oak & Co. Lumber',
    phone: '+1-555-1001',
    address: '200 Lumber Road, Oregon', balance: 42500.00,
    total_purchases: 85000, total_payments_made: 42500,
    created_at: '2023-01-01T00:00:00Z', updated_at: '2024-10-20T00:00:00Z',
  },
  {
    id: '2', name: 'Steel Forge Int.',
    phone: '+1-555-1002',
    address: '88 Metal Ave, Pittsburgh', balance: 18240.50,
    total_purchases: 36481, total_payments_made: 18240.50,
    created_at: '2023-03-15T00:00:00Z', updated_at: '2024-10-15T00:00:00Z',
  },
  {
    id: '3', name: 'Velvet Global',
    phone: '+1-555-1003',
    address: '45 Textile St, Mumbai', balance: 9800.00,
    total_purchases: 19600, total_payments_made: 9800,
    created_at: '2023-05-20T00:00:00Z', updated_at: '2024-10-10T00:00:00Z',
  },
  {
    id: '4', name: 'Apex Logistics',
    phone: '+1-555-1004',
    address: '12 Transport Hub, Dallas', balance: 12050.00,
    total_purchases: 24100, total_payments_made: 12050,
    created_at: '2023-08-01T00:00:00Z', updated_at: '2024-10-18T00:00:00Z',
  },
];

// ---- Materials ----
export const demoMaterials: Material[] = [
  {
    id: '1', name: 'Black Walnut Planks', category: 'Sheet',
    unit: 'bd ft', stock_quantity: 120, unit_cost: 28.50,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-10-20T00:00:00Z',
  },
  {
    id: '2', name: 'Brushed Brass Tubing', category: 'Brass',
    unit: 'units', stock_quantity: 1450, unit_cost: 12.80,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-10-18T00:00:00Z',
  },
  {
    id: '3', name: 'European Linen - Flax', category: 'Cushion',
    unit: 'yards', stock_quantity: 840, unit_cost: 45.00,
    created_at: '2024-02-15T00:00:00Z', updated_at: '2024-10-19T00:00:00Z',
  },
  {
    id: '4', name: 'Tempered Glass Panes', category: 'Glass',
    unit: 'sheets', stock_quantity: 42, unit_cost: 89.00,
    created_at: '2024-03-10T00:00:00Z', updated_at: '2024-10-21T00:00:00Z',
  },
];

// ---- Accounts Receivable ----
export const demoReceivables: AccountReceivable[] = [
  {
    id: '1', customer_id: '5', sale_id: 'sale-001',
    total_amount: 42500.00, amount_paid: 0, balance: 42500.00,
    status: 'unpaid',
    created_at: '2024-08-01T00:00:00Z', updated_at: '2024-10-20T00:00:00Z',
  },
  {
    id: '2', customer_id: '4', sale_id: 'sale-002',
    total_amount: 18200.50, amount_paid: 0, balance: 18200.50,
    status: 'unpaid',
    created_at: '2024-08-15T00:00:00Z', updated_at: '2024-10-20T00:00:00Z',
  },
  {
    id: '3', customer_id: '1', sale_id: 'sale-003',
    total_amount: 8900.00, amount_paid: 4000, balance: 4900.00,
    status: 'partial',
    created_at: '2024-09-05T00:00:00Z', updated_at: '2024-10-20T00:00:00Z',
  },
];

// ---- Accounts Payable ----
export const demoPayables: AccountPayable[] = [
  {
    id: '1', supplier_id: '1', purchase_id: 'purchase-001',
    total_amount: 42500.00, amount_paid: 0, balance: 42500.00,
    status: 'unpaid',
    created_at: '2024-10-01T00:00:00Z', updated_at: '2024-10-20T00:00:00Z',
  },
  {
    id: '2', supplier_id: '2', purchase_id: 'purchase-002',
    total_amount: 18240.50, amount_paid: 0, balance: 18240.50,
    status: 'unpaid',
    created_at: '2024-10-05T00:00:00Z', updated_at: '2024-10-20T00:00:00Z',
  },
  {
    id: '3', supplier_id: '3', purchase_id: 'purchase-003',
    total_amount: 9800.00, amount_paid: 0, balance: 9800.00,
    status: 'unpaid',
    created_at: '2024-09-15T00:00:00Z', updated_at: '2024-10-20T00:00:00Z',
  },
  {
    id: '4', supplier_id: '4', purchase_id: 'purchase-004',
    total_amount: 12050.00, amount_paid: 0, balance: 12050.00,
    status: 'unpaid',
    created_at: '2024-10-10T00:00:00Z', updated_at: '2024-10-20T00:00:00Z',
  },
];

// ---- Notifications ----
export const demoNotifications: Notification[] = [
  {
    id: '1', type: 'receivable_pending',
    message: 'INV from Grand Oak Interiors has an outstanding balance of PKR 42,500',
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2', type: 'low_stock',
    message: 'Black Walnut Planks is running low on stock (120 units remaining)',
    is_read: false,
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '3', type: 'payable_pending',
    message: 'Payment to Oak & Co. Lumber is pending (PKR 42,500)',
    is_read: true,
    created_at: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: '4', type: 'sale_completed',
    message: 'Sale to Forge & Velvet has been completed successfully',
    is_read: true,
    created_at: new Date(Date.now() - 28800000).toISOString(),
  },
];

// ---- Monthly Sales Data (for charts) ----
export const demoMonthlySales = [
  { month: 'JAN', sales: 185000, margin: 78000 },
  { month: 'FEB', sales: 152000, margin: 61000 },
  { month: 'MAR', sales: 210000, margin: 95000 },
  { month: 'APR', sales: 130000, margin: 52000 },
  { month: 'MAY', sales: 175000, margin: 70000 },
];
