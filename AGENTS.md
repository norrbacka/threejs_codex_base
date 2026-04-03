# AGENTS.md

This repository is a starter base for game development and interactive 3D work with Codex.

## Project Intent

- Treat this repo as a Three.js-first game and realtime 3D starter.
- Prefer reusable game-oriented architecture over throwaway demos.
- Keep implementations practical for iteration: clear scene structure, asset loading paths, animation flow, and input handling.

## Skill Guidance

- Check local skills in `.codex/skills` for Three.js-specific implementation help.
- Check bundled `superpowers` skills in `.codex/superpowers/skills` for process help such as planning, debugging, verification, and code review.
- For Three.js or game-engine-style work, use both layers together:
  - `superpowers` for process
  - `threejs-*` skills for implementation details
- In this repository, game-development requests should default to the local Three.js skill stack even if the user does not explicitly say "Three.js".
- Treat `threejs-game-base` as the default bridge skill for:
  - making a new game
  - brainstorming a game feature
  - planning gameplay systems
  - prototyping mechanics
  - building interactive 3D UI or game scenes

## Expected Behavior

- When the user asks for scene setup, rendering, cameras, controls, loaders, materials, shaders, lighting, textures, animation, interaction, or post-processing, prioritize the local Three.js skills.
- When the user asks to plan, debug, review, or execute work systematically, prioritize the appropriate `superpowers` skill.
- When both apply, use the process skill first and then the relevant Three.js skill.
- When the user asks for a new game, a game mechanic, or a gameplay feature without naming a rendering stack, assume this starter's default implementation target is Three.js unless the user says otherwise.
- For brainstorming in this repo, default to brainstorming toward a Three.js game or interactive 3D implementation, not a generic app implementation.

## Implementation Preferences

- Match the project's installed `three` version before copying API patterns.
- Preserve the repo's existing stack and abstractions if the project later adds wrappers such as React Three Fiber or custom engine helpers.
- Prefer maintainable game code over one-off snippets.
