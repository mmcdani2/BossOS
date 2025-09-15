# BossOS CRM (Frontend)

Vite + React + TypeScript app for BossOS CRM.  
Structured for scalability:

- `features/` → domain-driven slices (dashboard, clients, jobs, invoices, etc.)
- `ui/`       → shared presentation components
- `lib/`      → API + utilities

Auth: Supabase magic link + RLS.  
Default UI: dark iPhone-esque glassmorphism.
