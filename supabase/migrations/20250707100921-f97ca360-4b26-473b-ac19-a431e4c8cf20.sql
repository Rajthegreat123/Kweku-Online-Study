
-- Insert an admin user record with the specified email
INSERT INTO public.admin_users (email, full_name, role) 
VALUES ('rajshekharan2020@gmail.com', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;
