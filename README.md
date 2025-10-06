# 🧱 BossOS

A modern, high-performance ERP platform for service-based businesses (HVAC, Spray Foam, Plumbing, Electrical, and more) — built with **React 19**, **Vite 7**, **TypeScript**, and **Supabase**.

---

## ⚙️ Prerequisites

Before setting up BossOS locally, make sure you have the following installed:

### 🧩 Core Tools

| Tool        | Version | Install Command                                        |
| ----------- | ------- | ------------------------------------------------------ |
| **Node.js** | ≥ 20.x  | [Download](https://nodejs.org) or use `nvm install 20` |
| **pnpm**    | ≥ 9.x   | `npm install -g pnpm`                                  |
| **Git**     | Latest  | [Download](https://git-scm.com/downloads)              |
| **Vite**    | Bundled | *(no need to install globally)*                        |

### 🧠 Recommended VS Code Extensions

* Tailwind CSS IntelliSense
* HeroUI snippets
* ESLint
* Prettier
* TypeScript React (TSX) syntax highlighting

---

## 🧰 Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/YOURUSERNAME/bossos.git
cd bossos
```

### 2️⃣ Install dependencies

```bash
pnpm install
```

### 3️⃣ Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLIC_KEY
```

> ⚠️ Do not commit `.env` files. Production secrets belong in hosting provider environment settings.

---

## 🧪 Development Commands

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `pnpm dev`        | Start the Vite development server    |
| `pnpm build`      | Build for production                 |
| `pnpm preview`    | Preview the production build locally |
| `pnpm test`       | Run tests with Vitest                |
| `pnpm test:watch` | Watch tests continuously             |
| `pnpm test:cov`   | Run tests with coverage              |
| `pnpm lint`       | Run ESLint checks                    |

---

## ⚡ Tech Stack

### 🧠 Framework & Tooling

* **React 19** — UI framework
* **Vite 7** — blazing fast bundler
* **TypeScript 5.8** — type safety
* **React Router 7** — app routing

### 🎨 Styling & UI

* **Tailwind CSS 4.1** — utility-first CSS
* **HeroUI React** — theme-aware UI kit
* **Framer Motion 12** — smooth animations
* **Lucide React** — modern icons
* **class-variance-authority**, **clsx**, **tailwind-merge** — class handling utilities
* **tailwindcss-animate** — animation presets

### ☁️ Backend & Auth

* **Supabase v2** — authentication, database, and file storage
* **React Hook Form + Zod** — form validation

### ✨ Visual Effects

* **@tsparticles/react** + **slim** — animated particle backgrounds
* **canvas-confetti** — onboarding success animation

### 🧪 Testing

* **Vitest** — test runner
* **@testing-library/react**, **jest-dom**, **user-event** — UI testing tools
* **jsdom** — DOM environment for tests

### 🧹 Code Quality

* **ESLint 9** — static analysis
* **typescript-eslint** — TS linting
* **eslint-plugin-react-hooks / react-refresh** — React-specific linting

---

## 🧩 Folder Structure

```
src/
 ├── app/
 │    ├── layouts/         # Chrome, Public, Onboarding layouts
 │    └── router/          # App routing
 ├── components/
 │    └── ui/              # Shared UI widgets (Buttons, Effects, Animations)
 ├── features/
 │    ├── auth/            # Onboarding, signup, Supabase logic
 │    ├── dashboard/       # Main app content post-onboarding
 │    └── landing/         # Marketing & Hero sections
 ├── lib/
 │    ├── hooks/           # Custom hooks (e.g. useTheme)
 │    └── utils.ts         # Utility functions
 ├── styles/
 │    └── tailwind.css     # Tailwind entry point
 ├── config/
 │    └── verticals.ts     # Industry vertical definitions
 └── main.tsx              # App entry point
```

---

## 🚀 Run the App

```bash
pnpm dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Build for Production

```bash
pnpm build && pnpm preview
```

This creates optimized assets in the `/dist` folder and previews them locally.

---

## 🧩 Installing All Technologies (Manual Fallback)

If `pnpm install` fails, you can manually install all dependencies:

```bash
pnpm add @heroui/react @heroui/switch @heroui/theme @hookform/resolvers @iconify/react @supabase/supabase-js @tsparticles/engine @tsparticles/react @tsparticles/slim canvas-confetti class-variance-authority clsx date-fns framer-motion lucide-react motion react react-dom react-hook-form react-router-dom tailwind-merge tailwindcss-animate
```

And dev dependencies:

```bash
pnpm add -D @csstools/postcss-oklab-function @eslint/js @tailwindcss/postcss @testing-library/jest-dom @testing-library/react @testing-library/user-event @types/node @types/react @types/react-dom @vitejs/plugin-react autoprefixer eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals jsdom postcss tailwindcss typescript typescript-eslint vite vite-tsconfig-paths vitest zod
```

---

## 💡 Pro Tips

* Run `pnpm lint --fix` before every commit.
* Use `pnpm test:watch` while developing new UI components.
* Configure your Supabase RLS policies before connecting live users.

---

## 🧱 Credits

Developed by **Alex (COO / Lead Developer)** for the **BossOS ERP** platform — powering the future of service business operations.
