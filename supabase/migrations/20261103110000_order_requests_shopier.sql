alter table public.order_requests
  add column if not exists source text not null default 'form',
  add column if not exists shopier_order_id text,
  add column if not exists paid_total numeric(12,2),
  add column if not exists paid_at timestamptz;

alter table public.order_requests
  drop constraint if exists order_requests_source_check;
alter table public.order_requests
  add constraint order_requests_source_check check (source in ('form', 'shopier'));

create unique index if not exists order_requests_shopier_order_id_key
  on public.order_requests (shopier_order_id) where shopier_order_id is not null;

comment on column public.order_requests.source is 'form = /siparis request; shopier = paid Shopier order (webhook)';
