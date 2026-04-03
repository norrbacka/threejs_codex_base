#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
agents_dir="$repo_root/.agents"
skills_dir="$agents_dir/skills"
local_skills_target="$repo_root/.codex/skills"
superpowers_target="$repo_root/.codex/superpowers/skills"
local_skills_link="$skills_dir/local-skills"
superpowers_link="$skills_dir/superpowers"

mkdir -p "$skills_dir"
rm -rf "$local_skills_link" "$superpowers_link"
ln -s "$local_skills_target" "$local_skills_link"
ln -s "$superpowers_target" "$superpowers_link"

echo "Created Codex skill symlinks:"
echo "  $local_skills_link -> $local_skills_target"
echo "  $superpowers_link -> $superpowers_target"
echo
echo "Restart Codex to pick up the local skills."
