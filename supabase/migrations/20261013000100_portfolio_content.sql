begin;

-- Only dashboard/SQL administrators can change this allowlist.
create table public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.portfolio_admins enable row level security;
revoke all on public.portfolio_admins from anon, authenticated;
grant select on public.portfolio_admins to authenticated;
grant all on public.portfolio_admins to service_role;
create policy "Admins can read their own membership"
  on public.portfolio_admins for select to authenticated
  using (user_id = (select auth.uid()));

-- Text IDs allow Firestore document IDs to be retained during import.
-- Field names match the current React forms, including desc and customLanguage.
create table public.projects (
  id text primary key default gen_random_uuid()::text,
  title text not null default '',
  "desc" text not null default '',
  content text not null default '',
  tech text not null default '',
  language text not null default '',
  "customLanguage" text not null default '',
  media text not null default '',
  highlights text not null default '',
  github text not null default '',
  demo text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.blogs (
  id text primary key default gen_random_uuid()::text,
  title text not null default '',
  "desc" text not null default '',
  content text not null default '',
  -- Keep the existing display date as text; use created_at for date sorting.
  date text not null default '',
  tech text not null default '',
  language text not null default '',
  "customLanguage" text not null default '',
  media text not null default '',
  highlights text not null default '',
  github text not null default '',
  demo text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_media_idx on public.projects (media);
create index blogs_created_at_idx on public.blogs (created_at desc);

create function public.set_portfolio_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function public.set_portfolio_updated_at() from public, anon, authenticated;

create trigger projects_updated_at before update on public.projects
  for each row execute function public.set_portfolio_updated_at();
create trigger blogs_updated_at before update on public.blogs
  for each row execute function public.set_portfolio_updated_at();

alter table public.projects enable row level security;
alter table public.blogs enable row level security;
revoke all on public.projects, public.blogs from anon, authenticated;
grant select on public.projects, public.blogs to anon, authenticated;
grant insert, update, delete on public.projects, public.blogs to authenticated;
grant all on public.projects, public.blogs to service_role;

create policy "Public can read projects" on public.projects
  for select to anon, authenticated using (true);
create policy "Public can read blogs" on public.blogs
  for select to anon, authenticated using (true);

create policy "Admins can manage projects" on public.projects
  for all to authenticated
  using (exists (select 1 from public.portfolio_admins where user_id = (select auth.uid())))
  with check (exists (select 1 from public.portfolio_admins where user_id = (select auth.uid())));
create policy "Admins can manage blogs" on public.blogs
  for all to authenticated
  using (exists (select 1 from public.portfolio_admins where user_id = (select auth.uid())))
  with check (exists (select 1 from public.portfolio_admins where user_id = (select auth.uid())));

commit;
