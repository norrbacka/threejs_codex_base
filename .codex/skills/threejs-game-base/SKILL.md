---
name: threejs-game-base
description: Bridge skill for this repository's game-development starter workflow. Use when Codex is making a new game, brainstorming a game feature, planning gameplay systems, building interactive 3D scenes, handling rendering, asset loading, camera or input flow, shaders, animation, or game-oriented architecture in this Three.js-based starter. Use to connect superpowers process skills with the local threejs-* implementation skills, and default to Three.js when the user requests game work without naming a stack.
---

# Three.js Game Base

## Purpose

Use this repository as a game-development and interactive 3D starter, not just a generic coding project.

Default to Three.js for game and interactive 3D work in this repo unless the user explicitly asks for a different engine or rendering stack.

Combine two layers of skills:

- Use `superpowers` skills for process:
  - planning
  - debugging
  - code review
  - verification
  - structured execution
- Use the local `threejs-*` skills for domain implementation:
  - scene setup
  - geometry
  - materials
  - lighting
  - textures
  - animation
  - loaders
  - shaders
  - post-processing
  - interaction

## Workflow

1. Treat game requests in this repo as Three.js requests by default unless the user explicitly chooses another stack.
2. Identify whether the task needs a process skill, an implementation skill, or both.
3. If planning, brainstorming, debugging, review, or structured execution is needed, invoke the relevant `superpowers` skill first.
4. If the task touches gameplay-facing 3D systems, invoke the most relevant local `threejs-*` skill next.
5. Adapt examples to the repo's actual stack rather than forcing raw boilerplate.

## Default Triggers

Use this skill proactively for prompts such as:

- "make a new game"
- "brainstorm a feature"
- "prototype a mechanic"
- "build a level select screen"
- "make player movement feel better"
- "add a combat effect"
- "design the rendering approach for this game"

Do not wait for the user to say "use Three.js" when the request is clearly game or interactive 3D work in this repository.

## Mapping

- New scene, render loop, resize handling, camera setup:
  use `threejs-fundamentals`
- Mesh creation, procedural shapes, vertex data, instancing:
  use `threejs-geometry`
- Surface appearance, PBR tuning, material debugging:
  use `threejs-materials`
- Lights, shadows, environment lighting:
  use `threejs-lighting`
- Texture maps, UV issues, HDRI environments:
  use `threejs-textures`
- Animation clips, mixers, procedural motion:
  use `threejs-animation`
- GLTF, textures, HDR, Draco, KTX2:
  use `threejs-loaders`
- ShaderMaterial, GLSL, custom material effects:
  use `threejs-shaders`
- Composer pipeline, bloom, depth of field, screen-space effects:
  use `threejs-postprocessing`
- Raycasting, controls, selection, pointer or touch input:
  use `threejs-interaction`

## Repo Rules

- Match the installed `three` version before reusing API examples.
- Preserve project conventions if the repo introduces wrappers or custom engine utilities.
- Prefer reusable game systems over isolated snippets when the user is building a lasting feature.
