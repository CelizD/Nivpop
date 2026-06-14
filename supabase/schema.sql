-- NIV'Pop — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- After running, go to Authentication → Policies to verify RLS is active.

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLE: nivpop_resultados
-- Stores every completed quiz result (solo & duo)
-- ============================================================
create table if not exists public.nivpop_resultados (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),

  -- Common fields
  folio       text not null,          -- human-readable ID shown on ticket
  modo        text not null,          -- 'solo-p' | 'solo-t' | 'duo' | 'surprise'
  fecha       text not null,          -- 'YYYY-MM-DD' (local date at time of submission)
  hora        int  not null,          -- 0–23 (local hour at time of submission)

  -- Solo fields (null for duo)
  nombre      text,
  sabor       text,                   -- FlavorId key, e.g. 'fresa'
  scores      jsonb,                  -- { fresa: 3, vainilla: 1, … }

  -- Duo fields (null for solo)
  nombre1     text,
  nombre2     text,
  sabor1      text,
  sabor2      text,
  compat      int,                    -- 0–100 compatibility %
  scores1     jsonb,
  scores2     jsonb
);

-- Indexes for common query patterns
create index if not exists idx_resultados_fecha    on public.nivpop_resultados (fecha);
create index if not exists idx_resultados_modo     on public.nivpop_resultados (modo);
create index if not exists idx_resultados_sabor    on public.nivpop_resultados (sabor);
create index if not exists idx_resultados_sabor1   on public.nivpop_resultados (sabor1);
create index if not exists idx_resultados_sabor2   on public.nivpop_resultados (sabor2);
create index if not exists idx_resultados_created  on public.nivpop_resultados (created_at desc);

-- ============================================================
-- TABLE: nivpop_config
-- Single-row app configuration (kiosk settings, stock, etc.)
-- ============================================================
create table if not exists public.nivpop_config (
  id          int primary key default 1 check (id = 1),  -- enforces single row
  updated_at  timestamptz not null default now(),

  pausado     boolean not null default false,
  brillo      int     not null default 100,   -- screen brightness 0–100
  auto_print  boolean not null default false,

  -- Stock: JSON object { fresa: true, vainilla: true, … }
  -- true = available, false = out of stock
  stock       jsonb   not null default '{}'::jsonb,

  -- Sabor del día override (null = auto-computed from results)
  sabor_del_dia text
);

-- Ensure the single config row exists
insert into public.nivpop_config (id) values (1) on conflict (id) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- nivpop_resultados: public insert, admin-only select/update/delete
alter table public.nivpop_resultados enable row level security;

create policy "resultados_insert_anon"
  on public.nivpop_resultados
  for insert
  to anon
  with check (true);

create policy "resultados_select_authenticated"
  on public.nivpop_resultados
  for select
  to authenticated
  using (true);

create policy "resultados_delete_authenticated"
  on public.nivpop_resultados
  for delete
  to authenticated
  using (true);

-- nivpop_config: public read (kiosk needs it), admin write
alter table public.nivpop_config enable row level security;

create policy "config_select_anon"
  on public.nivpop_config
  for select
  to anon
  using (true);

create policy "config_update_authenticated"
  on public.nivpop_config
  for update
  to authenticated
  using (true)
  with check (true);

-- ============================================================
-- VIEWS (convenience for the admin dashboard)
-- ============================================================

-- Total results count and unique visitors by mode
create or replace view public.v_stats as
select
  count(*)                                   as total,
  count(*) filter (where modo like 'solo%')  as solo,
  count(*) filter (where modo = 'duo')       as duo,
  count(*) filter (where modo = 'surprise')  as surprise
from public.nivpop_resultados;

-- Top flavors (solo results only, sorted by frequency)
create or replace view public.v_top_sabores as
select
  sabor,
  count(*) as total
from public.nivpop_resultados
where sabor is not null
group by sabor
order by total desc;

-- Top flavors for duo (each player counted separately)
create or replace view public.v_top_sabores_duo as
select sabor1 as sabor, count(*) as total
from public.nivpop_resultados where sabor1 is not null
group by sabor1
union all
select sabor2, count(*) from public.nivpop_resultados where sabor2 is not null
group by sabor2
order by total desc;

-- Hourly activity distribution (0–23)
create or replace view public.v_actividad_horaria as
select
  hora,
  count(*) as total
from public.nivpop_resultados
group by hora
order by hora;

-- Daily result counts for the last 30 days
create or replace view public.v_actividad_diaria as
select
  fecha,
  count(*) as total
from public.nivpop_resultados
where fecha >= to_char(now() - interval '30 days', 'YYYY-MM-DD')
group by fecha
order by fecha;

-- ============================================================
-- FUNCTION: folio generator
-- Generates a readable folio like 'NVP-20240614-A3F'
-- Called from the app before inserting a result
-- ============================================================
create or replace function public.generate_folio()
returns text
language plpgsql
as $$
declare
  suffix text;
begin
  suffix := upper(substring(encode(gen_random_bytes(3), 'hex'), 1, 3));
  return 'NVP-' || to_char(now(), 'YYYYMMDD') || '-' || suffix;
end;
$$;

-- ============================================================
-- GRANTS (expose views and function to authenticated role)
-- ============================================================
grant select on public.v_stats               to authenticated;
grant select on public.v_top_sabores         to authenticated;
grant select on public.v_top_sabores_duo     to authenticated;
grant select on public.v_actividad_horaria   to authenticated;
grant select on public.v_actividad_diaria    to authenticated;
grant execute on function public.generate_folio() to anon, authenticated;
