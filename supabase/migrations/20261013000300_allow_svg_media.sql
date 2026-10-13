begin;

-- Extend the existing allowlist without changing other bucket settings.
update storage.buckets
set allowed_mime_types = array_append(allowed_mime_types, 'image/svg+xml')
where id = 'portfolio-media'
  and allowed_mime_types is not null
  and not ('image/svg+xml' = any (allowed_mime_types));

commit;
