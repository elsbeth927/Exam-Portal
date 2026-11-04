# Redbridge Exam Platform — Certificate Implementation Spec

## Objective
Use the exact approved certificate PNGs as the certificate backgrounds. Do not recreate the approved designs in HTML/CSS.

The renderer must overlay only dynamic fields:
- student name
- assessment/exam level
- score / IELTS bands / Olympiad award
- date issued
- unique reference number
- unique QR verification code

## Source of truth
- GitHub: implementation code and certificate template assets
- Netlify: deploys the GitHub build
- Supabase: stores certificate records, immutable reference numbers, verification tokens, issue date, attempt/exam/student linkage, revoke state

## Required template paths
Store approved images in:
`site/app/certificates/templates/`

Expected files:
- `ielts-template.png`
- `science-template.png`
- `olympiad-template.png`
- `english-template.png`
- `math-template.png`

## Certificate mapping
| Exam type | Template |
|---|---|
| IELTS | ielts-template.png |
| Science | science-template.png |
| Olympiad | olympiad-template.png |
| English | english-template.png |
| Mathematics | math-template.png |

## Rendering rule
1. Load the exact approved PNG at its native dimensions.
2. Draw the PNG as the canvas background.
3. Overlay dynamic text at fixed coordinates.
4. Generate the QR from the permanent verification URL.
5. Draw the QR at the configured QR rectangle.
6. Export PNG and optionally PDF.
7. Never change the permanent reference number once issued.

## Reference format
`RIS-<TYPE>-<YEAR>-<12_CHAR_SECURE_CODE>`

Codes:
- IELTS
- SCI
- OLY
- ENG
- MTH

Examples:
- `RIS-IELTS-2026-2A6D9F3E8BC1`
- `RIS-SCI-2026-4D8F23B1A9CE`
- `RIS-OLY-2026-7B5E31F9C4AD`
- `RIS-ENG-2026-8F3A91C2B47D`
- `RIS-MTH-2026-1C7E94A6D2BF`

## QR verification
QR target:
`https://redbridge-exam-platform.netlify.app/app/verify.html?ref=<REFERENCE>&token=<TOKEN>`

Verification page must show:
- valid / revoked status
- student name
- exact exam
- subject/category
- score/band/award
- date issued
- reference number

## Supabase certificate record
Use the existing `certificates` table:
- id
- org_id
- attempt_id (unique)
- student_id
- exam_id
- certificate_type
- reference_no (unique)
- verification_token (unique)
- issued_at
- revoked_at
- metadata_json

One passed/published attempt = one permanent certificate record.

## IELTS rule
Do not invent missing bands.
- Full IELTS result: show component bands only when actual Listening/Reading/Writing/Speaking scores exist.
- Skill-only test: show only the measured skill/result.
- Keep the notice that this is a school-issued practice certificate, not an official IELTS Test Report Form.

## Output
Student certificate must support:
- on-screen preview
- PNG export
- Print / Save PDF
- QR verification

## Acceptance criteria
- Exact approved uploaded image is the background.
- No CSS recreation of ribbon/border/decorations.
- Dynamic data aligns with the intended fields on that image.
- Student name is correct.
- Exam/level is correct.
- Score/band/award is correct.
- Date uses Asia/Tashkent.
- Reference is unique and permanent.
- QR is unique and verifies against Supabase.
- QR/reference never overlap other content.
- Reopening the certificate returns the same reference and QR.
