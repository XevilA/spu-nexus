-- Fix security issues by enabling RLS on all remaining tables

-- Enable RLS on all tables that might be missing it
ALTER TABLE public.admin_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_included ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_itinerary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_not_included ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

-- Basic policies for the core SPU tables we'll use
CREATE POLICY "Admin only access to admin_whitelist" ON public.admin_whitelist
  FOR ALL USING (public.get_current_user_role() = 'ADMIN');

CREATE POLICY "Public read for contact_info" ON public.contact_info
  FOR SELECT USING (true);

CREATE POLICY "Admin manage contact_info" ON public.contact_info
  FOR ALL USING (public.get_current_user_role() = 'ADMIN');

CREATE POLICY "Public can submit contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can read contact messages" ON public.contact_messages
  FOR SELECT USING (public.get_current_user_role() = 'ADMIN');