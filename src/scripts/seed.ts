import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seed() {
  console.log('🚀 Starting Supabase Seeding...');

  // 1. Create Admin User
  console.log('--- Creating Admin User ---');
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email: 'admin@ledger.com',
    password: 'Artisan123!',
    email_confirm: true,
    user_metadata: { role: 'admin', full_name: 'Lead Artisan' }
  });

  if (userError) {
    if (userError.message.includes('already exists')) {
      console.log('Admin user already exists.');
    } else {
      console.error('Error creating user:', userError.message);
    }
  } else {
    console.log('Admin user created: admin@ledger.com / Artisan123!');
  }

  // 2. Clear Existing Data (Optional/Careful)
  // console.log('--- Clearing existing data ---');
  // await supabase.from('order_items').delete().neq('id', '0');
  // ... and so on

  // 3. Seed Showrooms
  console.log('--- Seeding Showrooms ---');
  const showrooms = [
    { id: '1', name: 'NY Flagship', location: 'New York', type: 'Primary Hub' },
    { id: '2', name: 'London Hub', location: 'London', type: 'European Ops' },
    { id: '3', name: 'Tokyo Atelier', location: 'Tokyo', type: 'Growth Sector' }
  ];
  await supabase.from('showrooms').upsert(showrooms);

  // 4. Seed Suppliers
  console.log('--- Seeding Suppliers ---');
  const suppliers = [
    { id: '1', name: 'Oak & Co. Lumber', code: 'SUP-001', contact_email: 'orders@oaklumber.com', balance: 42500 },
    { id: '2', name: 'Steel Forge Int.', code: 'SUP-002', contact_email: 'sales@steelforge.com', balance: 18240 },
    { id: '3', name: 'Velvet Global', code: 'SUP-003', contact_email: 'info@velvetglobal.com', balance: 9800 }
  ];
  await supabase.from('suppliers').upsert(suppliers);

  // 5. Seed Customers
  console.log('--- Seeding Customers ---');
  const customers = [
    { id: '1', name: 'Bark & Steel Co.', code: 'CID-2024-001', status: 'active', balance: 12450, credit_limit: 50000, showroom_id: '1' },
    { id: '2', name: 'Loom & Oak Interiors', code: 'CID-2024-042', status: 'overdue', balance: 4120.50, credit_limit: 30000, showroom_id: '2' },
    { id: '3', name: 'Forge & Velvet', code: 'CID-2024-009', status: 'inactive', balance: 0, credit_limit: 25000 },
    { id: '4', name: 'Midnight Craftsmen', code: 'CID-2024-015', status: 'active', balance: 8940.75, credit_limit: 40000, showroom_id: '1' },
    { id: '5', name: 'Grand Oak Interiors', code: 'GO-99201', status: 'active', balance: 42850.12, credit_limit: 150000, showroom_id: '1' }
  ];
  await supabase.from('customers').upsert(customers);

  // 6. Seed Materials
  console.log('--- Seeding Materials ---');
  const materials = [
    { id: '1', name: 'Black Walnut Planks', sku: 'BW-4402-LG', category: 'Wood', unit: 'bd ft', stock_quantity: 120, unit_cost: 28.50, reorder_level: 250 },
    { id: '2', name: 'Brushed Brass Tubing', sku: 'MET-BB-88', category: 'Metal', unit: 'units', stock_quantity: 1450, unit_cost: 12.80, reorder_level: 500 },
    { id: '3', name: 'European Linen - Flax', sku: 'FAB-LIN-01', category: 'Fabrics', unit: 'yards', stock_quantity: 840, unit_cost: 45.00, reorder_level: 200 }
  ];
  await supabase.from('materials').upsert(materials);

  console.log('✅ Seeding Complete!');
}

seed().catch(console.error);
