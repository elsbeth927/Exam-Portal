# Redbridge Exam Platform — Netlify + Supabase edition

Production-oriented Redbridge Exam Platform with:

- `/` — public Redbridge Exam Platform website
- `/app/` — installable exam PWA for students, teachers and administrators
- `/api/*` — Netlify Functions API
- Supabase PostgreSQL — persistent users, classes, question bank, exams, attempts, results, audit records and pilot requests

The browser does not connect directly to exam tables. Sensitive exam data remains behind the server-side API.
