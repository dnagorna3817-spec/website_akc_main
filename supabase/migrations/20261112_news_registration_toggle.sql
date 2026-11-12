-- Apply in Supabase SQL editor after reviewing existing view permissions and RLS.
ALTER TABLE public.cms_news
  ADD COLUMN IF NOT EXISTS registration_enabled boolean NOT NULL DEFAULT false;

-- Keep the published view read-only for public users via underlying RLS.
-- If your existing view has additional columns or filters, preserve them instead.
CREATE OR REPLACE VIEW public.cms_published_news
WITH (security_invoker = true)
AS
SELECT slug, title, summary, category, body, published_at,
       image_url, banner_image_url, registration_enabled
FROM public.cms_news
WHERE status = 'published';
