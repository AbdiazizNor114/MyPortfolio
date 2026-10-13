-- Run in SQL Editor. Every test mutation is rolled back.
begin;
set local role anon;
do $$
begin
  perform id from public.projects limit 1;
  perform id from public.blogs limit 1;
  begin
    insert into public.projects (id, title) values ('__migration_access_test__', 'Permission test');
    raise exception 'Anonymous insert unexpectedly allowed';
  exception when insufficient_privilege then null;
  end;
end;
$$;
reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
do $$
declare changed integer;
begin
  if exists (select 1 from public.portfolio_admins) then
    raise exception 'Non-admin can read admin membership';
  end if;
  begin
    insert into public.blogs (id, title) values ('__migration_access_test__', 'Permission test');
    raise exception 'Non-admin insert unexpectedly allowed';
  exception when insufficient_privilege then null;
  end;
  update public.projects set title = '__permission_test__';
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'Non-admin update unexpectedly allowed'; end if;
  delete from public.projects;
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'Non-admin delete unexpectedly allowed'; end if;
  begin
    insert into storage.objects (bucket_id, name) values ('portfolio-media', '__permission_test__.png');
    raise exception 'Non-admin upload unexpectedly allowed';
  exception when insufficient_privilege then null;
  end;
end;
$$;
rollback;
select 'Public reads and blocked non-admin writes verified' as result;
