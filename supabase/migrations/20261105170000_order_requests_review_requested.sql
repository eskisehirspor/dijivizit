-- When the post-delivery "Google'da yorum bırak" e-mail was sent (scripts/review-requests.mjs).
alter table public.order_requests add column if not exists review_requested_at timestamptz;
