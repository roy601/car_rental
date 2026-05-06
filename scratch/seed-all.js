
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hnktyfgxgqxybmeapsne.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhua3R5Zmd4Z3F4eWJtZWFwc25lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA4OTQ2MywiZXhwIjoyMDg4NjY1NDYzfQ.F-JFxy8ScoH76XF5FdML9OkTnem0bqDb0Bne5jM8KnI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedAllVehicles() {
  const { data: vehicles } = await supabase.from('vehicles').select('id');
  const { data: users } = await supabase.from('users').select('id').eq('user_type', 'buyer').limit(3);
  
  if (!vehicles?.length || !users?.length) {
    console.error('Need vehicles and buyer users.');
    return;
  }

  const reviews = [];
  const comments = [
    "Great experience! The car was perfect for our trip.",
    "Responsive owner and clean vehicle. 5 stars!",
    "Smooth ride, easy pickup. Highly recommended.",
    "Excellent condition, very well maintained.",
    "Would rent again! Fantastic service."
  ];

  vehicles.forEach((v, i) => {
    // Add 1-3 reviews per vehicle
    const numReviews = Math.floor(Math.random() * 3) + 1;
    for(let j=0; j<numReviews; j++) {
      const user = users[Math.floor(Math.random() * users.length)];
      reviews.push({
        vehicle_id: v.id,
        reviewer_id: user.id,
        rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
        title: 'Verified Review',
        comment: comments[Math.floor(Math.random() * comments.length)]
      });
    }
  });

  const { error } = await supabase.from('reviews').insert(reviews);
  if (error) {
    console.error('Error seeding reviews:', error);
  } else {
    console.log(`Successfully seeded ${reviews.length} reviews across ${vehicles.length} vehicles.`);
  }
}

seedAllVehicles();
