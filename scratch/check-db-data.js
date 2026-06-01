const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ghotshmeiakxgzdlybzs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdob3RzaG1laWFreGd6ZGx5YnpzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDI5OTM1NiwiZXhwIjoyMDk1ODc1MzU2fQ.YNeSaHj5CWFQdbtDwexQUKSur3KD8hI8EJOf8D7kWZk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Querying DB tables...');
  
  const { data: stores, error: sErr } = await supabase.from('stores').select('*');
  if (sErr) console.error('Stores error:', sErr);
  else console.log('Stores count:', stores.length, 'Stores:', JSON.stringify(stores, null, 2));

  const { data: branches, error: bErr } = await supabase.from('branches').select('*');
  if (bErr) console.error('Branches error:', bErr);
  else console.log('Branches count:', branches.length, 'Branches:', JSON.stringify(branches, null, 2));

  const { data: staff, error: stErr } = await supabase.from('staff').select('*');
  if (stErr) console.error('Staff error:', stErr);
  else console.log('Staff count:', staff.length, 'Staff list:', JSON.stringify(staff.map(s => ({ id: s.id, name: s.name, role: s.role, branch_id: s.branch_id, store_id: s.store_id })), null, 2));
}

run().catch(console.error);
