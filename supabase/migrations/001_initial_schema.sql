-- =============================================
-- THE LEDGER ERP — Simplified 3-Stage Workflow
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clean up old tables if they exist
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS ledger_entries CASCADE;
DROP TABLE IF EXISTS accounts_payable CASCADE;
DROP TABLE IF EXISTS accounts_receivable CASCADE;
DROP TABLE IF EXISTS stock_movements CASCADE;
DROP TABLE IF EXISTS material_purchases CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS showrooms CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS material_usage CASCADE;
DROP TABLE IF EXISTS inventory_additions CASCADE;
DROP TABLE IF EXISTS sale_items CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS payments_received CASCADE;
DROP TABLE IF EXISTS payments_made CASCADE;

-- ---- Roles ----
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL CHECK (name IN ('admin', 'salesperson', 'store_manager')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Users ----
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Customers ----
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  email TEXT,
  total_sales DECIMAL(15,2) DEFAULT 0,
  total_payments_received DECIMAL(15,2) DEFAULT 0,
  balance DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Suppliers ----
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  total_purchases DECIMAL(15,2) DEFAULT 0,
  total_payments_made DECIMAL(15,2) DEFAULT 0,
  balance DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Materials ----
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Sheet', 'Hardware', 'Cushion', 'PVC', 'Brass', 'Pegs', 'Glass', 'Other')),
  unit TEXT DEFAULT 'units',
  stock_quantity DECIMAL(15,2) DEFAULT 0 CHECK (stock_quantity >= 0),
  unit_cost DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Sales (Stage 1 & 3) ----
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  source TEXT NOT NULL CHECK (source IN ('Showroom', 'Instagram', 'WhatsApp', 'Reference', 'Walk-in', 'Online', 'Other')),
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_amount DECIMAL(15,2) DEFAULT 0,
  payment_received DECIMAL(15,2) DEFAULT 0,
  payment_method TEXT CHECK (payment_method IN ('Cash', 'Bank Transfer', 'JazzCash', 'EasyPaisa', 'Other', '')),
  remaining_balance DECIMAL(15,2) GENERATED ALWAYS AS (total_amount - payment_received) STORED,
  order_delivered BOOLEAN DEFAULT FALSE,
  sale_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Sale Items (Stage 1) ----
CREATE TABLE sale_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  sale_amount DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Material Usage (Stage 2) ----
CREATE TABLE material_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE RESTRICT,
  quantity_used DECIMAL(15,2) NOT NULL CHECK (quantity_used > 0),
  unit_cost DECIMAL(15,2) NOT NULL,
  total_cost DECIMAL(15,2) GENERATED ALWAYS AS (quantity_used * unit_cost) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Inventory Additions ----
CREATE TABLE inventory_additions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE RESTRICT,
  quantity_added DECIMAL(15,2) NOT NULL CHECK (quantity_added > 0),
  unit_cost DECIMAL(15,2) NOT NULL,
  total_cost DECIMAL(15,2) GENERATED ALWAYS AS (quantity_added * unit_cost) STORED,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  amount_paid DECIMAL(15,2) DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Accounts Receivable ----
CREATE TABLE accounts_receivable (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  total_amount DECIMAL(15,2) NOT NULL,
  amount_paid DECIMAL(15,2) DEFAULT 0,
  balance DECIMAL(15,2) GENERATED ALWAYS AS (total_amount - amount_paid) STORED,
  status TEXT DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partial', 'paid')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Accounts Payable ----
CREATE TABLE accounts_payable (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
  purchase_id UUID NOT NULL REFERENCES inventory_additions(id) ON DELETE CASCADE,
  total_amount DECIMAL(15,2) NOT NULL,
  amount_paid DECIMAL(15,2) DEFAULT 0,
  balance DECIMAL(15,2) GENERATED ALWAYS AS (total_amount - amount_paid) STORED,
  status TEXT DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partial', 'paid')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Payments Received ----
CREATE TABLE payments_received (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  sale_id UUID REFERENCES sales(id) ON DELETE SET NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  method TEXT NOT NULL CHECK (method IN ('Cash', 'Bank Transfer', 'JazzCash', 'EasyPaisa', 'Other')),
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Payments Made ----
CREATE TABLE payments_made (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
  purchase_id UUID REFERENCES inventory_additions(id) ON DELETE SET NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  method TEXT NOT NULL CHECK (method IN ('Cash', 'Bank Transfer', 'JazzCash', 'EasyPaisa', 'Other')),
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- Notifications ----
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('low_stock', 'receivable_pending', 'payable_pending', 'sale_completed')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TRIGGERS AND AUTOMATION
-- =============================================

-- 1. Automate Stock Reduction on Material Usage
CREATE OR REPLACE FUNCTION reduce_stock_on_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE materials
  SET stock_quantity = stock_quantity - NEW.quantity_used
  WHERE id = NEW.material_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_reduce_stock
AFTER INSERT ON material_usage
FOR EACH ROW EXECUTE FUNCTION reduce_stock_on_usage();

-- 2. Automate Stock Addition on Inventory Purchase
CREATE OR REPLACE FUNCTION add_stock_on_purchase()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE materials
  SET stock_quantity = stock_quantity + NEW.quantity_added,
      unit_cost = NEW.unit_cost
  WHERE id = NEW.material_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_add_stock
AFTER INSERT ON inventory_additions
FOR EACH ROW EXECUTE FUNCTION add_stock_on_purchase();

-- 3. Automatically Create Receivable when Sale is Completed with Balance
CREATE OR REPLACE FUNCTION create_receivable_on_sale_close()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.sale_completed = TRUE AND OLD.sale_completed = FALSE THEN
    IF NEW.remaining_balance > 0 THEN
      INSERT INTO accounts_receivable (customer_id, sale_id, total_amount, amount_paid)
      VALUES (NEW.customer_id, NEW.id, NEW.total_amount, NEW.payment_received);
    END IF;
    -- Also create notification
    INSERT INTO notifications (type, message) 
    VALUES ('sale_completed', 'Sale ' || NEW.id || ' completed successfully.');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_receivable
AFTER UPDATE ON sales
FOR EACH ROW EXECUTE FUNCTION create_receivable_on_sale_close();

-- 4. Automatically Create Payable on Inventory Addition
CREATE OR REPLACE FUNCTION create_payable_on_purchase()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.supplier_id IS NOT NULL AND (NEW.total_cost - NEW.amount_paid) > 0 THEN
    INSERT INTO accounts_payable (supplier_id, purchase_id, total_amount, amount_paid)
    VALUES (NEW.supplier_id, NEW.id, NEW.total_cost, NEW.amount_paid);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_payable
AFTER INSERT ON inventory_additions
FOR EACH ROW EXECUTE FUNCTION create_payable_on_purchase();

-- 5. Automatically Update Receivable & Customer Totals on Payment Received
CREATE OR REPLACE FUNCTION process_payment_received()
RETURNS TRIGGER AS $$
BEGIN
  -- Update Receivable if linked
  IF NEW.sale_id IS NOT NULL THEN
    UPDATE accounts_receivable
    SET amount_paid = amount_paid + NEW.amount,
        status = CASE WHEN (total_amount - (amount_paid + NEW.amount)) <= 0 THEN 'paid' 
                      WHEN (amount_paid + NEW.amount) > 0 THEN 'partial' 
                      ELSE 'unpaid' END
    WHERE sale_id = NEW.sale_id;
    
    -- Also update Sales table payment_received
    UPDATE sales
    SET payment_received = payment_received + NEW.amount
    WHERE id = NEW.sale_id;
  END IF;

  -- Update Customer Totals
  UPDATE customers
  SET total_payments_received = total_payments_received + NEW.amount,
      balance = balance - NEW.amount
  WHERE id = NEW.customer_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_payment_received
AFTER INSERT ON payments_received
FOR EACH ROW EXECUTE FUNCTION process_payment_received();

-- 6. Automatically Update Payable & Supplier Totals on Payment Made
CREATE OR REPLACE FUNCTION process_payment_made()
RETURNS TRIGGER AS $$
BEGIN
  -- Update Payable if linked
  IF NEW.purchase_id IS NOT NULL THEN
    UPDATE accounts_payable
    SET amount_paid = amount_paid + NEW.amount,
        status = CASE WHEN (total_amount - (amount_paid + NEW.amount)) <= 0 THEN 'paid' 
                      WHEN (amount_paid + NEW.amount) > 0 THEN 'partial' 
                      ELSE 'unpaid' END
    WHERE purchase_id = NEW.purchase_id;
  END IF;

  -- Update Supplier Totals
  UPDATE suppliers
  SET total_payments_made = total_payments_made + NEW.amount,
      balance = balance - NEW.amount
  WHERE id = NEW.supplier_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_payment_made
AFTER INSERT ON payments_made
FOR EACH ROW EXECUTE FUNCTION process_payment_made();

-- 7. Update Customer Total Sales & Balance on Sale
CREATE OR REPLACE FUNCTION update_customer_on_sale()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE customers
  SET total_sales = total_sales + NEW.total_amount,
      balance = balance + NEW.remaining_balance
  WHERE id = NEW.customer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_customer_sale
AFTER INSERT ON sales
FOR EACH ROW EXECUTE FUNCTION update_customer_on_sale();

-- 8. Update Supplier Total Purchases & Balance on Purchase
CREATE OR REPLACE FUNCTION update_supplier_on_purchase()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.supplier_id IS NOT NULL THEN
    UPDATE suppliers
    SET total_purchases = total_purchases + NEW.total_cost,
        balance = balance + (NEW.total_cost - NEW.amount_paid)
    WHERE id = NEW.supplier_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_supplier_purchase
AFTER INSERT ON inventory_additions
FOR EACH ROW EXECUTE FUNCTION update_supplier_on_purchase();

-- Low Stock Trigger
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stock_quantity < 10 AND OLD.stock_quantity >= 10 THEN
    INSERT INTO notifications (type, message)
    VALUES ('low_stock', 'Material ' || NEW.name || ' is running low on stock.');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_low_stock
AFTER UPDATE ON materials
FOR EACH ROW EXECUTE FUNCTION check_low_stock();

-- =============================================
-- REALTIME
-- =============================================
-- Header/NotificationHeader subscribe to postgres_changes on this table;
-- without publication membership those subscriptions never fire.
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
