# Deployment — Redbridge Exam Platform

The production database is Supabase PostgreSQL. The site is configured for Netlify and the application is available under `/app/`.

## Required Netlify environment variables

- `SUPABASE_DB_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ORG_NAME=Redbridge International School`
- `ACADEMIC_YEAR=2026-27`
- `SITE_URL=https://YOUR-NETLIFY-DOMAIN`
- `COOKIE_SECURE=1`

The first successful API request bootstraps the organisation, academic year, default settings, role permissions, and first super administrator.

## URLs

- Website: `/`
- Exam application: `/app/`
- API: `/api/*`

Before a real exam, rehearse authentication, role permissions, scheduling, autosave, server-owned timeouts, marking, result publication, CSV export, audit logs, and simultaneous student access.
