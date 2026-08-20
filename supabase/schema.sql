-- ====================================================================
-- Supabase Schema: Electrical Forensics Platform (Multi-Tenant B2B SaaS)
-- ====================================================================

-- 1. Tenants (Organizações / Empresas Clientes White-Label)
create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  branding jsonb default '{"logo":"","primaryColor":"#06b6d4","secondaryColor":"#0f172a"}',
  settings jsonb default '{}',
  created_at timestamptz default now()
);

-- 2. Users (Membros com controle de acesso por Tenant)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null,
  email text unique not null,
  full_name text,
  role text default 'operator', -- operator, perito, admin, viewer
  created_at timestamptz default now()
);

-- 3. Investigations (Casos Periciais e Sessões de Análise)
create table if not exists investigations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null,
  user_id uuid references users(id) on delete set null,
  name text not null,
  station_name text,
  fault_type text,
  severity text default 'NORMAL',
  description text,
  status text default 'completed', -- draft, running, completed, failed
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. COMTRADE Files (Arquivos de Oscilografia IEEE C37.111)
create table if not exists comtrade_files (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null,
  investigation_id uuid references investigations(id) on delete cascade not null,
  file_name text not null,
  file_type text not null, -- 'CFG' ou 'DAT'
  file_size bigint,
  storage_path text,
  sampling_rate_hz double precision,
  frequency_hz double precision,
  uploaded_at timestamptz default now()
);

-- 5. Symmetrical & Harmonic Analysis Results
create table if not exists analysis_results (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null,
  investigation_id uuid references investigations(id) on delete cascade not null,
  rms_va double precision,
  rms_vb double precision,
  rms_vc double precision,
  thd_va double precision,
  thd_vb double precision,
  thd_vc double precision,
  v0_magnitude double precision,
  v1_magnitude double precision,
  v2_magnitude double precision,
  voltage_unbalance_rate double precision,
  fault_classification text,
  confidence double precision,
  created_at timestamptz default now()
);

-- 6. SCADA Logs (Registros temporais complementares)
create table if not exists scada_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null,
  investigation_id uuid references investigations(id) on delete cascade not null,
  timestamp timestamptz not null,
  signal_name text not null,
  value double precision,
  uploaded_at timestamptz default now()
);

-- 7. DGA Results (Análise de Gases Dissolvidos em Transformadores)
create table if not exists dga_results (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null,
  investigation_id uuid references investigations(id) on delete cascade not null,
  sample_date date,
  h2 double precision,
  ch4 double precision,
  c2h4 double precision,
  c2h2 double precision,
  c2h6 double precision,
  co double precision,
  co2 double precision,
  o2 double precision,
  total_combustible_gas double precision,
  uploaded_at timestamptz default now()
);

-- 8. Reports (Laudos Periciais Gerados em PDF / JSON)
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade not null,
  investigation_id uuid references investigations(id) on delete cascade not null,
  report_type text default 'pdf', -- pdf, json, csv
  storage_path text,
  generated_at timestamptz default now()
);

-- ====================================================================
-- Enable Row Level Security (RLS) & Multi-Tenant Isolation
-- ====================================================================
alter table tenants enable row level security;
alter table users enable row level security;
alter table investigations enable row level security;
alter table comtrade_files enable row level security;
alter table analysis_results enable row level security;
alter table scada_logs enable row level security;
alter table dga_results enable row level security;
alter table reports enable row level security;

-- Policies: Usuários acessam apenas dados do seu próprio Tenant
create policy "Tenants isolation policy" on tenants
  for all using (true);

create policy "Users tenant isolation" on users
  for all using (tenant_id = nullif(current_setting('app.current_tenant', true), '')::uuid);

create policy "Investigations tenant isolation" on investigations
  for all using (tenant_id = nullif(current_setting('app.current_tenant', true), '')::uuid);

create policy "COMTRADE files tenant isolation" on comtrade_files
  for all using (tenant_id = nullif(current_setting('app.current_tenant', true), '')::uuid);

create policy "Analysis results tenant isolation" on analysis_results
  for all using (tenant_id = nullif(current_setting('app.current_tenant', true), '')::uuid);

create policy "SCADA logs tenant isolation" on scada_logs
  for all using (tenant_id = nullif(current_setting('app.current_tenant', true), '')::uuid);

create policy "DGA results tenant isolation" on dga_results
  for all using (tenant_id = nullif(current_setting('app.current_tenant', true), '')::uuid);

create policy "Reports tenant isolation" on reports
  for all using (tenant_id = nullif(current_setting('app.current_tenant', true), '')::uuid);