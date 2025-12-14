#!/usr/bin/env node
import { Command } from "commander"
import fs from "fs-extra"
import path from "path"
import { execa } from "execa"
import chalk from "chalk"
import ora from "ora"
import boxen from "boxen"
import figlet from "figlet"
import { confirm } from "@inquirer/prompts"

const program = new Command()

program
  .name("nexstjs")
  .argument("<project-name>")
  .option("--pm <pm>", "package manager: pnpm|npm", "pnpm")
  .option("--no-ux", "disable interactive UI")
  .option("--no-alias", "disable import alias (@/*)")
  .parse()

const projectName = program.args[0]
const opts = program.opts()
const pm = opts.pm
const useAlias = opts.alias !== false

const root = path.resolve(process.cwd(), projectName)
const feDir = path.join(root, "frontend")
const beDir = path.join(root, "backend")

const FRONTEND_PORT = 3000
const BACKEND_PORT = 4000
const IMPORT_ALIAS = "@/*"

async function sh(cmd, args, cwd, hideOutput = false) {
  const options = { 
    cwd, 
    stdio: hideOutput ? "pipe" : "inherit",
    env: hideOutput ? { 
      ...process.env, 
      npm_config_loglevel: "error",
      PNPM_REPORTER: "silent"
    } : { ...process.env }
  }
  await execa(cmd, args, options)
}

function clickableLink(text, url) {
  const supportsLinks = !!process.env.TERM_PROGRAM
  if (supportsLinks) {
    return chalk.greenBright.bold(`\u001b]8;;${url}\u001b\\${text}\u001b]8;;\u001b\\`) + chalk.dim(` (${url})`)
  }
  return chalk.greenBright.bold(text) + chalk.dim(` - ${url}`)
}

function banner() {
  const title = figlet.textSync("NEXSTJS", { horizontalLayout: "full" })
  const description = chalk.greenBright.bold("Opinionated NextJS + NestJS Full-Stack Scaffold in One Command")
  const content = chalk.greenBright.bold(title) + "\n" + description
  
  console.log(
    boxen(content, {
      padding: 1,
      margin: 1,
      borderStyle: "double",
      borderColor: "greenBright",
      textAlignment: "center"
    })
  )
  console.log("")
  console.log(chalk.greenBright("▸ ") + chalk.dim("LinkedIn: ") + clickableLink("@mhdalif-id", "https://www.linkedin.com/in/mhdalif-id/"))
  console.log(chalk.greenBright("▸ ") + chalk.dim("GitHub: ") + clickableLink("@aldevvv", "https://github.com/aldevvv"))
  console.log(chalk.greenBright("▸ ") + chalk.dim("Instagram: ") + clickableLink("@mhdalif.id", "https://www.instagram.com/mhdalif.id"))
  console.log("")
}

async function step(label, fn) {
  const sp = ora({
    text: label,
    spinner: "dots12",
    color: "green"
  }).start()
  try {
    const res = await fn()
    sp.succeed(chalk.greenBright("✓ ") + chalk.hex("#00ff41")(label))
    return res
  } catch (e) {
    sp.fail(chalk.red("✗ ") + chalk.dim(label))
    throw e
  }
}

async function checkPackageManager(pm) {
  try {
    await execa(pm, ["--version"], { stdio: "pipe" })
    return true
  } catch {
    return false
  }
}

async function run() {
  if (!projectName) {
    console.log("")
    console.log(chalk.red.bold("✗ ERROR: ") + chalk.dim("Project name is required"))
    console.log(chalk.dim("  Example: ") + chalk.hex("#00ff41")("npx nexstjs my-project"))
    console.log("")
    process.exit(1)
  }

  if (await fs.pathExists(root)) {
    console.log("")
    console.log(chalk.red.bold("✗ ERROR: ") + chalk.dim("Folder already exists"))
    console.log(chalk.hex("#ff0000")(`  ${root}`))
    console.log("")
    process.exit(1)
  }

  const pmInstalled = await checkPackageManager(pm)
  if (!pmInstalled) {
    console.log("")
    console.log(chalk.red.bold("✗ ERROR: ") + chalk.dim(`${pm} is not installed`))
    console.log("")
    if (pm === "pnpm") {
      console.log(chalk.dim("Install PNPM with:"))
      console.log(chalk.hex("#00ff41")("  npm install -g pnpm"))
      console.log("")
      console.log(chalk.dim("Or Enable via Corepack (Node 16.13+ / 18+):"))
      console.log(chalk.hex("#00ff41")("  Corepack enable"))
      console.log("")
      console.log(chalk.dim("More info: ") + chalk.hex("#00ff41")("https://pnpm.io/installation"))
    } else {
      console.log(chalk.dim("NPM should come with NodeJS"))
      console.log(chalk.dim("Visit: ") + chalk.hex("#00ff41")("https://nodejs.org/"))
    }
    console.log("")
    process.exit(1)
  }

  if (!opts.ux) {
    console.log(chalk.dim("UX Disabled"))
  } else {
    banner()
  }

  const usePnpm = pm === "pnpm"
  const pmArgs = usePnpm ? ["--use-pnpm"] : ["--use-npm"]

  const useSrcDir = true
  const importAlias = useAlias ? IMPORT_ALIAS : ""

  if (opts.ux) {
    const startConfirm = await confirm({ 
      message: chalk.greenBright("Start Scaffolding Your Project?"), 
      default: true 
    })
    
    if (!startConfirm) {
      console.log("")
      console.log(chalk.yellow("⚠ Scaffolding Cancelled"))
      console.log("")
      process.exit(0)
    }
  }

  await fs.ensureDir(root)

  await step("Creating NextJS App in Frontend", async () => {
    const args = [
      "create-next-app@latest",
      "frontend",
      "--ts",
      "--eslint",
      "--tailwind",
      "--app",
      "--yes",
      ...pmArgs
    ]

    if (useSrcDir) args.push("--src-dir")
    if (importAlias) args.push("--import-alias", importAlias)

    await sh("npx", args, root, true)
  })

  await step("Installing ShadcnUI CLI", async () => {
    await sh(pm, ["add", "-D", "shadcn@latest"], feDir, true)
  })

  await step("Initializing ShadcnUI (Slate)", async () => {
    const shadcnArgs = usePnpm 
      ? ["exec", "shadcn", "init", "--yes", "--base-color", "slate"]
      : ["shadcn", "init", "--yes", "--base-color", "slate"]
    await sh(usePnpm ? "pnpm" : "npx", shadcnArgs, feDir, true)
  })

  const shadcnComponents = [
    "alert-dialog",
    "dialog",
    "alert",
    "badge",
    "avatar",
    "dropdown-menu",
    "empty",
    "skeleton",
    "breadcrumb",
    "kbd",
    "label",
    "pagination",
    "field",
    "item",
    "textarea",
    "tooltip",
    "select",
    "separator"
  ]

  await step("Adding ShadcnUI Components", async () => {
    const shadcnArgs = usePnpm
      ? ["exec", "shadcn", "add", "--yes", ...shadcnComponents]
      : ["shadcn", "add", "--yes", ...shadcnComponents]
    await sh(usePnpm ? "pnpm" : "npx", shadcnArgs, feDir, true)
  })

  const feDeps = [
    "gsap@latest",
    "lenis@latest",
    "lucide-react@latest",
    "framer-motion@latest",
    "lottie-react@latest",
    "axios@latest",
    "date-fns@latest",
    "sonner@latest",
    "three@latest",
    "@react-three/drei@latest",
    "@tanstack/react-query@latest",
    "react-hook-form@latest",
    "zod@latest",
    "@t3-oss/env-nextjs@latest",
    "clsx@latest",
    "tailwind-merge@latest"
  ]

  await step("Installing Frontend Deps", async () => {
    await sh(pm, ["add", ...feDeps], feDir, true)
  })

  await step("Creating NestJS App in Backend", async () => {
    await sh("npx", ["@nestjs/cli@latest", "new", "backend", "--package-manager", pm, "--skip-git", "--skip-install"], root, true)
  })

  await step("Installing Backend Base Dependencies", async () => {
    await sh(pm, ["install"], beDir, true)
  })

  const beDeps = [
    "helmet@latest",
    "cookie-parser@latest",
    "dotenv@latest",
    "class-validator@latest",
    "class-transformer@latest",
    "@supabase/supabase-js@latest",
    "multer@latest",
    "passport@latest",
    "@nestjs/passport@latest",
    "@nestjs/jwt@latest",
    "@nestjs/config@latest",
    "@nestjs/throttler@latest",
    "argon2@latest",
    "@nestjs/swagger@latest",
    "prisma@latest",
    "@prisma/client@latest"
  ]

  await step("Installing Backend Deps", async () => {
    await sh(pm, ["add", ...beDeps], beDir, true)
    await sh(pm, ["add", "-D", "@types/cookie-parser", "@types/multer"], beDir, true)
  })

  await step("Initializing Prisma", async () => {
    await sh("npx", ["prisma", "init"], beDir, true)
  })

  await step("Configuring Backend Port", async () => {
    const mainTsPath = path.join(beDir, "src", "main.ts")
    
    if (!await fs.pathExists(mainTsPath)) {
      throw new Error("backend/src/main.ts not found - NestJS scaffold may have failed")
    }
    
    let mainContent = await fs.readFile(mainTsPath, "utf8")
    const originalContent = mainContent
    
    if (mainContent.includes("await app.listen(3000);")) {
      mainContent = mainContent.replace(
        "await app.listen(3000);",
        `await app.listen(Number(process.env.PORT) || ${BACKEND_PORT});`
      )
    } else {
      const listenMatch = mainContent.match(/await app\.listen\(([\s\S]*?)\);/)
      
      if (listenMatch) {
        const argsContent = listenMatch[1]
        
        if (argsContent.includes(",")) {
          console.log("")
          console.log(chalk.yellow("⚠ WARNING: Backend main.ts uses multi-argument app.listen()"))
          console.log(chalk.dim("  The template binds to a specific host or has custom config."))
          console.log(chalk.dim("  Please ensure your app reads PORT from process.env manually."))
          console.log("")
          return 
        } else {
          mainContent = mainContent.replace(
            /await app\.listen\(([\s\S]*?)\);/,
            `await app.listen(Number(process.env.PORT) || ${BACKEND_PORT});`
          )
        }
      } else {
        console.log("")
        console.log(chalk.yellow("⚠ WARNING: await app.listen(...) not found in backend/src/main.ts"))
        console.log(chalk.dim("  Please ensure your app reads PORT from process.env manually."))
        console.log("")
        return
      }
    }
    
    if (mainContent !== originalContent) {
      await fs.writeFile(mainTsPath, mainContent, "utf8")
    }
  })

  await step("Generating Backend .env.example", async () => {
    const envExample = `# Server Configuration
NODE_ENV=development
PORT=${BACKEND_PORT}

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
CORS_ORIGIN=http://localhost:${FRONTEND_PORT}

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=120
`
    await fs.writeFile(path.join(beDir, ".env.example"), envExample, "utf8")
  })

  await step("Generating Frontend .env.local.example", async () => {
    const envExample = `# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:${BACKEND_PORT}

# Application Configuration
NEXT_PUBLIC_APP_NAME=${projectName}
NEXT_PUBLIC_APP_ENV=development

# Optional: Sentry DSN for Error Tracking
# NEXT_PUBLIC_SENTRY_DSN=
`
    await fs.writeFile(path.join(feDir, ".env.local.example"), envExample, "utf8")
  })

  await step("Creating Root Package Configuration", async () => {
    const rootPkg = {
      name: projectName,
      private: true,
      scripts: {
        "dev": usePnpm 
          ? "concurrently \"pnpm -C frontend dev\" \"pnpm -C backend start:dev\"" 
          : "concurrently \"npm --prefix frontend run dev\" \"npm --prefix backend run start:dev\"",
        "dev:web": usePnpm ? "pnpm -C frontend dev" : "npm --prefix frontend run dev",
        "dev:api": usePnpm ? "pnpm -C backend start:dev" : "npm --prefix backend run start:dev",
        "build": usePnpm 
          ? "pnpm -C frontend build && pnpm -C backend build" 
          : "npm --prefix frontend run build && npm --prefix backend run build",
        "build:web": usePnpm ? "pnpm -C frontend build" : "npm --prefix frontend run build",
        "build:api": usePnpm ? "pnpm -C backend build" : "npm --prefix backend run build",
        "start:web": usePnpm 
          ? `pnpm -C frontend start -- -p ${FRONTEND_PORT}` 
          : `npm --prefix frontend run start -- -p ${FRONTEND_PORT}`,
        "start:api": usePnpm ? "pnpm -C backend start:prod" : "npm --prefix backend run start:prod"
      },
      devDependencies: {
        "concurrently": "latest"
      }
    }
    await fs.writeJson(path.join(root, "package.json"), rootPkg, { spaces: 2 })
  })

  await step("Creating Project Contract (nexst.json)", async () => {
    const contract = {
      name: projectName,
      apps: {
        web: {
          path: "frontend",
          port: FRONTEND_PORT,
          health: "/"
        },
        api: {
          path: "backend",
          port: BACKEND_PORT,
          health: "/health"
        }
      },
      packageManager: pm,
      node: "20"
    }
    await fs.writeJson(path.join(root, "nexst.json"), contract, { spaces: 2 })
  })

  await step("Installing Root Dependencies", async () => {
    await sh(pm, ["install"], root, true)
  })

  console.log("")
  console.log(chalk.hex("#00ff41")("━".repeat(60)))
  console.log("")
  console.log(boxen(
    chalk.greenBright.bold("PROJECT INITIALIZED SUCCESSFULLY") + "\n\n" +
    chalk.dim("Your Full-Stack Project is Ready to Go!"),
    {
      padding: 1,
      margin: { top: 0, bottom: 1, left: 2, right: 2 },
      borderStyle: "round",
      borderColor: "greenBright",
      align: "center"
    }
  ))
  
  const devCmd = usePnpm ? "pnpm dev" : "npm run dev"

  console.log(chalk.greenBright.bold("  ⚡ Quick Start"))
  console.log("")
  console.log(chalk.dim("  1. Navigate to Your Project"))
  console.log(chalk.hex("#00ff41")(`     cd ${projectName}`))
  console.log("")
  console.log(chalk.dim("  2. Run Development Servers (Both Frontend + Backend)"))
  console.log(chalk.hex("#00ff41")(`     ${devCmd}`))
  console.log("")
  console.log(chalk.dim("  Your Services:"))
  console.log(chalk.greenBright("     ▸ ") + chalk.dim("Frontend: ") + chalk.hex("#00ff41")(`http://localhost:${FRONTEND_PORT}`))
  console.log(chalk.greenBright("     ▸ ") + chalk.dim("Backend:  ") + chalk.hex("#00ff41")(`http://localhost:${BACKEND_PORT}`))
  console.log("")
  console.log(chalk.dim("  Environment Files:"))
  console.log(chalk.greenBright("     ▸ ") + chalk.dim("Frontend: ") + chalk.hex("#ffa500")("frontend/.env.local.example"))
  console.log(chalk.greenBright("     ▸ ") + chalk.dim("Backend:  ") + chalk.hex("#ffa500")("backend/.env.example"))
  console.log(chalk.dim("     Copy these to .env.local and .env respectively"))
  console.log("")
  console.log(chalk.hex("#00ff41")("━".repeat(60)))
  console.log("")
}

run().catch(async (e) => {
  console.log("")
  console.log(chalk.red.bold("✗ FATAL ERROR"))
  console.log(chalk.hex("#ff0000")("━".repeat(60)))
  console.log(chalk.dim(e.message || e))
  console.log(chalk.hex("#ff0000")("━".repeat(60)))
  
  if (await fs.pathExists(root)) {
    console.log("")
    console.log(chalk.yellow.bold("⚠ Partial scaffold created."))
    console.log(chalk.dim("  You may want to delete the folder:"))
    console.log(chalk.hex("#ffaa00")(`  rm -rf ${root}`))
  }
  
  console.log("")
  process.exit(1)
})
