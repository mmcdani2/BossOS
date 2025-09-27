# BossOS CRM

Vite + React + TypeScript + Supabase CRM application.

Dark, iPhone-esque glassmorphism UI with role-based access (RLS) scoped to each organization.  
Domain-driven structure: `features/`, `ui/`, `lib/`.

## Quickstart

### 1. Clone and Install
```sh
git clone 
cd bossos
pnpm install
```

### 2. Configure Environment
Create `.env` at the project root:

```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### 3. Run Development Server
```sh
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

## Dependencies

Install core libraries and tools with pnpm:

### Core
```sh
pnpm add react react-dom react-router-dom
pnpm add -D vite @vitejs/plugin-react typescript @types/react @types/react-dom
```

### Styling & UI
```sh
pnpm add -D tailwindcss postcss autoprefixer
pnpm add class-variance-authority tailwind-variants
pnpm add lucide-react framer-motion
pnpm add @radix-ui/react-icons @radix-ui/react-dialog @radix-ui/react-tooltip
```

### Backend & Data
```sh
pnpm add @supabase/supabase-js
pnpm add zod date-fns
```

### Utilities
```sh
pnpm add clsx
pnpm add -D dotenv
```

### Testing & Linting
```sh
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
pnpm add -D eslint prettier eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks
```

## Scripts

- `pnpm dev` → start development server  
- `pnpm build` → build for production  
- `pnpm preview` → preview production build  
- `pnpm test` → run tests  
- `pnpm lint` → run lint checks  

## Features

- Supabase Auth (magic link sign-in/out)  
- Auto-provision organization + owner on first login  
- RLS: all queries scoped to the logged-in user’s org  
- Dashboard KPIs:
  - Open Estimates (total $ value)  
  - Jobs Today (count)  
  - AR Balance (total $ open/overdue)  
  - Leads This Week (count)  

## Repo Structure
```
src/
  features/   # Domain-specific features (dashboard, clients, estimates, etc.)
  ui/         # Shared UI components, glassmorphism styling
  lib/        # Supabase client, API wrappers, utilities
```

## Development Notes

- Commit style: feat:, fix:, chore:, docs:  
- Seed data available via SQL scripts for testing KPI cards  
- Supabase RLS policies enforce org-level isolation  
- Run `pnpm build` before pushing to ensure clean build  

## Frontend

Vite + React + TypeScript app for BossOS CRM.  
Structured for scalability:

- `features/` → domain-driven slices (dashboard, clients, jobs, invoices, etc.)  
- `ui/`       → shared presentation components  
- `lib/`      → API + utilities  

Auth: Supabase magic link + RLS.  
Default UI: dark iPhone-esque glassmorphism.

## Features (Code Organization)

This folder contains domain-specific features of BossOS CRM.  
Each feature is self-contained with its own components, hooks, and API access.

Examples:
- `dashboard/` → KPI cards, charts, and dashboard UI  
- `clients/`   → client management screens  
- `estimates/` → estimates listing and create/edit flows  

## UI Layer

This folder holds shared UI components and styles.  
Think buttons, forms, layout shells, and other reusable presentation pieces.

- Global CSS classes (dark, glassmorphism, etc.)  
- Nav, Sidebar, Modal, etc.  

## Lib Layer

This folder contains shared library code (non-UI).  

Examples:
- `supabase/` → client setup  
- `api/`      → data-access functions wrapping Supabase queries  
- `auth/`     → helpers for user/org provisioning and RLS-safe calls  

## License

Copyright (c) 2025 BossOS.

All rights reserved.

This software and associated documentation files (the "Software") are proprietary and confidential.  
Unauthorized copying, modification, distribution, or use of the Software, in whole or in part,  
without express written permission from the copyright holder is strictly prohibited.

The Software is provided "as is", without warranty of any kind, express or implied.  
In no event shall the authors or copyright holders be liable for any claim, damages,  
or other liability, whether in an action of contract, tort, or otherwise, arising  
from, out of, or in connection with the Software or the use or other dealings in the Software.
