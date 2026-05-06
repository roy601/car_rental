
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hnktyfgxgqxybmeapsne.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhua3R5Zmd4Z3F4eWJtZWFwc25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODk0NjMsImV4cCI6MjA4ODY2NTQ2M30.sGfxLFJRCaNLSYVFAwi5Yjons7yUy4PKswHo0VVWyAk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Columns in reviews table:', Object.keys(data[0] || {}));
  }
}

checkColumns();
