-- Per-publication registration form toggle.
-- Existing registrations continue to use EventRegistration and /api/send-telegram.
ALTER TABLE public.cms_news
  ADD COLUMN IF NOT EXISTS registration_enabled boolean NOT NULL DEFAULT false;

-- Preserve the current public view columns and append the new flag.
CREATE OR REPLACE VIEW public.cms_published_news
WITH (security_invoker = true)
AS
SELECT id, slug, title, summary, body, category, image_url, published_at,
       banner_image_url, registration_enabled
FROM public.cms_news
WHERE status = 'published';

GRANT SELECT ON public.cms_published_news TO anon, authenticated;
