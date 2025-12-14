# nexstjs

> Opinionated Next.js + NestJS full-stack project scaffold — zero config, one command.

A production-ready CLI tool that bootstraps a modern full-stack application with **Next.js 15 (App Router)** frontend and **NestJS** backend, preconfigured with industry-standard libraries, sensible defaults, and clean separation of concerns.

```bash
npx nexstjs my-app
```

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [CLI Options](#cli-options)
- [Interactive Mode](#interactive-mode)
- [Package Managers](#package-managers)
- [Stack Details](#stack-details)
- [Development Workflow](#development-workflow)
- [Design Philosophy](#design-philosophy)
- [Troubleshooting](#troubleshooting)
- [Requirements](#requirements)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Frontend Stack

**Core Framework**
- Next.js (latest with App Router)
- TypeScript
- ESLint + Prettier
- Tailwind CSS

**UI Components**
- Shadcn UI (Slate theme)
- Preinstalled components: dialog, alert, badge, avatar, dropdown, skeleton, breadcrumb, kbd, label, pagination, field, textarea, tooltip, select, separator
- Lucide React icons

**Animation & Motion**
- GSAP (timeline animations)
- Framer Motion (component animations)
- Lenis (smooth scroll)
- Lottie React (JSON animations)
- Three.js + @react-three/drei (3D graphics)

**Data Management**
- Axios (HTTP client)
- TanStack Query (server state)
- React Hook Form (form state)
- Zod (schema validation)

**Utilities**
- clsx + tailwind-merge (class management)
- date-fns (date utilities)
- sonner (toast notifications)
- @t3-oss/env-nextjs (type-safe env variables)

### Backend Stack

**Core Framework**
- NestJS (latest)
- TypeScript
- ESLint + Prettier

**Security & Middleware**
- Helmet (security headers)
- Cookie Parser (cookie handling)
- @nestjs/throttler (rate limiting)

**Authentication & Authorization**
- Passport.js integration
- @nestjs/passport
- @nestjs/jwt (JWT strategy)
- Argon2 (password hashing)

**Validation & Configuration**
- class-validator (DTO validation)
- class-transformer (object transformation)
- @nestjs/config (env management)

**API & Documentation**
- @nestjs/swagger (OpenAPI/Swagger)
- Multer (file uploads)

**Database**
- Prisma ORM
- @prisma/client

**External Services**
- @supabase/supabase-js (Supabase integration)

---

## Quick Start

### Basic Usage

**With pnpm (recommended)**
```bash
npx nexstjs my-app
cd my-app
```

**With npm**
```bash
npx nexstjs my-app --pm npm
cd my-app
```

### Running Development Servers

After scaffolding, run both servers:

**Terminal 1 - Frontend**
```bash
pnpm -C frontend dev
# or with npm
npm --prefix frontend run dev
```

**Terminal 2 - Backend**
```bash
pnpm -C backend start:dev
# or with npm
npm --prefix backend run start:dev
```

Your application will be available at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001` (or as configured)

---

## Project Structure

The generated project follows a clean separation between frontend and backend:

```
my-app/
├── frontend/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   │   └── ui/              # Shadcn UI components
│   ├── lib/                 # Utilities and helpers
│   ├── public/              # Static assets
│   ├── styles/              # Global styles
│   ├── .eslintrc.json       # ESLint configuration
│   ├── tailwind.config.ts   # Tailwind configuration
│   ├── tsconfig.json        # TypeScript configuration
│   └── package.json         # Frontend dependencies
│
├── backend/
│   ├── src/
│   │   ├── main.ts          # Application entry point
│   │   ├── app.module.ts    # Root module
│   │   └── ...              # Your modules, controllers, services
│   ├── prisma/
│   │   └── schema.prisma    # Prisma schema
│   ├── .eslintrc.js         # ESLint configuration
│   ├── tsconfig.json        # TypeScript configuration
│   └── package.json         # Backend dependencies
│
└── package.json             # Root-level scripts
```

---

## CLI Options

| Option           | Type     | Description                       | Default  |
|------------------|----------|-----------------------------------|----------|
| `<project-name>` | required | Name of the project folder        | -        |
| `--pm`           | optional | Package manager (`pnpm` or `npm`) | `pnpm`   |
| `--no-ux`        | flag     | Disable interactive prompts       | `false`  |

### Examples

**Specify package manager**
```bash
npx nexstjs my-app --pm npm
```

**Non-interactive mode (CI/CD)**
```bash
npx nexstjs my-app --no-ux
```

**Combine options**
```bash
npx nexstjs my-app --pm npm --no-ux
```

---

## Interactive Mode

By default, the CLI runs in **interactive mode** with the following prompts:

### 1. Start Confirmation
```
? Start scaffolding the project?
```
Confirms whether to proceed with project generation.

### 2. Source Directory Structure
```
? Use src/ Directory?
```
- `Yes`: Next.js files in `frontend/src/app/`
- `No`: Next.js files in `frontend/app/`

### 3. Import Alias
```
? Import alias
  > @/*
    No Alias
```
Configures TypeScript path mapping for imports.

**With `@/*`:**
```typescript
import { Button } from '@/components/ui/button'
```

**Without alias:**
```typescript
import { Button } from '../components/ui/button'
```

To skip all prompts, use `--no-ux` flag.

---

## Package Managers

### pnpm (Recommended)

Fast, efficient, and disk-space friendly.

**Installation**
```bash
# Via npm
npm install -g pnpm

# Via corepack (Node 16.13+)
corepack enable
```

**Usage**
```bash
npx nexstjs my-app
```

### npm

Built-in with Node.js.

**Usage**
```bash
npx nexstjs my-app --pm npm
```

---

## Stack Details

### Why These Libraries?

**GSAP + Framer Motion**
- GSAP for complex timeline animations
- Framer Motion for declarative React animations

**TanStack Query**
- Declarative data fetching
- Automatic caching and background refetching
- Optimistic updates

**React Hook Form + Zod**
- Performant form state management
- Type-safe validation schemas
- Minimal re-renders

**Prisma**
- Type-safe database client
- Auto-generated types
- Migration management

**Argon2**
- More secure than bcrypt
- Resistant to GPU cracking attacks

---

## Development Workflow

### Frontend Development

```bash
cd frontend

# Start dev server
pnpm dev

# Build for production
pnpm build

# Lint
pnpm lint

# Add new Shadcn component
pnpm shadcn add button
```

### Backend Development

```bash
cd backend

# Start dev server
pnpm start:dev

# Build
pnpm build

# Run in production
pnpm start:prod

# Prisma commands
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

### Environment Variables

**Frontend (`frontend/.env.local`)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Backend (`backend/.env`)**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
JWT_SECRET="your-secret-key"
```

---

## Design Philosophy

### Core Principles

1. **Opinionated, but practical**
   - Curated libraries that work well together
   - Proven patterns from real-world projects
   - Reasonable defaults, easy to customize

2. **Latest-first approach**
   - Always installs latest versions
   - No locked templates
   - Stay up-to-date with ecosystem

3. **Quiet by default**
   - Clean, minimal CLI output
   - Spinners for long-running operations
   - Only show what matters

4. **No monorepo complexity**
   - Simple folder structure
   - Independent frontend/backend
   - Easy to understand and modify

5. **Production-ready foundation**
   - Security best practices
   - Type safety throughout
   - Ready for deployment

### Who Is This For?

**Ideal for:**
- Developers starting new full-stack projects
- Teams wanting consistent project setup
- Solo developers who value speed
- Prototypes that need to scale

**Not ideal for:**
- Projects requiring specific versions
- Highly customized build pipelines
- Existing projects (migration tool)

---

## Troubleshooting

### pnpm not found

If you see `pnpm is not installed`:

```bash
# Option 1: Install globally
npm install -g pnpm

# Option 2: Enable corepack (Node 16.13+)
corepack enable
```

### Port already in use

If ports 3000 or 3001 are occupied:

**Frontend**
```bash
# Use different port
PORT=3002 pnpm dev
```

**Backend**
Edit `backend/src/main.ts`:
```typescript
await app.listen(3002);
```

### Shadcn components not found

Ensure shadcn CLI is installed:
```bash
cd frontend
pnpm add -D shadcn@latest
```

### TypeScript errors after scaffolding

Run type checking to see specific errors:
```bash
cd frontend && pnpm tsc --noEmit
cd backend && pnpm tsc --noEmit
```

### Prisma client generation

After modifying `prisma/schema.prisma`:
```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

---

## Requirements

### System Requirements

- **Node.js**: 18.x or higher (22.x recommended)
- **Package Manager**: pnpm 8+ or npm 9+
- **OS**: Linux, macOS, Windows (WSL2)

### Disk Space

- CLI tool: ~50 MB
- Generated project: ~600 MB (with node_modules)

### Network

Stable internet connection required for:
- Downloading dependencies
- Shadcn component registry
- Next.js/NestJS CLI tools

---

## Contributing

Contributions are welcome! Here's how you can help:

### Reporting Issues

When reporting bugs, please include:
- Node.js version (`node -v`)
- Package manager and version (`pnpm -v` or `npm -v`)
- OS and version
- Full error output
- Steps to reproduce

### Feature Requests

Open an issue describing:
- The problem you're trying to solve
- Why existing solutions don't work
- Proposed API/usage

### Pull Requests

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit PR with clear description

**Development Setup**
```bash
git clone https://github.com/aldevvv/nexstjs.git
cd nexstjs
pnpm install
```

**Testing Changes**
```bash
# Link CLI locally
pnpm link --global

# Test in a new directory
cd /tmp
nexstjs test-project
```

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and breaking changes.

---

## Roadmap

**Planned Features**
- [ ] Docker Compose setup
- [ ] GitHub Actions CI/CD templates
- [ ] Database seeding utilities
- [ ] Testing setup (Jest, Playwright)
- [ ] More Shadcn theme presets
- [ ] Vercel/Railway deployment configs

**Community Requests**
- [ ] MongoDB support option
- [ ] GraphQL setup variant
- [ ] i18n configuration
- [ ] PWA setup

---

## Credits

Built with:
- [Next.js](https://nextjs.org/) by Vercel
- [NestJS](https://nestjs.com/) by Kamil Myśliwiec
- [Shadcn UI](https://ui.shadcn.com/) by shadcn
- [Prisma](https://www.prisma.io/) by Prisma
- [TanStack Query](https://tanstack.com/query) by Tanner Linsley

Special thanks to the open-source community for these amazing tools.

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

**TL;DR:** You can use this tool commercially, modify it, and distribute it. Attribution appreciated but not required.

---

## Author

**Muhammad Alif**

Full-stack developer passionate about developer experience and modern web technologies.

- GitHub: [@aldevvv](https://github.com/aldevvv)
- LinkedIn: [mhdalif-id](https://www.linkedin.com/in/mhdalif-id/)
- Instagram: [@mhdalif.id](https://www.instagram.com/mhdalif.id)

---

## Support

If this tool saves you time:

**Give it a star** on GitHub

**Share with your team** - Help others discover it

**Provide feedback** - Open issues or discussions

**Sponsor** - Consider sponsoring if this becomes part of your workflow

Built with care for the developer community.
