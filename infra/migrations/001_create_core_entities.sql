create extension if not exists pgcrypto;

create type user_role as enum (
  'admin',
  'employee',
  'client'
);

create type client_status as enum (
  'active',
  'inactive',
  'archived'
);

create type project_status as enum (
  'active',
  'on_hold',
  'completed',
  'archived'
);

create type document_type as enum (
  'one_off',
  'recurring',
  'media_plan'
);

create type document_status as enum (
  'draft',
  'sent',
  'viewed',
  'signed',
  'rejected',
  'expired',
  'archived'
);

create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text not null,
  role user_role not null,
  client_id uuid,
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  tax_id text,
  primary_contact_name text,
  primary_contact_email text,
  primary_contact_phone text,
  status client_status not null default 'active',
  owner_user_id uuid references users(id) on delete set null,
  google_drive_folder_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table users
  add constraint users_client_id_fkey
  foreign key (client_id) references clients(id) on delete set null;

create table projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  name text not null,
  description text,
  department text,
  status project_status not null default 'active',
  starts_at date,
  ends_at date,
  created_by_user_id uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  created_by_user_id uuid references users(id) on delete set null,
  type document_type not null,
  status document_status not null default 'draft',
  title text not null,
  proposal_number text not null unique,
  currency char(3) not null default 'ILS',
  total_amount numeric(12, 2) not null default 0,
  monthly_amount numeric(12, 2),
  recurring_months integer,
  starts_at date,
  ends_at date,
  content jsonb not null default '{}'::jsonb,
  internal_metadata jsonb not null default '{}'::jsonb,
  public_pdf_drive_file_id text,
  signed_file_drive_file_id text,
  client_portal_token text unique,
  sent_at timestamptz,
  viewed_at timestamptz,
  signed_at timestamptz,
  invoice_checked_at timestamptz,
  invoice_issued_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint documents_amounts_non_negative check (
    total_amount >= 0
    and (monthly_amount is null or monthly_amount >= 0)
  ),
  constraint documents_recurring_months_positive check (
    recurring_months is null or recurring_months > 0
  )
);

create index users_role_idx on users(role);
create index users_client_id_idx on users(client_id);
create index clients_owner_user_id_idx on clients(owner_user_id);
create index projects_client_id_idx on projects(client_id);
create index projects_status_idx on projects(status);
create index documents_client_id_idx on documents(client_id);
create index documents_project_id_idx on documents(project_id);
create index documents_status_idx on documents(status);
create index documents_type_idx on documents(type);
create index documents_signed_without_invoice_idx
  on documents(signed_at)
  where signed_at is not null and invoice_issued_at is null;
