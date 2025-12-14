# nexstjs

> Opinionated NextJS + NestJS Full-Stack Scaffold — Zero Config, One Command, Production Ready.

A deterministic CLI tool that bootstraps a modern full-stack application with **Next.js (App Router)** frontend and **NestJS** backend. Preconfigured with industry-standard libraries, standardized ports, and environment contracts designed for automated VPS deployment.

```bash
npx nexstjs my-app
cd my-app
npm run dev
```

---

## Features

### Deterministic Scaffolding

- **Zero interactive prompts** for project structure (use `--no-ux` to skip all prompts)
- **src/ directory always enabled** for Next.js
- **Import alias (@/*) enabled by default** (disable with `--no-alias`)
- **Standardized ports**: Frontend (3000), Backend (4000)
- **Production-ready environment templates** auto-generated
- **Deployment contract file** (`nexst.json`) for automated tooling

### Frontend Stack

**Core Framework**
- Next.js (Latest with App Router)
- TypeScript with `@/*` path mapping
- ESLint + TailwindCSS
- Always uses `src/` directory structure

**UI & Components**
- ShadcnUI (Slate theme) with 17+ preinstalled components
- Lucide React icons

**Animation & Motion**
- GSAP (timeline animations)
- Framer Motion (declarative animations)
- Lenis (smooth scroll)
- Lottie React (JSON animations)
- Three.js + @react-three/drei (3D graphics)

**Data & Forms**
- Axios (HTTP client)
- TanStack Query (server state)
- React Hook Form + Zod (forms & validation)

**Utilities**
- clsx + tailwind-merge
- date-fns
- sonner (toast notifications)
- @t3-oss/env-nextjs (type-safe env variables)

### Backend Stack

**Core Framework**
- NestJS (Latest)
- TypeScript
- ESLint

**Security & Middleware**
- Helmet (security headers)
- Cookie parser
- Rate limiting (@nestjs/throttler)
- CORS configured for frontend

**Authentication & Authorization**
- Passport.js integration
- JWT strategy (@nestjs/jwt)
- Argon2 password hashing

**Validation & Configuration**
- class-validator (DTO validation)
- class-transformer
- @nestjs/config (environment variables)

**API & Documentation**
- @nestjs/swagger (OpenAPI)
- Multer (file uploads)

**Database**
- Prisma ORM with auto-initialization
- @prisma/client
- Supabase client integration

---

## Project Structure

```
my-app/
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   ├── components/       # React components
│   │   │   └── ui/           # ShadcnUI components
│   │   └── lib/              # Utilities
│   ├── public/               # Static assets
│   ├── .env.local.example    # Frontend environment template
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── main.ts           # Entry (port 4000)
│   │   ├── app.module.ts
│   │   └── ...
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── .env.example          # Backend environment template
│   ├── tsconfig.json
│   └── package.json
│
├── nexst.json                # Deployment contract
├── package.json              # Root scripts
└── README.md
```

---

## Quick Start

### Basic Usage

**With pnpm (recommended)**
```bash
npx nexstjs my-app
cd my-app
pnpm dev
```

**With npm**
```bash
npx nexstjs my-app --pm npm
cd my-app
npm run dev
```

### Services

After running `npm run dev` or `pnpm dev`, your services will be available at:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000

### Environment Setup

**Frontend** (`frontend/.env.local`)
```bash
cp frontend/.env.local.example frontend/.env.local
# Edit with your values
```

**Backend** (`backend/.env`)
```bash
cp backend/.env.example backend/.env
# Edit with your database and secrets
```

---

## CLI Options

| Option           | Type     | Description                       | Default  |
|------------------|----------|-----------------------------------|----------|
| `<project-name>` | required | Project folder name               | -        |
| `--pm`           | optional | Package manager (`pnpm` or `npm`) | `pnpm`   |
| `--no-ux`        | flag     | Skip all interactive prompts      | `false`  |
| `--no-alias`     | flag     | Disable import alias (@/*)        | `false`  |

### Examples

**Non-interactive mode (CI/CD)**
```bash
npx nexstjs my-app --no-ux
```

**With npm and no alias**
```bash
npx nexstjs my-app --pm npm --no-alias
```

**Silent scaffold**
```bash
npx nexstjs my-app --no-ux --pm npm
```

---

## Root Scripts

All projects include these standardized scripts in the root `package.json`:

| Script        | Description                                    |
|---------------|------------------------------------------------|
| `dev`         | Run frontend + backend concurrently            |
| `dev:web`     | Run frontend only                              |
| `dev:api`     | Run backend only                               |
| `build`       | Build both apps                                |
| `build:web`   | Build frontend                                 |
| `build:api`   | Build backend                                  |
| `start:web`   | Start frontend in production (port 3000)       |
| `start:api`   | Start backend in production (port 4000)        |

**Note:** The root `package.json` includes `concurrently` as a dev dependency, which is automatically installed during scaffolding.

### Examples

```bash
# Development (both services)
npm run dev

# Development (separate terminals)
npm run dev:web    # Terminal 1
npm run dev:api    # Terminal 2

# Production build
npm run build

# Production start
npm run start:web  # Terminal 1
npm run start:api  # Terminal 2
```

**Production Scripts:**
- `start:web` explicitly enforces port 3000: `npm --prefix frontend run start -- -p 3000`
- `start:api` runs the NestJS production build: `npm --prefix backend run start:prod`

---

## Standardized Ports

Ports are **enforced and documented** across all generated files:

| Service  | Port | Environment Variable | Health Check |
|----------|------|----------------------|--------------|
| Frontend | 3000 | `PORT` (Next.js)     | `/`          |
| Backend  | 4000 | `PORT`               | `/health`    |

### Port Enforcement

**Backend:**  
The CLI automatically patches `backend/src/main.ts` to use:
```typescript
await app.listen(Number(process.env.PORT) || 4000);
```

**Frontend:**  
- Development: Uses Next.js default (3000)
- Production: `start:web` script explicitly enforces port 3000 via `-p 3000` flag

---

## Environment Templates

### Backend `.env.example`

Generated with production-ready keys:

```env
# Server Configuration
NODE_ENV=development
PORT=4000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/mydb?schema=public
SUPABASE_DB_DIRECT_URL=postgresql://postgres:<PASSWORD>@db.<PROJECT_REF>.supabase.co:5432/postgres?sslmode=require

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=120
```

### Frontend `.env.local.example`

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000

# Application Configuration
NEXT_PUBLIC_APP_NAME=my-app
NEXT_PUBLIC_APP_ENV=development

# Optional: Sentry DSN for Error Tracking
# NEXT_PUBLIC_SENTRY_DSN=
```

---

## Deployment Contract (nexst.json)

Every project includes a `nexst.json` file at the root, designed for automated VPS deployment tooling:

```json
{
  "name": "my-app",
  "apps": {
    "web": {
      "path": "frontend",
      "port": 3000,
      "health": "/"
    },
    "api": {
      "path": "backend",
      "port": 4000,
      "health": "/health"
    }
  },
  "packageManager": "pnpm",
  "node": "20"
}
```

This contract provides:
- App paths and ports
- Health check endpoints
- Package manager preference
- Node.js version requirement

---

## Design Philosophy

### Core Principles

**1. Deterministic by default**
- No runtime guessing
- Consistent output every time
- CI/CD friendly

**2. Production-ready foundation**
- Standardized ports for reverse proxies
- Environment templates with all required keys
- Security best practices (Argon2, Helmet, CORS, rate limiting)

**3. Deployment-first**
- `nexst.json` contract for automated tooling
- Unified scripts for build and start
- Health check endpoints documented

**4. Latest-first approach**
- Always installs latest stable versions
- No locked templates
- Stay current with ecosystem

**5. Simple, not simplistic**
- Two-folder structure (frontend / backend)
- No monorepo complexity
- Easy to understand and modify

### Who Is This For?

**Ideal for:**
- Developers starting new full-stack projects
- Teams wanting consistent scaffolding
- Projects targeting VPS deployment
- Automated deployment pipelines

**Not ideal for:**
- Existing projects (not a migration tool)
- Highly customized build pipelines
- Projects requiring specific dependency versions

---

## Development Workflow

### Frontend Development

```bash
cd frontend

# Development
pnpm dev

# Build
pnpm build

# Lint
pnpm lint

# Add ShadcnUI components
pnpm shadcn add button
```

### Backend Development

```bash
cd backend

# Development
pnpm start:dev

# Build
pnpm build

# Production
pnpm start:prod

# Prisma
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

### Database Setup

1. Update `backend/.env` with your database URL
2. Modify `backend/prisma/schema.prisma`
3. Run migrations:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npx prisma generate
   ```

---

## Package Managers

### pnpm (recommended)

Fast, efficient, and disk-space friendly.

**Installation**
```bash
# Via npm
npm install -g pnpm

# Via Corepack (Node 16.13+)
corepack enable
```

### npm

Built-in with Node.js, works out of the box.

---

## Requirements

### System Requirements

- **Node.js**: 18.x or higher (20.x recommended)
- **Package Manager**: pnpm 8+ or npm 9+
- **OS**: Linux, macOS, Windows (WSL2)

### Network

Stable internet connection required for downloading dependencies and CLI tools.

---

## Troubleshooting

### pnpm not found

```bash
# Option 1: Install globally
npm install -g pnpm

# Option 2: Enable Corepack
corepack enable
```

### Port already in use

**Frontend**
```bash
PORT=3002 pnpm dev
```

**Backend**

Edit `backend/src/main.ts` and change the port, or set `PORT=4002` in `.env`.

### TypeScript errors after scaffolding

```bash
# Frontend
cd frontend && pnpm tsc --noEmit

# Backend
cd backend && pnpm tsc --noEmit
```

### Prisma client not generated

```bash
cd backend
npx prisma generate
```

---

## Roadmap

**Planned Features**
- Health check endpoint auto-generation for backend
- Docker Compose optional setup
- GitHub Actions CI/CD templates
- Testing setup (Jest, Playwright)
- More ShadcnUI theme presets

---

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Test thoroughly
4. Submit PR with clear description

**Development Setup**
```bash
git clone https://github.com/aldevvv/nexstjs.git
cd nexstjs
pnpm install

# Test locally
pnpm link --global
cd /tmp
nexstjs test-project
```

---

## Credits

Built with:
- [Next.js](https://nextjs.org/) by Vercel
- [NestJS](https://nestjs.com/) by Kamil Myśliwiec
- [Shadcn UI](https://ui.shadcn.com/) by shadcn
- [Prisma](https://www.prisma.io/)
- [TanStack Query](https://tanstack.com/query)

Special thanks to the open-source community.

---

## License

MIT License - See [LICENSE](LICENSE) for details.

**TL;DR:** You can use, modify, and distribute this tool commercially. Attribution appreciated but not required.

---

## Author

**Muhammad Alif**

- GitHub: [@aldevvv](https://github.com/aldevvv)
- LinkedIn: [mhdalif-id](https://www.linkedin.com/in/mhdalif-id/)
- Instagram: [@mhdalif.id](https://www.instagram.com/mhdalif.id)

---

**Built for the developer community. Give it a ⭐ if it saves you time!**
