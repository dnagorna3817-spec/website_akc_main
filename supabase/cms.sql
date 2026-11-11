-- AKC CMS. Run in the Supabase SQL editor after reviewing permissions.
create table if not exists public.cms_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
create table if not exists public.cms_content (
  key text primary key check (length(key) between 3 and 120),
  value text not null default '',
  draft text,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);
alter table public.cms_admins enable row level security;
alter table public.cms_content enable row level security;
revoke all on public.cms_admins from anon, authenticated;
grant select on public.cms_admins to authenticated;
grant select on public.cms_content to anon, authenticated;
grant insert, update on public.cms_content to authenticated;
create policy "Admins can see own membership" on public.cms_admins
for select to authenticated using (user_id = (select auth.uid()));
create policy "Anyone can read published content" on public.cms_content
for select to anon, authenticated using (true);
create policy "Admins can insert content" on public.cms_content
for insert to authenticated with check (
 exists(select 1 from public.cms_admins a where a.user_id = (select auth.uid()))
 and updated_by = (select auth.uid())
);
create policy "Admins can edit content" on public.cms_content
for update to authenticated using (
 exists(select 1 from public.cms_admins a where a.user_id = (select auth.uid()))
) with check (
 exists(select 1 from public.cms_admins a where a.user_id = (select auth.uid()))
 and updated_by = (select auth.uid())
);
-- After creating a user in Supabase Authentication, grant access explicitly:
-- insert into public.cms_admins(user_id) values ('USER_UUID');
