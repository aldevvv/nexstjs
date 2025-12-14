#!/usr/bin/env node
import { Command } from "commander"
import fs from "fs-extra"
import path from "path"
import { execa } from "execa"
import chalk from "chalk"
import ora from "ora"
import boxen from "boxen"
import figlet from "figlet"
import { confirm, select } from "@inquirer/prompts"

const program = new Command()

program
  .name("nexstjs")
  .argument("<project-name>")
  .option("--pm <pm>", "package manager: pnpm|npm", "pnpm")
  .option("--no-ux", "disable interactive UI")
  .parse()

const projectName = program.args[0]
const opts = program.opts()
const pm = opts.pm

const root = path.resolve(process.cwd(), projectName)
const feDir = path.join(root, "frontend")
const beDir = path.join(root, "backend")

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

  let useSrcDir = false
  let importAlias = "@/*"

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

    useSrcDir = await confirm({ message: chalk.greenBright("Use src/ Directory?"), default: false })

    const aliasChoice = await select({
      message: chalk.greenBright("Import Alias?"),
      choices: [
        { name: "@/*", value: "@/*" },
        { name: "No Alias", value: "" }
      ],
      default: "@/*",
    })

    importAlias = aliasChoice
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

  const rootPkg = {
    name: projectName,
    private: true,
    scripts: {
      "dev:frontend": usePnpm ? "pnpm -C frontend dev" : "npm --prefix frontend run dev",
      "dev:backend": usePnpm ? "pnpm -C backend start:dev" : "npm --prefix backend run start:dev"
    }
  }

  await fs.writeJson(path.join(root, "package.json"), rootPkg, { spaces: 2 })

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
  
  const frontendDevCmd = usePnpm ? "pnpm -C frontend dev" : "npm --prefix frontend run dev"
  const backendDevCmd = usePnpm ? "pnpm -C backend start:dev" : "npm --prefix backend run start:dev"

  console.log(chalk.greenBright.bold("  ⚡ Quick Start"))
  console.log("")
  console.log(chalk.dim("  1. Navigate to Your Project"))
  console.log(chalk.hex("#00ff41")(`     cd ${projectName}`))
  console.log("")
  console.log(chalk.dim("  2. Run Development Servers"))
  console.log(chalk.greenBright("     ▸ ") + chalk.dim("Frontend: ") + chalk.hex("#00ff41")(frontendDevCmd))
  console.log(chalk.greenBright("     ▸ ") + chalk.dim("Backend:  ") + chalk.hex("#00ff41")(backendDevCmd))
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
