> Opinionated NextJS + NestJS Full-Stack Project Scaffold — Zero Config, One Command.

A Production-Ready CLI Tool that bootstraps a Modern Full-Stack Application with **NextJS Latest (App Router)** Frontend and **NestJS** Backend, Preconfigured with Industry-Standard Libraries, Sensible Defaults, and Clean Separation of Concerns.

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
- NextJS (Latest with App Router)
- TypeScript
- ESLint + Prettier
- TailwindCSS

**UI Components**
- ShadcnUI (Slate Theme)
- Preinstalled Components - dialog, alert, badge, avatar, dropdown, skeleton, breadcrumb, kbd, label, pagination, field, textarea, tooltip, select, separator
- Lucide React Icons

**Animation & Motion**
- GSAP (Timeline Animations)
- Framer Motion (Component Animations)
- Lenis (Smooth Scroll)
- Lottie React (JSON Animations)
- Three.js + @react-three/drei (3D Graphics)

**Data Management**
- Axios (HTTP client)
- TanStack Query (Server State)
- React Hook Form (Form State)
- Zod (Schema Validation)

**Utilities**
- clsx + tailwind-merge (Class Management)
- date-fns (Date Utilities)
- sonner (Toast Notifications)
- @t3-oss/env-nextjs (Type-Safe Env Variables)

### Backend Stack

**Core Framework**
- NestJS (Latest)
- TypeScript
- ESLint + Prettier

**Security & Middleware**
- Helmet (Security Headers)
- Cookie Parser (Cookie Handling)
- @nestjs/throttler (Rate Limiting)

**Authentication & Authorization**
- Passport.js Integration
- @nestjs/passport
- @nestjs/jwt (JWT Strategy)
- Argon2 (Password Hashing)

**Validation & Configuration**
- class-validator (DTO Validation)
- class-transformer (Object Transformation)
- @nestjs/config (Env Management)

**API & Documentation**
- @nestjs/swagger (OpenAPI/Swagger)
- Multer (File Uploads)

**Database**
- Prisma ORM
- @prisma/client

**External Services**
- @supabase/supabase-js (Supabase Integration)

---

## Quick Start

### Basic Usage

**With pnpm (Recommended)**
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

After Scaffolding, Run Both Servers:

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

Your Application Will be Available at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001` (or as configured)

---

## Project Structure

The Generated Project Follows a Clean Separation Between Frontend and Backend:

```
my-app/
├── frontend/
│   ├── app/                 # NextJS App Router Pages
│   ├── components/          # React Components
│   │   └── ui/              # ShadcnUI Components
│   ├── lib/                 # Utilities and Helpers
│   ├── public/              # Static Assets
│   ├── styles/              # Global Styles
│   ├── .eslintrc.json       # ESLint Configuration
│   ├── tailwind.config.ts   # Tailwind Configuration
│   ├── tsconfig.json        # TypeScript Configuration
│   └── package.json         # Frontend Dependencies
│
├── backend/
│   ├── src/
│   │   ├── main.ts          # Application Entry Point
│   │   ├── app.module.ts    # Root Module
│   │   └── ...              # Your Modules, Controllers, Services
│   ├── prisma/
│   │   └── schema.prisma    # Prisma Schema
│   ├── .eslintrc.js         # ESLint Configuration
│   ├── tsconfig.json        # TypeScript Configuration
│   └── package.json         # Backend Dependencies
│
└── package.json             # Root-Level Scripts
```

---

## CLI Options

| Option           | Type     | Description                       | Default  |
|------------------|----------|-----------------------------------|----------|
| `<project-name>` | required | Name of the project folder        | -        |
| `--pm`           | optional | Package manager (`pnpm` or `npm`) | `pnpm`   |
| `--no-ux`        | flag     | Disable interactive prompts       | `false`  |

### Examples

**Specify Package Manager**
```bash
npx nexstjs my-app --pm npm
```

**Non-Interactive Mode (CI/CD)**
```bash
npx nexstjs my-app --no-ux
```

**Combine Options**
```bash
npx nexstjs my-app --pm npm --no-ux
```

---

## Interactive Mode

By Default, the CLI Runs in **Interactive Mode** with the Following Prompts:

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
Configures TypeScript Path Mapping for Imports.

**With `@/*`:**
```typescript
import { Button } from '@/components/ui/button'
```

**Without Alias:**
```typescript
import { Button } from '../components/ui/button'
```

To Skip All Prompts, Use `--no-ux` flag.

---

## Package Managers

### pnpm (Recommended)

Fast, Efficient, and Disk-Space Friendly.

**Installation**
```bash
# Via npm
npm install -g pnpm

# Via Corepack (Node 16.13+)
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
- GSAP for Complex Timeline Animations
- Framer Motion for Declarative React Animations

**TanStack Query**
- Declarative Data Fetching
- Automatic Caching and Background Refetching
- Optimistic Updates

**React Hook Form + Zod**
- Performant Form State Management
- Type-Safe Validation Schemas
- Minimal Re-renders

**Prisma**
- Type-Safe Database Client
- Auto-Generated Types
- Migration Management

**Argon2**
- More Secure Than Bcrypt
- Resistant to GPU Cracking Attacks

---

## Development Workflow

### Frontend Development

```bash
cd frontend

# Start Dev Server
pnpm dev

# Build for Production
pnpm build

# Lint
pnpm lint

# Add New Shadcn Component
pnpm shadcn add button
```

### Backend Development

```bash
cd backend

# Start Dev Server
pnpm start:dev

# Build
pnpm build

# Run in Production
pnpm start:prod

# Prisma Commands
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
   - Curated Libraries That Work Well Together
   - Proven Patterns from Real-World Projects
   - Reasonable Defaults, Easy to Customize

2. **Latest-first approach**
   - Always Installs Latest Versions
   - No Locked Templates
   - Stay Up-to-Date with Ecosystem

3. **Quiet by default**
   - Clean, Minimal CLI Output
   - Spinners for Long-Running Operations
   - Only Show What Matters

4. **No Monorepo Complexity**
   - Simple Folder Structure
   - Independent Frontend/Backend
   - Easy to Understand and Modify

5. **Production-Ready Foundation**
   - Security Best Practices
   - Type Safety Throughout
   - Ready for Deployment

### Who Is This For?

**Ideal for:**
- Developers Starting New Full-Stack Projects
- Teams Wanting Consistent Project Setup
- Solo Developers Who Value Speed
- Prototypes That Need to Scale

**Not ideal for:**
- Projects Requiring Specific Versions / Deps
- Highly Customized Build Pipelines
- Existing Projects (Migration Tool)

---

## Troubleshooting

### pnpm not found

If you see `pnpm is not installed`:

```bash
# Option 1: Install Globally
npm install -g pnpm

# Option 2: Enable Corepack (Node 16.13+)
corepack enable
```

### Port Already in Use

If ports 3000 or 3001 are occupied:

**Frontend**
```bash
# Use Different Port
PORT=3002 pnpm dev
```

**Backend**
Edit `backend/src/main.ts`:
```typescript
await app.listen(3002);
```

### Shadcn Components Not Found

Ensure Shadcn CLI is Installed:
```bash
cd frontend
pnpm add -D shadcn@latest
```

### TypeScript errors after scaffolding

Run Type Checking to See Specific Errors:
```bash
cd frontend && pnpm tsc --noEmit
cd backend && pnpm tsc --noEmit
```

### Prisma client generation

After Modifying `prisma/schema.prisma`:
```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

---

## Requirements

### System Requirements

- **Node.js**: 18.x or Higher (22.x Recommended)
- **Package Manager**: pnpm 8+ or npm 9+
- **OS**: Linux, macOS, Windows (WSL2)

### Network

Stable Internet Connection Required for:
- Downloading Dependencies
- ShadcnUI Component Registry
- NextJS/NestJS CLI Tools

---

## Contributing

Contributions Are Welcome! Here's How You Can Help:

### Reporting Issues

When reporting bugs, please include:
- Node.js Version (`node -v`)
- Package Manager and Version (`pnpm -v` or `npm -v`)
- OS and Version
- Full Error Output
- Steps to Reproduce

### Feature Requests

Open an Issue Describing:
- The Problem You're Trying to Solve
- Why Existing Solutions Don't Work
- Proposed API/Usage

### Pull Requests

1. Fork the Repository
2. Create a Feature Branch
3. Make Your changes
4. Test Thoroughly
5. Submit PR with Clear Description

**Development Setup**
```bash
git clone https://github.com/aldevvv/nexstjs.git
cd nexstjs
pnpm install
```

**Testing Changes**
```bash
# Link CLI Locally
pnpm link --global

# Test in a New Directory
cd /tmp
nexstjs test-project
```

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for Version History and Breaking Changes.

---

## Roadmap

**Planned Features**
- [ ] Docker Compose Setup
- [ ] GitHub Actions CI/CD Templates
- [ ] Database Seeding Utilities
- [ ] Testing Setup (Jest, Playwright)
- [ ] More Shadcn Theme Presets
- [ ] Vercel/Railway Deployment Configs
---

## Credits

Built with:
- [Next.js](https://nextjs.org/) by Vercel
- [NestJS](https://nestjs.com/) by Kamil Myśliwiec
- [Shadcn UI](https://ui.shadcn.com/) by shadcn
- [Prisma](https://www.prisma.io/) by Prisma
- [TanStack Query](https://tanstack.com/query) by Tanner Linsley
- etc

Special Thanks to The Open-Source Community for These Amazing Tools.

---

## License

MIT License - See [LICENSE](LICENSE) File for Details.

**TL;DR:** You Can Use This Tool Commercially, Modify it, and Distribute it. Attribution Appreciated but Not Required.

---

## Author

**Muhammad Alif**

- GitHub: [@aldevvv](https://github.com/aldevvv)
- LinkedIn: [mhdalif-id](https://www.linkedin.com/in/mhdalif-id/)
- Instagram: [@mhdalif.id](https://www.instagram.com/mhdalif.id)

---

## Support

If This Tool Saves You Time:

**Give It a Star** on GitHub

**Share WIth Your Team** - Help Others Discover It

**Provide Feedback** - Open Issues or Discussions

**Sponsor** - Consider Sponsoring If This Becomes Part of Your Workflow

Built With Love for The Developer Community.
