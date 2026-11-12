-- Run once in the site_akc Supabase SQL Editor before using two-image publishing.
-- Existing image_url remains the vertical article photo; existing covers are preserved.
alter table public.cms_news add column if not exists banner_image_url text;
-- Public view must expose the banner field for the listing page.
create or replace view public.cms_published_news with (security_invoker=true) as
select id, slug, title, summary, body, category, image_url, banner_image_url, published_at
from public.cms_news where status='published';
grant select on public.cms_published_news to anon, authenticated;
