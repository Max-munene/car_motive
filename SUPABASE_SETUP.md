<!-- @format -->

# Supabase Setup Guide for BRIM Automotive

This guide covers everything needed to configure Supabase for this Nuxt 3
project as an MVP.

## 1. Prerequisites

- Node.js installed
- Supabase account
- `@nuxtjs/supabase` already installed in the project
- `supabase` CLI installed if you want to use command-line deployment
  - `npm install -g supabase` or `npx supabase --help`

## 2. Environment variables

The project reads these values from `process.env` in `nuxt.config.ts`:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-public-key
SUPABASE_SERVICE_KEY=your-service-role-key
SITE_URL=https://brimautomotive.co.ke
WHATSAPP_NUMBER=254796314445
```

Important:

- `SUPABASE_URL` and `SUPABASE_KEY` are safe for the browser.
- `SUPABASE_SERVICE_KEY` must remain secret and only used in server/runtime.
- Never commit `.env` into source control.

## 3. Supabase project creation

### Option A: Use the Supabase dashboard

1. Log in to Supabase.
2. Create a new project.
3. Go to Project Settings → API.
4. Copy:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` key → `SUPABASE_KEY`
   - `service_role` key → `SUPABASE_SERVICE_KEY`

### Option B: Use Supabase CLI

```bash
npx supabase login
npx supabase projects create brim-automotive --org <your-org-id>
```

Then copy the generated keys into your `.env`.

## 4. Database schema

This repo includes `supabase-schema.sql` with the full MVP schema.

### Apply the schema via Dashboard

1. Open Supabase dashboard.
2. Select SQL Editor.
3. Paste the contents of `supabase-schema.sql`.
4. Run the script.

### Apply the schema via CLI

```bash
npx supabase db push --file supabase-schema.sql
```

## 5. Storage setup

This app uploads car photos to Supabase Storage using a bucket named
`car-images`.

1. In Supabase dashboard, go to Storage.
2. Create bucket: `car-images`.
3. Set access to `public` if you want direct public URLs.

> The app uses `supabase.storage.from('car-images').getPublicUrl(path)`. That
> requires the bucket to allow public object access.

## 6. Auth configuration

The app uses Supabase Auth with email/password sign-up and sign-in.

### Recommended auth settings

- Enable Email auth provider.
- Optionally disable email confirmations if you want instant access.
- Keep `Redirect URLs` set for local dev and production:
  - `http://localhost:3000/auth/confirm`
  - `https://your-production-url/auth/confirm`

### Supabase table expectations

- The app uses `auth.users` for auth and a separate `profiles` table to store
  user metadata.
- The `profiles` table is linked to `auth.users(id)`.
- The sign-up flow updates `profiles.full_name` after account creation.

## 7. Security and row-level security

This project uses a server-side service-role client for most database writes,
but it also performs some browser-side writes.

### Important tables with direct client access

- `profiles` — user updates own profile via server API or direct client query
- `articles` — admin pages may insert/update/delete directly from browser client
- `inquiries` — admin pages may update inquiry status directly from browser
  client

### RLS in `supabase-schema.sql`

The schema includes policies for:

- `profiles`
- `articles`
- `inquiries`

If you extend the app, add RLS policies for other tables used by direct client
operations.

## 8. What data is stored where

### Postgres tables

- `profiles` — user profile metadata and role
- `car_listings` — listing details
- `car_images` — image URLs and ordering per listing
- `inquiries` — buyer inquiries for listings
- `articles` — blog/guide content
- `saved_cars` — saved listing relationship per user
- `market_price_references` — reference data for market score computation

### Storage bucket

- `car-images` — stores uploaded car photo files

## 9. Runtime config in the project

The project already reads the runtime values from `nuxt.config.ts`:

```ts
runtimeConfig: {
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
  public: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    whatsappNumber: process.env.WHATSAPP_NUMBER || "254796314445",
    siteUrl: process.env.SITE_URL || "https://brimautomotive.co.ke",
  },
},
```

And the server helper now uses them safely:

```ts
return createClient(config.public.supabaseUrl, config.supabaseServiceKey, {
	auth: { persistSession: false },
});
```

## 10. Local development

1. Copy `.env.example` to `.env`.
2. Fill values from Supabase dashboard.
3. Run:

```bash
npm install
npm run dev
```

4. Open `http://localhost:3000`.

## 11. Production deployment checklist

- Set environment variables in the host/CI environment:
  - `SUPABASE_URL`
  - `SUPABASE_KEY`
  - `SUPABASE_SERVICE_KEY`
  - `SITE_URL`
  - `WHATSAPP_NUMBER`
- Make sure `.env` is never committed.
- Confirm `car-images` bucket exists and is public.
- Confirm Supabase SQL schema has been applied.

## 12. Notes and troubleshooting

- If uploaded images fail, verify the bucket name is exactly `car-images`.
- If auth fails, verify `SUPABASE_URL` and `SUPABASE_KEY` are correct.
- If server APIs fail, verify `SUPABASE_SERVICE_KEY` is set and the server
  helper is using it.
- If admin article operations fail from the browser, verify `articles` RLS
  policies allow admins.

## 13. Useful Supabase CLI commands

```bash
npx supabase login
npx supabase db push --file supabase-schema.sql
npx supabase db reset
npx supabase projects list
```

---

If you want, I can next add a `supabase` folder with a `schema.sql` and
`seed.sql` structure for easier CLI-based migrations.
