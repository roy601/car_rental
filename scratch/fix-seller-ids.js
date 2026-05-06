
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hnktyfgxgqxybmeapsne.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhua3R5Zmd4Z3F4eWJtZWFwc25lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA4OTQ2MywiZXhwIjoyMDg4NjY1NDYzfQ.F-JFxy8ScoH76XF5FdML9OkTnem0bqDb0Bne5jM8KnI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixSellerIds() {
  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('id, vehicle_id')
    .is('seller_id', null);
  
  if (reviewsError) {
    console.error('Error fetching reviews:', reviewsError);
    return;
  }

  console.log(`Found ${reviews.length} reviews without seller_id.`);

  for (const review of reviews) {
    const { data: vehicle } = await supabase
      .from('vehicles')
      .select('seller_id')
      .eq('id', review.vehicle_id)
      .single();
    
    if (vehicle) {
      const { error: updateError } = await supabase
        .from('reviews')
        .update({ seller_id: vehicle.seller_id })
        .eq('id', review.id);
      
      if (updateError) {
        console.error(`Error updating review ${review.id}:`, updateError);
      } else {
        console.log(`Updated review ${review.id} with seller_id ${vehicle.seller_id}`);
      }
    }
  }
}

fixSellerIds();
