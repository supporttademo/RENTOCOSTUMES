const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ghotshmeiakxgzdlybzs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdob3RzaG1laWFreGd6ZGx5YnpzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDI5OTM1NiwiZXhwIjoyMDk1ODc1MzU2fQ.YNeSaHj5CWFQdbtDwexQUKSur3KD8hI8EJOf8D7kWZk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Starting audit fields diagnostics...');
  
  // 1. Fetch branch, customer
  const { data: branch, error: bErr } = await supabase.from('branches').select('*').limit(1).single();
  if (bErr) {
    console.error('Error fetching branch:', bErr);
    return;
  }

  const { data: customer, error: cErr } = await supabase.from('customers').select('*').limit(1).single();
  if (cErr) {
    console.error('Error fetching customer:', cErr);
    return;
  }

  console.log('Testing insert with created_by = null, created_at_branch_id = null...');
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      customer_id: customer.id,
      branch_id: branch.id,
      store_id: branch.store_id,
      status: 'scheduled',
      start_date: '2026-06-10',
      end_date: '2026-06-15',
      event_date: '2026-06-10',
      delivery_method: 'pickup',
      subtotal: 1000,
      gst_amount: 0,
      discount: 0,
      total_amount: 1000,
      amount_paid: 0,
      payment_status: 'pending',
      created_by: null,
      created_at_branch_id: null,
      updated_by: null,
      updated_at_branch_id: null,
    })
    .select()
    .single();

  if (orderErr) {
    console.error('❌ Orders insert with NULL audit fields FAILED with error:');
    console.error(JSON.stringify(orderErr, null, 2));
    return;
  }

  console.log('✅ Orders insert with NULL audit fields SUCCEEDED! Order ID:', order.id);

  // Clean up
  console.log('Cleaning up...');
  await supabase.from('orders').delete().eq('id', order.id);
  console.log('Cleanup finished.');
}

run().catch(console.error);
