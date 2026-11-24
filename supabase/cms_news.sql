-- AKC CMS news extension. Execute once in Supabase SQL Editor.
create table if not exists public.cms_news (
 id uuid primary key default gen_random_uuid(),
 slug text not null unique check(slug ~ '^[a-z0-9-]+$'),
 title text not null,
 summary text not null default '',
 body text not null default '',
 category text not null default 'Новини' check(category in ('Новини','Статті','План заходів')),
 image_url text,
 status text not null default 'draft' check(status in ('draft','published')),
 created_at timestamptz not null default now(),
 published_at timestamptz,
 updated_by uuid references auth.users(id)
);
alter table public.cms_news enable row level security;
revoke all on public.cms_news from anon,authenticated;
grant select,insert,update,delete on public.cms_news to authenticated;
create policy "CMS admins read news" on public.cms_news for select to authenticated using (exists(select 1 from public.cms_admins a where a.user_id=(select auth.uid())));
create policy "CMS admins insert news" on public.cms_news for insert to authenticated with check (exists(select 1 from public.cms_admins a where a.user_id=(select auth.uid())) and updated_by=(select auth.uid()));
create policy "CMS admins update news" on public.cms_news for update to authenticated using (exists(select 1 from public.cms_admins a where a.user_id=(select auth.uid()))) with check (exists(select 1 from public.cms_admins a where a.user_id=(select auth.uid())) and updated_by=(select auth.uid()));
create policy "CMS admins delete news" on public.cms_news for delete to authenticated using (exists(select 1 from public.cms_admins a where a.user_id=(select auth.uid())));
create or replace view public.cms_published_news with (security_invoker=true) as select id,slug,title,summary,body,category,image_url,published_at from public.cms_news where status='published';
-- Published news can be read anonymously, drafts cannot.
grant select on public.cms_news to anon;
create policy "Public read published news" on public.cms_news for select to anon using (status='published');
grant select on public.cms_published_news to anon,authenticated;
