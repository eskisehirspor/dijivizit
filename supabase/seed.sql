-- Local development seed. Applied by `npm run db:reset`.
-- Never runs against staging or production.
--
-- Creates one confirmed account so the dashboard can be opened without going
-- through signup every time:
--   email:    demo@dijivizit.com
--   password: Dijivizit123!

do $$
declare
  demo_user_id constant uuid := '11111111-1111-1111-1111-111111111111';
begin
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
  )
  values (
    '00000000-0000-0000-0000-000000000000',
    demo_user_id,
    'authenticated',
    'authenticated',
    'demo@dijivizit.com',
    extensions.crypt('Dijivizit123!', extensions.gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Görkem Sönmez"}'::jsonb
  )
  on conflict (id) do nothing;

  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  )
  values (
    gen_random_uuid(),
    demo_user_id,
    jsonb_build_object('sub', demo_user_id::text, 'email', 'demo@dijivizit.com'),
    'email',
    demo_user_id::text,
    now(),
    now(),
    now()
  )
  on conflict do nothing;

  -- The profile row itself is created by the on_auth_user_created trigger;
  -- here we only fill in card content worth looking at during development.
  update public.profiles
  set
    full_name = 'Görkem Sönmez',
    title = 'Kurucu Ortak',
    company = 'Dijivizit',
    about = 'Dijital kimlik ve temassız kartvizit çözümleri üzerine çalışıyorum. '
            'Son on yılda marka kimliği, ürün tasarımı ve mobil deneyim alanlarında '
            'ekipler kurdum; şimdi profesyonel kimliği tek bir dokunuşla '
            'paylaşılabilir hale getirmeye odaklanıyorum.',
    address = E'Kolektif House Levent\nBüyükdere Cad. No: 201\n34394 Şişli / İstanbul',
    is_published = true
  where id = demo_user_id;

  insert into public.profile_links (profile_id, platform, label, value, display_order, is_visible)
  values
    (demo_user_id, 'phone', 'Cep', '+905320000000', 0, true),
    (demo_user_id, 'email', 'E-posta', 'gorkem@dijivizit.com', 1, true),
    (demo_user_id, 'website', 'Web sitesi', 'https://dijivizit.com', 2, true),
    (demo_user_id, 'linkedin', 'LinkedIn', 'https://www.linkedin.com/in/dijivizit', 3, true),
    (demo_user_id, 'instagram', 'Instagram', 'https://www.instagram.com/dijivizit', 4, true),
    (demo_user_id, 'whatsapp', 'WhatsApp', 'https://wa.me/905320000000', 5, true),
    -- Hidden on purpose: the editor should list seven links while the public
    -- card renders six.
    (demo_user_id, 'github', 'GitHub', 'https://github.com/dijivizit', 6, false)
  on conflict do nothing;

  insert into public.profile_skills (profile_id, name, type, display_order)
  values
    (demo_user_id, 'Marka Kimliği', 'expertise', 0),
    (demo_user_id, 'Ürün Tasarımı', 'expertise', 1),
    (demo_user_id, 'UI/UX', 'expertise', 2),
    (demo_user_id, 'Figma', 'skill', 0),
    (demo_user_id, 'Photoshop', 'skill', 1),
    (demo_user_id, 'Blender', 'skill', 2),
    (demo_user_id, 'SwiftUI', 'skill', 3)
  on conflict do nothing;

  raise notice 'Seeded demo card at /p/%',
    (select public_id from public.profiles where id = demo_user_id);
end
$$;
