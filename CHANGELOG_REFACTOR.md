# NexstJS Refactor Changelog

## Summary

This refactor transforms NexstJS from an interactive scaffold into a deterministic, production-ready CLI tool optimized for automated VPS deployment.

---

## Breaking Changes

### 1. Interactive Prompts Removed

**Before:**
- CLI asked "Use src/ Directory?" (defaulted to false)
- CLI asked "Import Alias?" with options (@/* or No Alias)

**After:**
- `src/` directory is **always enabled**
- Import alias `@/*` is **enabled by default**
- Use `--no-alias` flag to disable alias
- Only remaining prompt: "Start scaffolding?" (can be skipped with `--no-ux`)

**Migration:**
- No action needed if you preferred src/ and @/* (now the default)
- Use `--no-alias` flag if you don't want import aliases

---

### 2. Standardized Ports

**Before:**
- Frontend: 3000 (Next.js default)
- Backend: 3000 (NestJS default) - caused conflicts!

**After:**
- Frontend: **3000** (documented constant)
- Backend: **4000** (enforced via `process.env.PORT || 4000`)

**What Changed:**
- Backend `main.ts` is now automatically patched during scaffolding
- All environment templates reference these ports
- Root scripts and contract files reflect these ports

---

### 3. Environment Files Auto-Generated

**Before:**
- No environment templates created
- Users had to manually create .env files

**After:**

**Backend `.env.example`** (auto-generated):
- NODE_ENV
- PORT (4000)
- JWT_SECRET
- JWT_EXPIRES_IN
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- DATABASE_URL
- SUPABASE_DB_DIRECT_URL
- CORS_ORIGIN
- THROTTLE_TTL
- THROTTLE_LIMIT

**Frontend `.env.local.example`** (auto-generated):
- NEXT_PUBLIC_API_URL (http://localhost:4000)
- NEXT_PUBLIC_APP_NAME
- NEXT_PUBLIC_APP_ENV
- NEXT_PUBLIC_SENTRY_DSN (optional)

Users must copy these to `.env` and `.env.local` respectively.

---

### 4. Root Scripts Standardized

**Before:**
```json
{
  "scripts": {
    "dev:frontend": "pnpm -C frontend dev",
    "dev:backend": "pnpm -C backend start:dev"
  }
}
```

**After:**
```json
{
  "scripts": {
    "dev": "concurrently \"pnpm -C frontend dev\" \"pnpm -C backend start:dev\"",
    "dev:web": "pnpm -C frontend dev",
    "dev:api": "pnpm -C backend start:dev",
    "build": "pnpm -C frontend build && pnpm -C backend build",
    "build:web": "pnpm -C frontend build",
    "build:api": "pnpm -C backend build",
    "start:web": "pnpm -C frontend start",
    "start:api": "pnpm -C backend start:prod"
  },
  "devDependencies": {
    "concurrently": "latest"
  }
}
```

**Benefits:**
- Single `dev` command runs both servers
- Consistent naming convention (web/api)
- Production-ready start commands
- Works with both pnpm and npm

---

### 5. Project Contract File (nexst.json)

**New Feature:**

Every project now includes `nexst.json` at the root:

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

**Purpose:**
- Machine-readable deployment contract
- Enables automated VPS deployment tooling
- Documents health check endpoints
- Specifies Node.js version requirement

---

## New CLI Options

### `--no-alias`

Disables import alias generation.

**Usage:**
```bash
npx nexstjs my-app --no-alias
```

**Result:**
- Next.js configured without `@/*` path mapping
- Must use relative imports: `../../components/ui/button`

---

## Updated Workflow

### Before
```bash
npx nexstjs my-app
# Answer: Use src/ directory? No
# Answer: Import alias? @/*

cd my-app

# Terminal 1
pnpm -C frontend dev

# Terminal 2
pnpm -C backend start:dev

# Manually create .env files
```

### After
```bash
npx nexstjs my-app
# Optional: Answer "Start scaffolding?" Yes

cd my-app

# Copy environment files
cp frontend/.env.local.example frontend/.env.local
cp backend/.env.example backend/.env

# Single command runs both
pnpm dev
```

**Key Improvements:**
- One less terminal needed
- Environment templates provided
- Consistent project structure
- Clear port assignments

---

## Code Changes Summary

### bin/nexstjs.js

**Imports:**
- Removed `select` from @inquirer/prompts (no longer needed)

**New Constants:**
```javascript
const FRONTEND_PORT = 3000
const BACKEND_PORT = 4000
const IMPORT_ALIAS = "@/*"
```

**Deterministic Defaults:**
```javascript
const useSrcDir = true  // Always enabled
const useAlias = opts.alias !== false  // Controlled by --no-alias flag
const importAlias = useAlias ? IMPORT_ALIAS : ""
```

**New Steps:**
1. "Configuring Backend Port" - patches main.ts
2. "Generating Backend .env.example" - creates template
3. "Generating Frontend .env.local.example" - creates template
4. "Installing Root Dependencies" - adds concurrently
5. "Creating Project Contract (nexst.json)" - generates contract

**Updated Success Message:**
- Shows unified `dev` command
- Displays both service URLs with ports
- References environment template files

---

## Documentation Changes

### README.md - Complete Rewrite

**New Sections:**
- Deterministic Scaffolding (highlights zero-prompt approach)
- Standardized Ports (table with health checks)
- Environment Templates (full examples)
- Deployment Contract (nexst.json documentation)
- Root Scripts (complete table)
- Design Philosophy (production-ready focus)

**Removed:**
- Interactive mode examples (src/ and alias questions)
- Old script names (dev:frontend, dev:backend)

**Updated:**
- Quick Start (shows single `dev` command)
- CLI Options (added `--no-alias`)
- Project Structure (highlights .env.example files)

---

## Migration Guide

### For Existing Users

If you've been using nexstjs and want to upgrade:

**No Changes Needed If:**
- You were using src/ directory (now default)
- You were using @/* alias (now default)
- You don't mind the new port 4000 for backend

**Action Required If:**
- You prefer no src/ directory → Not supported, now mandatory
- You prefer no import alias → Use `--no-alias` flag
- You were using custom ports → Update your deployment configs

---

## Testing Checklist

Before publishing, verify:

- [ ] `npx nexstjs test-app` scaffolds without errors
- [ ] `pnpm dev` runs both servers concurrently
- [ ] Frontend accessible at http://localhost:3000
- [ ] Backend accessible at http://localhost:4000
- [ ] `backend/.env.example` contains all required keys
- [ ] `frontend/.env.local.example` exists and is correct
- [ ] `nexst.json` is created with proper structure
- [ ] Root `package.json` has all 8 scripts
- [ ] `--no-alias` flag disables import alias
- [ ] `--no-ux` skips all prompts
- [ ] Works with both `--pm pnpm` and `--pm npm`

---

## Future Compatibility

This refactor prepares nexstjs for:

1. **Automated VPS Deployment Tool**
   - Will read `nexst.json` contract
   - Will use standardized scripts
   - Will know exact ports for reverse proxy config

2. **CI/CD Integration**
   - `--no-ux` flag for non-interactive builds
   - Deterministic output (same every time)
   - Clear build and start commands

3. **Health Check Automation**
   - Health endpoints documented in contract
   - Backend should implement `/health` endpoint
   - Frontend health is root `/`

---

## Version Bump Recommendation

This is a **major version** change due to:
- Breaking changes in default behavior (src/ now mandatory)
- Removed interactive options
- Changed script names

Suggested version: **2.0.0**

---

## Author Notes

**Philosophy:**
- Opinionated but pragmatic
- Production-first, not tutorial-first
- Automation-friendly
- No unnecessary abstraction

**Non-Goals:**
- Not a migration tool (for new projects only)
- Not a monorepo generator
- Not trying to support all use cases
- Not adding Docker (yet)

**What We Didn't Change:**
- Core dependency stack (intentionally kept)
- Two-folder structure (frontend / backend)
- Package manager flexibility (pnpm and npm)
- Latest-first approach (no version locking)

---

**This refactor is production-ready and maintains backward compatibility where it matters.**
