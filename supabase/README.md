# Portfolio Supabase setup

These migrations prepare a new Supabase project. The React app now uses Supabase for content, admin sign-in, and media uploads.
Database migrations do not automatically transfer existing Firebase data/files.

## Apply migrations

In your project's Supabase Dashboard, open **SQL Editor** and run these files in order:

1. `migrations/20261013000100_portfolio_content.sql`
2. `migrations/20261013000200_portfolio_media.sql`
3. `migrations/20261013000300_allow_svg_media.sql`
4. `migrations/20261013000400_allow_image_and_video_formats.sql`

Run each file once. They create `projects`, `blogs`, `portfolio_admins`, and the
public `portfolio-media` storage bucket. All content rows and bucket files are
publicly readable; only allowlisted Supabase Auth users can modify them.
There is no private draft state in the current app or this schema.

Alternatively, with the Supabase CLI installed, initialize local configuration
with `supabase init`, then run:

```sh
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

## Add your admin account

Create your user in **Authentication → Users** and copy its user UUID.
Run this in SQL Editor, replacing the example with that UUID:

```sql
insert into public.portfolio_admins (user_id)
values ('YOUR_AUTH_USER_UUID'::uuid)
on conflict (user_id) do nothing;
```

Do not add every signed-in user to this table. Users cannot grant themselves admin
access through the app. To remove access, delete their allowlist row in SQL Editor.

## App configuration

Paste the project URL and publishable (or legacy anon) key into the two entries
in the root `.env.local` file. Restart the development server. The `.env.local`
file is ignored by Git; `.env.example` documents the required variables.
For Vercel, add the same variables in the project settings and redeploy.

Open `/admin` and sign in with your allowlisted Supabase Auth account.
Firebase Analytics has been removed with the Firebase client dependency.

Files upload to the public `portfolio-media` bucket, up to 50 MiB each.
All image and video MIME subtypes are allowed, including SVG, PNG, JPEG, WebP,
GIF, AVIF, HEIC, MP4, and WebM. Preview support depends on the browser.
IDs are text so Firestore IDs can be retained during import. Normalize legacy
arrays/aliases before importing into the string fields used by the current form.
Keep Firebase data until content and media have been verified in Supabase.

## Verify after applying

1. Confirm all three tables have Row Level Security enabled and the bucket exists.
2. With the public key and no session, confirm content reads succeed and writes fail.
3. With a signed-in user absent from `portfolio_admins`, confirm inserts/uploads
   fail and updates/deletes affect no rows. Supabase can return an empty successful
   response for blocked updates/deletes; check stored data as well.
4. Sign in as the allowlisted admin and confirm create, edit, delete, and media
   upload work; confirm `updated_at` changes on edit.
5. Confirm a public media URL loads without signing in.

## Migration performed

The schema and storage migrations were applied through SQL Editor to project
`qeaffimzochexemiozru`. Both Firebase projects were copied with their original IDs
and form fields verified against the backup. Firebase contained no blog posts and
neither project referenced uploaded media. No Firebase data was deleted.

The public project and blog reads, storage bucket configuration, RLS policies,
production build, and local projects/admin sign-in pages have been verified.
The account you created has been allowlisted as the portfolio admin.
Password sign-in and actual file upload have not been exercised in this session;
the local sign-in page renders and database/storage policies are configured.

The original export is in `backups/firebase-content.json`, with repeatable import
SQL in `backups/import-content.sql` (both ignored by Git). To export again, run
`node scripts/migration/export-firebase.mjs` from the repository root. Source
collections must allow public reads, otherwise an authorized Firebase export is
required. This script retains media URLs rather than moving files.

Use `verify-public-access.sql` for transactionally rolled-back permission checks.
The migrations were run in Dashboard SQL Editor, so do not run `db push` against
this project without first reconciling CLI migration history.

