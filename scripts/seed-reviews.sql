
-- Seed data for reviews
INSERT INTO public.reviews (vehicle_id, reviewer_id, rating, comment, title, created_at)
SELECT 
    v.id as vehicle_id, 
    u.id as reviewer_id, 
    5 as rating, 
    'Absolutely incredible experience! The car was in perfect condition and the process was seamless.' as comment,
    'Great Ride!' as title,
    NOW() - INTERVAL '2 days' as created_at
FROM public.vehicles v, public.users u
WHERE u.user_type = 'buyer'
LIMIT 3;

INSERT INTO public.reviews (vehicle_id, reviewer_id, rating, comment, title, created_at)
SELECT 
    v.id as vehicle_id, 
    u.id as reviewer_id, 
    4 as rating, 
    'Very clean car and responsive owner. Highly recommended for weekend trips.' as comment,
    'Excellent Service' as title,
    NOW() - INTERVAL '1 week' as created_at
FROM public.vehicles v, public.users u
WHERE u.user_type = 'buyer'
OFFSET 1
LIMIT 3;
