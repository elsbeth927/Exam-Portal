# Redbridge Exam Platform

Production deployment architecture:

```
Browser / Installed PWA
        |
        | HTTPS
        v
Netlify website
        |
        | /api/* reverse proxy
        v
Supabase Edge Function: exam-api
        |
        v
Supabase PostgreSQL
```

## URLs

- `/` — public Redbridge Exam Platform website
- `/app/` — installable exam PWA
- `/app/setup.html` — one-time first-administrator setup
- `/api/*` — proxied securely to the Supabase Edge API

## Production Supabase project

- Project: **Redbridge Exam Platform**
- Project ref: `uxbzfirtxpwpbhlsusmf`
- Region: `eu-central-1`
- Edge Function: `exam-api`

The browser never receives a Supabase secret/service key or database password. Netlify only hosts the static website/PWA and proxies API requests to Supabase.

## Main capabilities

- student, teacher, academic administrator and super-administrator roles
- class and subject management
- user creation
- question bank
- exam creation and assignment
- timed student attempts
- answer autosave
- server-side marking
- controlled result publication
- audit logging
- installable PWA

## Deployment

Import this GitHub repository into Netlify. `netlify.toml` contains the publish directory, security headers and API proxy configuration. No Supabase database password is required in Netlify.
