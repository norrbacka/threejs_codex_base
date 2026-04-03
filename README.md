# threejs_codex_base

Starter base for new game and interactive 3D projects using Codex with:

- local Three.js skills in `.codex/skills`
- vendored [superpowers](./.codex/superpowers) skills in `.codex/superpowers/skills`

## What This Repo Includes

- `/.codex/skills`
  Project-local Three.js skills adapted for Codex.
- `/.codex/superpowers`
  Vendored `superpowers` repository for planning, debugging, review, and execution workflows.
- `/.agents`
  Ignored on purpose. This is where local machine-specific skill links are created.

## Quick Start

Clone the repo, then run one of these from the repo root:

### Windows PowerShell

```powershell
./scripts/setup-codex-skills.ps1
```

### macOS / Linux / Git Bash

```bash
./scripts/setup-codex-skills.sh
```

The setup script creates local skill discovery links for:

- `.agents/skills/local-skills` -> `.codex/skills`
- `.agents/skills/superpowers` -> `.codex/superpowers/skills`

After that, restart Codex so it discovers the skills.

## Why `.agents` Is Not Committed

The `.agents` folder contains machine-local symlinks or junctions. Those links depend on each developer's local checkout path, so the repo commits the actual skill content under `.codex` and recreates `.agents` locally with the setup script.

## Updating Bundled Skills

- Update Three.js skills by editing files in `.codex/skills`
- Update `superpowers` by replacing or pulling changes into `.codex/superpowers`, then commit the updated vendored files

## Recommended Flow For New Projects

1. Use this repo as the starting point for a new game or 3D prototype.
2. Run the setup script once after cloning.
3. Restart Codex.
4. Start building with the bundled Three.js and `superpowers` skills available locally.
