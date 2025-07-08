
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admin users table (separate from auth.users for admin-specific data)
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create past papers table
CREATE TABLE public.past_papers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  paper_type TEXT NOT NULL,
  year INTEGER NOT NULL,
  session TEXT NOT NULL,
  question_paper_url TEXT,
  mark_scheme_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create video lessons table
CREATE TABLE public.video_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  topic TEXT NOT NULL,
  unit TEXT NOT NULL,
  description TEXT,
  notes_url TEXT,
  thumbnail_url TEXT,
  duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  tags TEXT[],
  category TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  read_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resources table
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_size TEXT,
  resource_type TEXT NOT NULL,
  subject TEXT,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  quote TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact messages table
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  replied BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.past_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admin users can manage all data" ON public.admin_users
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "Admin users can manage past papers" ON public.past_papers
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "Admin users can manage video lessons" ON public.video_lessons
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "Admin users can manage blog posts" ON public.blog_posts
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "Admin users can manage resources" ON public.resources
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "Admin users can manage testimonials" ON public.testimonials
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "Admin users can manage contact messages" ON public.contact_messages
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

-- Create public read policies for frontend
CREATE POLICY "Public can read published blog posts" ON public.blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Public can read past papers" ON public.past_papers
  FOR SELECT USING (true);

CREATE POLICY "Public can read video lessons" ON public.video_lessons
  FOR SELECT USING (true);

CREATE POLICY "Public can read resources" ON public.resources
  FOR SELECT USING (true);

CREATE POLICY "Public can read active testimonials" ON public.testimonials
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can insert contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Create function to handle new admin user creation
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_users (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new admin users (you'll need to manually add admin emails)
-- CREATE TRIGGER on_auth_user_created_admin
--   AFTER INSERT ON auth.users
--   FOR EACH ROW
--   WHEN (NEW.email IN ('kweku@example.com')) -- Add admin emails here
--   EXECUTE FUNCTION public.handle_new_admin_user();
