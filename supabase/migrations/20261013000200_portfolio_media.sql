begin;

-- Public portfolio assets, with a 50 MiB limit matching the Free plan.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media', 'portfolio-media', true, 52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
        'video/mp4', 'video/webm', 'video/quicktime']
);

-- Public buckets serve public URLs without a SELECT policy. This policy also
-- permits listing/reading metadata through the Storage API.
create policy "Public can read portfolio media" on storage.objects
  for select to anon, authenticated using (bucket_id = 'portfolio-media');

create policy "Admins can upload portfolio media" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'portfolio-media'
    and exists (select 1 from public.portfolio_admins where user_id = (select auth.uid()))
  );
create policy "Admins can update portfolio media" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'portfolio-media'
    and exists (select 1 from public.portfolio_admins where user_id = (select auth.uid()))
  )
  with check (
    bucket_id = 'portfolio-media'
    and exists (select 1 from public.portfolio_admins where user_id = (select auth.uid()))
  );
create policy "Admins can delete portfolio media" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'portfolio-media'
    and exists (select 1 from public.portfolio_admins where user_id = (select auth.uid()))
  );

commit;
