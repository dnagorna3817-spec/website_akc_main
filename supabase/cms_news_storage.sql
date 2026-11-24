-- Run once in Supabase SQL Editor for AKC news cover uploads.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('cms-news','cms-news',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'];
create policy "CMS admins upload news covers"
on storage.objects for insert to authenticated
with check (bucket_id='cms-news' and exists(select 1 from public.cms_admins a where a.user_id=(select auth.uid())));
create policy "Public read news covers"
on storage.objects for select to anon,authenticated
using (bucket_id='cms-news');
