-- Test Role Switching SQL Script
-- Run these commands in your Supabase SQL Editor to test different dashboard types

-- 1. Check your current user (replace 'your-email@example.com' with your actual email)
SELECT * FROM users WHERE email = 'your-email@example.com';

-- 2. Check if you have a participant record
SELECT * FROM participants WHERE user_id = (
  SELECT id FROM users WHERE email = 'your-email@example.com'
);

-- 3. Make yourself a PARTICIPANT (Student Director in Atlanta)
INSERT INTO participants (user_id, university, status, role, city, created_at)
SELECT 
  id,
  'University of Central Florida',
  'enrolled',
  'Student Director',
  'atlanta',
  NOW()
FROM users 
WHERE email = 'your-email@example.com'
ON CONFLICT (user_id) DO UPDATE SET
  role = 'Student Director',
  city = 'atlanta',
  updated_at = NOW();

-- 4. Make yourself a COMMUNITY user (remove participant record)
DELETE FROM participants WHERE user_id = (
  SELECT id FROM users WHERE email = 'your-email@example.com'
);

-- 5. Check your current role
SELECT 
  u.email,
  u.name,
  p.role,
  p.city,
  p.university,
  CASE 
    WHEN p.role IS NOT NULL THEN 'participant'
    ELSE 'community'
  END as dashboard_type
FROM users u
LEFT JOIN participants p ON u.id = p.user_id
WHERE u.email = 'your-email@example.com';

-- 6. Quick role switcher (run this to toggle between roles)
-- To become a PARTICIPANT:
INSERT INTO participants (user_id, university, status, role, city, created_at)
SELECT 
  id,
  'University of Central Florida',
  'enrolled',
  'Student Director',
  'atlanta',
  NOW()
FROM users 
WHERE email = 'your-email@example.com'
ON CONFLICT (user_id) DO UPDATE SET
  role = 'Student Director',
  city = 'atlanta',
  updated_at = NOW();

-- To become a COMMUNITY user:
-- DELETE FROM participants WHERE user_id = (SELECT id FROM users WHERE email = 'your-email@example.com');
