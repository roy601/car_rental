
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hnktyfgxgqxybmeapsne.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhua3R5Zmd4Z3F4eWJtZWFwc25lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA4OTQ2MywiZXhwIjoyMDg4NjY1NDYzfQ.F-JFxy8ScoH76XF5FdML9OkTnem0bqDb0Bne5jM8KnI'; // Service role key
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedReviews() {
  const { data: vehicles } = await supabase.from('vehicles').select('id').limit(1);
  const { data: users } = await supabase.from('users').select('id').eq('user_type', 'buyer').limit(1);
  
  if (!vehicles?.length || !users?.length) {
    console.error('Need at least one vehicle and one buyer user to seed reviews.');
    return;
  }

  const vehicleId = vehicles[0].id;
  const userId = users[0].id;

  const reviews = [
    {
      vehicle_id: vehicleId,
      reviewer_id: userId,
      rating: 5,
      title: 'Amazing car!',
      comment: 'The car was in perfect condition and the owner was very helpful. Highly recommended!'
    },
    {
      vehicle_id: vehicleId,
      reviewer_id: userId,
      rating: 4,
      title: 'Smooth experience',
      comment: 'Very easy to rent and drive. Will definitely rent again.'
    }
  ];

  const { error } = await supabase.from('reviews').insert(reviews);
  if (error) {
    console.error('Error seeding reviews:', error);
  } else {
    console.log('Successfully seeded 2 reviews.');
  }
}

seedReviews();
