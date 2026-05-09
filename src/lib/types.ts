/* eslint-disable @typescript-eslint/no-empty-object-type */

/** ================================================
 *  Database Types — Simplified 3-Stage Workflow
 *  ================================================ */

export type UserRole = 'admin' | 'salesperson' | 'store_manager';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role_id: string | null;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  email: string | null;
  total_sales: number;
  total_payments_received: number;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  total_purchases: number;
  total_payments_made: number;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Material {
  id: string;
  name: string;
  category: 'Sheet' | 'Hardware' | 'Cushion' | 'PVC' | 'Brass' | 'Pegs' | 'Glass' | 'Other';
  unit: string;
  stock_quantity: number;
  unit_cost: number;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: string;
  customer_id: string;
  customer?: Customer;
  source: 'Showroom' | 'Instagram' | 'WhatsApp' | 'Reference' | 'Walk-in' | 'Online' | 'Other';
  sale_date: string;
  total_amount: number;
  payment_received: number;
  payment_method: 'Cash' | 'Bank Transfer' | 'JazzCash' | 'EasyPaisa' | 'Other' | '';
  remaining_balance: number;
  order_delivered: boolean;
  sale_completed: boolean;
  created_at: string;
  updated_at: string;
  items?: SaleItem[];
  materials?: MaterialUsage[];
}

export interface SaleItem {
  id: string;
  sale_id: string;
  item_name: string;
  quantity: number;
  sale_amount: number;
  created_at: string;
}

export interface MaterialUsage {
  id: string;
  sale_id: string;
  material_id: string;
  material?: Material;
  quantity_used: number;
  unit_cost: number;
  total_cost: number;
  created_at: string;
}

export interface InventoryAddition {
  id: string;
  material_id: string;
  material?: Material;
  quantity_added: number;
  unit_cost: number;
  total_cost: number;
  supplier_id: string | null;
  supplier?: Supplier;
  amount_paid: number;
  date: string;
  created_at: string;
}

export interface AccountReceivable {
  id: string;
  customer_id: string;
  customer?: Customer;
  sale_id: string;
  sale?: Sale;
  total_amount: number;
  amount_paid: number;
  balance: number;
  status: 'unpaid' | 'partial' | 'paid';
  created_at: string;
  updated_at: string;
}

export interface AccountPayable {
  id: string;
  supplier_id: string;
  supplier?: Supplier;
  purchase_id: string;
  purchase?: InventoryAddition;
  total_amount: number;
  amount_paid: number;
  balance: number;
  status: 'unpaid' | 'partial' | 'paid';
  created_at: string;
  updated_at: string;
}

export interface PaymentReceived {
  id: string;
  customer_id: string;
  customer?: Customer;
  sale_id: string | null;
  amount: number;
  method: 'Cash' | 'Bank Transfer' | 'JazzCash' | 'EasyPaisa' | 'Other';
  payment_date: string;
  created_at: string;
}

export interface PaymentMade {
  id: string;
  supplier_id: string;
  supplier?: Supplier;
  purchase_id: string | null;
  amount: number;
  method: 'Cash' | 'Bank Transfer' | 'JazzCash' | 'EasyPaisa' | 'Other';
  payment_date: string;
  created_at: string;
}

export interface Notification {
  id: string;
  type: 'low_stock' | 'receivable_pending' | 'payable_pending' | 'sale_completed';
  message: string;
  is_read: boolean;
  created_at: string;
}

// Dashboard Computed
export interface DashboardKPIs {
  totalSalesMonth: number;
  paymentsReceivedMonth: number;
  outstandingReceivablesTotal: number;
  outstandingPayablesTotal: number;
  stockValue: number;
  lowStockCount: number;
}
