
-- First, create a security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = $1
  );
$$;

-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Admin users can manage all data" ON public.admin_users;

-- Create new policies using the security definer function
CREATE POLICY "Admin users can manage admin_users table" 
ON public.admin_users 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

-- Update other table policies to use the new function
DROP POLICY IF EXISTS "Admin users can manage blog posts" ON public.blog_posts;
CREATE POLICY "Admin users can manage blog posts" 
ON public.blog_posts 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Admin users can manage contact messages" ON public.contact_messages;
CREATE POLICY "Admin users can manage contact messages" 
ON public.contact_messages 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Admin users can manage past papers" ON public.past_papers;
CREATE POLICY "Admin users can manage past papers" 
ON public.past_papers 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Admin users can manage resources" ON public.resources;
CREATE POLICY "Admin users can manage resources" 
ON public.resources 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Admin users can manage testimonials" ON public.testimonials;
CREATE POLICY "Admin users can manage testimonials" 
ON public.testimonials 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Admin users can manage video lessons" ON public.video_lessons;
CREATE POLICY "Admin users can manage video lessons" 
ON public.video_lessons 
FOR ALL 
USING (public.is_admin_user(auth.uid()));
