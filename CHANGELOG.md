# Changelog

## 1.0.6 - Unreleased

### Fixed

- Prevented the CLI from hanging silently on the first frontend step by using package-manager-aware remote CLI execution:
  - `npx --yes ...` for npm users
  - `pnpm dlx ...` for pnpm users
- Improved scaffold failure messages so failed child commands include the command, working directory, and captured output in non-interactive mode.
- Removed the stale shadcn/ui `--base-color slate` initialization flow.
- Fixed local install reproducibility by aligning `package.json` dependency ranges with `pnpm-lock.yaml`.

### Changed

- Default mode now lets upstream CLIs show their current interactive prompts, especially `create-next-app` and `shadcn`.
- Interactive Next.js scaffolding resets saved `create-next-app` preferences so current upstream choices are surfaced instead of silently reusing older defaults.
- `--no-ux` remains the deterministic automation path for CI and scripted usage.
- shadcn/ui is now executed through its current remote CLI flow instead of being installed as a frontend dev dependency first.
- NestJS scaffolding now runs through the same package-manager-aware remote CLI helper.
- Node.js requirement is now `>=20.12` to match the current CLI dependency tree.

### Notes

- This release is intended to be tested locally before commit, push, and npm publish.
- The project still intentionally uses latest upstream scaffold tools for generated apps, so regular smoke testing remains important before each npm release.
