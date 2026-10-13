begin;

-- Match the admin file picker: accept any image or video MIME subtype.
update storage.buckets
set allowed_mime_types = array['image/*', 'video/*']
where id = 'portfolio-media';

commit;
