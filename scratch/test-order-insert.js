const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ghotshmeiakxgzdlybzs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdob3RzaG1laWFreGd6ZGx5YnpzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDI5OTM1NiwiZXhwIjoyMDk1ODc1MzU2fQ.YNeSaHj5CWFQdbtDwexQUKSur3KD8hI8EJOf8D7kWZk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Starting DB insert diagnostics...');
  
  // 1. Fetch branch, customer, product
  const { data: branch, error: bErr } = await supabase.from('branches').select('*').limit(1).single();
  if (bErr) {
    console.error('Error fetching branch:', bErr);
    return;
  }
  console.log('Fetched Branch ID:', branch.id, 'Store ID:', branch.store_id);

  const { data: customer, error: cErr } = await supabase.from('customers').select('*').limit(1).single();
  if (cErr) {
    console.error('Error fetching customer:', cErr);
    return;
  }
  console.log('Fetched Customer ID:', customer.id);

  const { data: product, error: pErr } = await supabase.from('products').select('*').limit(1).single();
  if (pErr) {
    console.error('Error fetching product:', pErr);
    return;
  }
  console.log('Fetched Product ID:', product.id);

  // 2. Try inserting into orders table
  const startDateStr = '2026-06-10';
  const endDateStr = '2026-06-15';
  const eventDateStr = '2026-06-10';

  console.log('Attempting orders insert...');
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      customer_id: customer.id,
      branch_id: branch.id,
      store_id: branch.store_id,
      status: 'scheduled',
      start_date: startDateStr,
      end_date: endDateStr,
      event_date: eventDateStr,
      delivery_method: 'pickup',
      delivery_address: null,
      pickup_address: null,
      subtotal: 1000,
      gst_amount: 0,
      discount: 0,
      discount_type: 'flat',
      advance_amount: 0,
      advance_collected: false,
      advance_payment_method: null,
      advance_collected_at: null,
      total_amount: 1000,
      amount_paid: 0,
      payment_status: 'pending',
      notes: 'Diagnostic test order',
      created_by: null,
      created_at_branch_id: branch.id,
      updated_by: null,
      updated_at_branch_id: branch.id,
    })
    .select()
    .single();

  if (orderErr) {
    console.error('❌ Orders insert FAILED with error:');
    console.error(JSON.stringify(orderErr, null, 2));
    return;
  }

  console.log('✅ Orders insert SUCCEEDED! Order ID:', order.id);

  // 3. Try inserting into order_items table
  console.log('Attempting order_items insert...');
  const { data: orderItem, error: itemErr } = await supabase
    .from('order_items')
    .insert({
      order_id: order.id,
      product_id: product.id,
      quantity: 1,
      price_per_day: 200,
      discount: 0,
      discount_type: 'flat',
      subtotal: 1000,
      gst_percentage: 0,
      base_amount: 1000,
      gst_amount: 0,
    })
    .select();

  if (itemErr) {
    console.error('❌ Order_items insert FAILED with error:');
    console.error(JSON.stringify(itemErr, null, 2));
    
    // Clean up order
    console.log('Cleaning up order...');
    await supabase.from('orders').delete().eq('id', order.id);
    return;
  }

  console.log('✅ Order_items insert SUCCEEDED!');

  // 4. Clean up
  console.log('Cleaning up test data...');
  await supabase.from('order_items').delete().eq('order_id', order.id);
  await supabase.from('orders').delete().eq('id', order.id);
  console.log('Cleanup finished.');
}

run().catch(console.error);
