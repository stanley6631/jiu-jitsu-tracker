# 🥋 BJJ Tracker

A personal Brazilian Jiu-Jitsu training log app for tracking technique focus, reviewing session history, and monitoring long-term progress.

## Features (planned)

- **Session Logging** — Record what techniques and concepts you focused on each training session
- **Technique Database** — Build a personal library of techniques with notes
- **Training History** — Browse past logs and spot patterns in your training
- **Focus Analysis** — See which areas you've prioritised over time
- **Belt/Progress Tracking** — Log milestone achievements

## Tech Stack

| Tool | Purpose |
|---|---|
| [React 19](https://react.dev) | UI framework |
| [Vite 6](https://vite.dev) | Build tool & dev server |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Tailwind CSS v3](https://tailwindcss.com) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com) | Accessible component library (Radix + CVA) |
| [TanStack Query](https://tanstack.com/query) | Server state & data fetching |
| [React Router v6](https://reactrouter.com) | Client-side routing |
| [Supabase](https://supabase.com) | Backend, database & auth |

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Install & run

```bash
npm install
npm run dev
```

App will be running at `http://localhost:5173`.

### Build for production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── api/              # TanStack Query hooks & API layer
├── components/
│   ├── layout/       # Layout components (PageLayout, Header, etc.)
│   └── ui/           # shadcn/ui components (auto-generated, do not edit manually)
├── hooks/            # Custom React hooks
├── lib/
│   └── utils.ts      # cn() utility (clsx + tailwind-merge)
├── pages/
│   ├── Home/         # Landing / dashboard page
│   ├── LogEntry/     # Log a new training session
│   └── LogHistory/   # Browse past sessions
└── types/            # Shared TypeScript type definitions
```

> **shadcn/ui** components live in `src/components/ui/`. Add new ones with:
> ```bash
> npx shadcn@latest add <component-name>
> ```
> Configuration is in `components.json` at the project root.

## Roadmap

- [x] Supabase integration (auth + database)
- [ ] Session log form (techniques, duration, notes, date)
- [ ] History page with filtering by technique / date range
- [ ] Technique tagging system
- [ ] Dashboard with training frequency charts

## License

MIT
