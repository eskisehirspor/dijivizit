# Dijivizit

Premium NFC ve QR destekli dijital kartvizit platformu.

Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, shadcn/ui, and Supabase.

---

## Requirements

| Tool   | Version                                    |
| ------ | ------------------------------------------ |
| Node   | 20.9+ (`.nvmrc` pins 24)                   |
| npm    | 10+                                        |
| Docker | Required only for the local Supabase stack |

## Getting started

```bash
nvm use
npm install
cp .env.example .env.local
```

Start the local Supabase stack (Postgres, Auth, Storage, Studio) and apply every
migration plus the seed data:

```bash
npm run db:start
npm run db:reset
```

`db:start` prints the local API URL and keys. Copy them into `.env.local`, then:

```bash
npm run gen:types   # regenerate lib/db/database.types.ts from the live schema
npm run dev
```

The app runs at http://localhost:3000. Supabase Studio is at http://localhost:54323,
and outbound mail is captured at http://localhost:54324 rather than being sent.

The seed creates one confirmed account: `demo@dijivizit.com` / `Dijivizit123!`.

### Google sign-in locally

The local Auth container reads Google credentials from the environment:

```bash
# supabase/.env  (gitignored)
SUPABASE_AUTH_GOOGLE_CLIENT_ID=...
SUPABASE_AUTH_GOOGLE_SECRET=...
```

Register `http://127.0.0.1:54321/auth/v1/callback` as an authorized redirect URI
in the Google Cloud console.

## Scripts

| Script              | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Development server                               |
| `npm run build`     | Production build                                 |
| `npm run typecheck` | `tsc --noEmit`                                   |
| `npm run lint`      | ESLint, warnings treated as failures             |
| `npm run format`    | Prettier write                                   |
| `npm test`          | Vitest unit tests                                |
| `npm run db:start`  | Start the local Supabase stack                   |
| `npm run db:reset`  | Drop, re-migrate, and re-seed the local database |
| `npm run db:diff`   | Diff local schema changes into a new migration   |
| `npm run db:push`   | Apply migrations to the linked hosted project    |
| `npm run gen:types` | Regenerate database types from the local schema  |

## Architecture

```
app/
  (marketing)/        Public landing page
  (auth)/             Login, register, and the auth server actions
  (dashboard)/        Authenticated area, guarded by requireUser()
  p/[publicId]/       Public digital card — the shareable URL
  auth/callback/      OAuth (PKCE) code exchange
  auth/confirm/       Email link verification
proxy.ts              Session refresh and coarse redirects
components/ui/        shadcn/ui primitives
components/auth/      Auth forms
lib/
  supabase/           Browser, server, and proxy clients
  dal/                Data Access Layer — the authorization boundary
  validations/        Zod schemas shared by client and server
  i18n/               next-intl configuration and Intl helpers
  env/                Zod-validated environment variables
messages/tr.json      All user-facing copy
supabase/migrations/  Schema as version-controlled SQL
```

### Public card URLs are unguessable by design

Every profile gets an 11-character base62 `public_id` (~65.5 bits of entropy)
generated in Postgres from `gen_random_bytes` with rejection sampling to avoid
modulo bias. Cards live at `/p/<public_id>` and this is what NFC tags and QR
codes encode.

This only works if the ids cannot be enumerated, which drives two decisions:

1. **Anonymous users hold no table grants.** A conventional
   `select ... where is_published` RLS policy would expose
   `GET /rest/v1/profiles?is_published=eq.true` through PostgREST and let anyone
   with the publishable key list every card. Instead `anon` reads exclusively
   through `public.get_public_card(p_public_id)`, a `security definer` function
   that takes an exact id and returns at most one row.
2. **Public cards are never indexed.** `/p/[publicId]` sets
   `robots: { index: false, follow: false }`.

### Authorization is enforced in the Data Access Layer, not the proxy

`proxy.ts` refreshes the Supabase session and handles redirects, but Server
Actions are POSTs to the route that hosts them, so a matcher change can silently
remove proxy coverage. Every entry point that touches private data calls
`requireUser()` from `lib/dal/auth.ts`, which verifies the JWT signature via
`getClaims()`. `getSession()` is never used for authorization — it reads a
client-controlled cookie without revalidating it.

### Internationalization

Turkish only in V1, served without a locale segment in the URL. Every
user-facing string lives in `messages/tr.json`; none are hardcoded in
components, and validation errors carry message keys rather than prose.

To add a locale: add `messages/<locale>.json`, list it in
`lib/i18n/config.ts`, switch `lib/i18n/request.ts` to a dynamic import, and move
the route groups under `app/[locale]/`.

### Design language

The UI follows a restrained, typographic aesthetic in the vein of Apple, Linear,
Notion and Stripe: whitespace and type carry hierarchy, the palette is
neutral-forward, and motion is limited to short ease-out transitions that honour
`prefers-reduced-motion`. No gradients, illustrations, or marketing sections.

The binding version of these constraints, including what is explicitly
forbidden, lives in `.cursor/rules/design-language.mdc` so coding agents apply it
automatically. `--brand` is a deliberately low-chroma accent reserved for
identity moments; it is not a surface colour.

## Notes on Next.js 16

This project targets Next.js 16, which differs from older guides in ways that
matter here:

- `middleware.ts` is renamed to `proxy.ts` and runs on the Node.js runtime.
- `params`, `searchParams`, `cookies()`, and `headers()` are async-only.
- Turbopack is the default for `dev` and `build`; `next lint` is removed.
- `images.domains` is removed in favour of `images.remotePatterns`.
- Local IP image optimization requires `images.dangerouslyAllowLocalIP`, which is
  enabled in development so the local Supabase storage endpoint works.
