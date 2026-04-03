# ULTRATHELLO Design

Date: 2026-04-03
Status: Approved for planning

## Overview

ULTRATHELLO is a local four-player strategy game that extends classic Othello into a four-color format on the same 8x8 board. The four factions are black, white, red, and blue. The experience should preserve the clarity and tension of Othello while adding stronger arcade-style presentation, a bold 3D board, and satisfying chained flip animations when captured pieces change ownership.

The first version is intentionally focused. It is a hot-seat game played on one shared keyboard, with no AI, no networking, and no alternate board sizes or rulesets. The goal is to prove the four-player rules, create a readable 3D presentation, and make the capture sequence feel excellent.

## Goals

- Build a four-player adaptation of Othello that still feels easy to understand.
- Keep the board readable from a fixed, angled top-down camera.
- Make keyboard placement feel fast and precise.
- Turn captures into a strong visual payoff with staged flip animations.
- Keep game rules isolated from rendering so the core logic stays testable and extensible.

## Non-Goals

- Computer-controlled opponents
- Online or networked multiplayer
- Alternate board sizes
- Multiple camera modes
- Menus-heavy meta systems or progression
- Rule variants beyond the core four-player rules described here

## Core Rules

### Board and Players

- The game board is an 8x8 grid.
- There are four players in a fixed order: black, white, red, then blue.
- Player colors are black, white, red, and blue.
- The opening position is a centered 4x4 block, divided into four 2x2 quadrants.
- The opening quadrants are assigned as: top-left black, top-right white, bottom-left red, bottom-right blue.

### Turn Structure

On a player's turn, they move a board cursor with the keyboard, select a legal square, and place one piece of their color. After placement, the game resolves all captured lines, flips captured pieces to the active player's color, updates the score totals, and advances to the next player.

If the current player has no legal moves, that player skips their turn and remains in the game. The game ends when the board is full or when all four players consecutively have no legal moves.

### Capture Rules

Capture rules follow Othello-style enclosure logic in all eight directions:

- A move is legal if, in at least one direction, the newly placed piece encloses one or more opposing pieces and is terminated by an existing piece of the active player's color.
- Enclosed lines may contain mixed opponent colors. They do not need to be a single color.
- Every enclosed opposing piece in every valid direction flips to the active player's color.

This means the rules engine must support lines such as `black -> red -> white -> blue -> black` as capturable for the active black player, as long as the newly placed black piece closes that line legally.

### Win Condition

When the game ends, the winner is the player with the highest piece count. If two or more players are tied for the highest score, the first version should present the result as a tie between those colors.

## Player Experience

### Visual Direction

The presentation should feel exaggerated, colorful, and arcade-forward rather than realistic. The board should read immediately as a competitive strategy arena, with dark foundational materials and bright player-color accents. Pieces should appear chunkier and more stylized than real Othello discs so ownership remains obvious from the fixed camera distance.

The active player should always be visually reinforced through:

- a color-coded current-player banner
- player-color accents around the board or HUD
- a clear score display for all four colors
- a living cursor effect on the currently selected tile

### Camera

- Use a fixed angled top-down camera.
- Keep the board centered at all times.
- Favor readability over cinematic freedom.
- Allow mild scripted feedback such as pulse, hit reaction, or tiny shake during big captures, but not free camera control in the first version.

### Board and Piece Feedback

The currently selected tile should be easy to track with keyboard input. Legal placement squares should be visibly distinguished from illegal ones so users can learn the four-player rules without frustration. Invalid placement attempts should produce a small but unmistakable response, such as a cursor shake, reject flash, or muted buzzer-style feedback.

The act of placing a piece should feel immediate and impactful. The placed piece should land first, then the captured lines should resolve in a staged flip sequence that travels outward along each valid line. This animation sequence is the core visual reward of the game and should be prioritized over extra environmental effects.

## Input Model

### Keyboard Controls

The first version uses a single shared keyboard and a single board cursor:

- Move cursor with arrow keys or WASD
- Confirm placement with one key

The input scheme should be simple enough that four local players can understand it immediately. The cursor should move one cell at a time and remain clamped to the board edges rather than wrapping.

### Input Locking

Input should be temporarily locked while a move is resolving and while flip animations are playing. This prevents state corruption, accidental double placements, and visual desynchronization between rules and presentation.

## Game Flow

Each turn should resolve in this order:

1. Identify the current player.
2. Determine whether that player has at least one legal move.
3. If not, show a skip notice and advance to the next player.
4. If yes, allow cursor movement and placement.
5. On confirm, validate the selected square.
6. If invalid, reject with feedback and keep the turn active.
7. If valid, place the piece.
8. Resolve captured lines.
9. Play the flip animation sequence.
10. Update visible scores and board state.
11. Advance to the next available player or finish the game.

End-of-game resolution should clearly show the final counts and the winning color, or the tied colors if first place is shared.

## Technical Design

### Architecture

The first version should be split into four main layers:

1. Rules engine
2. Board presentation layer
3. Input controller
4. Animation coordinator

#### Rules Engine

The rules engine is the source of truth for:

- board state
- opening setup
- legal move detection
- captured line discovery
- turn order
- skipped turns
- end-of-game detection
- score calculation

This module should not know about meshes, materials, animation timing, or keyboard events. It should accept deterministic inputs and return deterministic outputs.

Suggested outputs include:

- current player
- legal moves for a player
- captured lines for a proposed move
- result of applying a move
- next player state
- game over state and scores

#### Board Presentation Layer

This layer maps board state into Three.js objects. It owns the board mesh layout, piece meshes, color materials, cursor visuals, legal-move indicators, HUD anchoring, and scene-level feedback hooks. It should be able to re-render from game state without re-deriving rules.

#### Input Controller

This layer translates keyboard events into cursor movement and placement requests. It should respect input locking during animation and only ask the rules layer or move coordinator whether an action is allowed.

#### Animation Coordinator

This layer sequences the move presentation:

- placement impact
- per-line or per-piece flip timing
- turn transition cues
- score refresh timing
- skip-turn feedback
- end-game reveal timing

Its responsibility is to keep visuals synchronized with the logical move result without putting animation concerns into the rules engine.

## Rendering and Scene Priorities

The board should remain the focal point of the scene. Background elements, if any, should support mood without competing with gameplay readability. Lighting should create separation between the board surface, pieces, and cursor while preserving color identity for all four players.

The most important rendering priorities are:

- strong color distinction across all four factions
- clear tile readability from the fixed camera
- visible legal move markers
- satisfying flip motion that reads directionally
- modest scene effects that do not obscure piece ownership

## Animation Design

The main animation event is the capture sequence. After a successful placement:

- the newly placed piece lands with a clear impact
- captured lines are identified from the rules result
- affected pieces flip in a staged sequence
- each flipping piece transitions to the active player's color
- larger captures can trigger mild global feedback such as light pulse or small camera reaction

The sequence should feel fast enough to keep turns moving, but slow enough to celebrate larger captures. The implementation should support deterministic sequencing from the rules output rather than recalculating flips visually.

## UI and HUD

The first version should include only lightweight interface elements:

- current player indicator
- four-player score display
- skip-turn notification
- end-of-game result display

The HUD should reinforce player color ownership and stay readable without covering the board. The design should avoid building a large menu framework in the first pass.

## Edge Cases

The implementation must explicitly handle:

- players with no legal move skipping without breaking turn order
- multiple consecutive skipped turns
- full-board termination
- all-four-players-stuck termination
- invalid placement attempts with no state mutation
- legal moves that capture across mixed opponent colors
- simultaneous captures in multiple directions from a single move
- tied final scores

## Testing Strategy

Testing should prioritize the rules engine first.

Core tests should cover:

- correct 8x8 opening setup with four 2x2 color quadrants
- legal move detection in all eight directions
- move rejection for illegal cells
- capture resolution through mixed-color opponent lines
- multi-direction captures from one placement
- score updates after moves
- skip-turn behavior when a player has no legal moves
- end-game detection after four consecutive dead turns
- board-full end-game detection
- final score and winner calculation, including ties

Visual testing should focus on state sequencing and robustness:

- input lock during animation
- cursor remains aligned with board coordinates
- legal move indicators update after every move
- animation timing does not allow duplicate placement
- flipped piece visuals match the resolved logical result

## Implementation Notes

- Build the rules layer so it can later support AI or networking without rewrites.
- Keep rendering code reusable and scene-oriented rather than hard-coding one-off behavior into a single loop.
- Favor clarity of turn resolution over flashy effects when the two conflict.
- Preserve the fixed-camera, keyboard-first experience in the first version.

## Open Decisions For Planning

These are implementation details, not product blockers, and can be finalized during planning:

- exact keyboard binding for confirm and optional secondary inputs
- exact piece geometry style
- exact flip motion style, such as rotate, snap, or energy morph
- whether large captures trigger stronger camera feedback thresholds

## Success Criteria

The first version is successful if:

- four local players can complete a full game using one keyboard
- move legality and turn skipping work correctly for the four-player rules
- the board is readable from the fixed camera at all times
- legal moves and active player state are clearly communicated
- captured pieces flip in a satisfying staged animation
- the codebase is structured so rules, input, rendering, and animation remain separate concerns
