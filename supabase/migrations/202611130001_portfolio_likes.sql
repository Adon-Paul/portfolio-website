-- Shared portfolio likes: no raw visitor records are exposed to the browser.
begin;
create table if not exists public.portfolio_likes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.portfolio_likes enable row level security;
revoke all on public.portfolio_likes from public, anon, authenticated;

create or replace function public.portfolio_like_state()
returns jsonb language sql stable security definer set search_path = ''
as $$
  select jsonb_build_object(
    'count', (select count(*) from public.portfolio_likes),
    'liked', exists(select 1 from public.portfolio_likes where user_id = auth.uid())
  );
$$;
revoke all on function public.portfolio_like_state() from public, anon, authenticated;
grant execute on function public.portfolio_like_state() to anon, authenticated;

create or replace function public.set_portfolio_like(p_liked boolean)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare visitor uuid := auth.uid();
begin
  if visitor is null then raise exception 'Authentication required' using errcode = '28000'; end if;
  if p_liked is null then raise exception 'Like state required' using errcode = '22023'; end if;
  -- Serialize requests for this identity; retries cannot manufacture extra likes.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(visitor::text, 13011));
  if p_liked then
    insert into public.portfolio_likes(user_id) values(visitor) on conflict(user_id) do nothing;
  else
    delete from public.portfolio_likes where user_id = visitor;
  end if;
  return public.portfolio_like_state();
end;
$$;
revoke all on function public.set_portfolio_like(boolean) from public, anon, authenticated;
grant execute on function public.set_portfolio_like(boolean) to authenticated;
commit;
