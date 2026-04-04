import { buildMoveTimeline } from "../animation/buildMoveTimeline";
import { playTimeline } from "../animation/moveAnimator";
import { TURN_ORDER } from "../core/constants";
import { createInitialState } from "../core/createInitialState";
import { advanceToNextTurn, getGameResult } from "../core/session";
import { analyzeMove, applyMove, getLegalMoves } from "../core/rules";
import type { BoardCell, GameState, PlayerColor } from "../core/types";
import { attachKeyboardController } from "../input/keyboardController";
import { createBoardView } from "../view/boardView";
import { createSceneRenderer } from "../view/createSceneRenderer";
import { deriveHudState, type HudTurnNotice } from "../ui/deriveHudState";
import { createHudView } from "../ui/hudView";

function nextPlayer(color: PlayerColor): PlayerColor {
  const index = TURN_ORDER.indexOf(color);
  return TURN_ORDER[(index + 1) % TURN_ORDER.length];
}

function collectSkippedPlayers(state: GameState, nextActivePlayer: PlayerColor) {
  const skipped: PlayerColor[] = [];
  let candidate = nextPlayer(state.currentPlayer);

  while (candidate !== nextActivePlayer) {
    const candidateState = { ...state, currentPlayer: candidate };

    if (getLegalMoves(candidateState).length > 0) {
      break;
    }

    skipped.push(candidate);
    candidate = nextPlayer(candidate);
  }

  return skipped;
}

export function createUltrathelloApp(host: HTMLElement, hudHost = document.createElement("div")) {
  let state = createInitialState();
  let cursor = { row: 2, col: 6 };
  let inputLocked = false;
  let displayBoard: BoardCell[][] | undefined;
  let turnNotice: HudTurnNotice | undefined;
  let disposed = false;
  let animationId = 0;
  const renderer = createSceneRenderer(host);
  const boardView = createBoardView();
  const hudView = createHudView(hudHost);
  renderer.scene.add(boardView.group);

  function render() {
    if (disposed) return;

    boardView.renderState(state, displayBoard);
    boardView.updateCursor?.(cursor);
    boardView.updateLegalMoves?.(inputLocked ? [] : getLegalMoves(state));
    hudView.render(deriveHudState(state, turnNotice));
    renderer.renderer.render(renderer.scene, renderer.camera);
  }

  function renderFrame() {
    if (disposed) return;

    renderer.renderer.render(renderer.scene, renderer.camera);
  }

  function isGameOver() {
    return getGameResult(state) !== null;
  }

  const detachKeyboard = attachKeyboardController(host, {
    getCursor: () => cursor,
    onCursorChange: (next) => {
      if (inputLocked || isGameOver()) return;

      cursor = next;
      render();
    },
    onConfirm: async () => {
      if (inputLocked || isGameOver()) return;

      const analysis = analyzeMove(state, cursor);
      if (!analysis) {
        boardView.pulseInvalidMove?.(() => {
          renderFrame();
        });
        renderFrame();
        return;
      }

      const player = state.currentPlayer;
      const stagedBoard = state.board.map((row) => [...row]);
      stagedBoard[cursor.row][cursor.col] = player;
      const currentAnimationId = ++animationId;
      const isAnimationActive = () => !disposed && currentAnimationId === animationId;
      inputLocked = true;
      state = applyMove(state, cursor);
      displayBoard = stagedBoard;
      render();

      await playTimeline(buildMoveTimeline(analysis), (step) => {
        if (!isAnimationActive()) return;

        if (step.kind === "place") {
          boardView.pulsePlacedPiece?.(cursor, () => {
            renderFrame();
          });
        }

        if (step.kind === "flip") {
          displayBoard = displayBoard?.map((row) => [...row]);
          if (displayBoard) {
            displayBoard[step.coord.row][step.coord.col] = state.board[step.coord.row][step.coord.col];
            boardView.renderState(state, displayBoard);
          }

          boardView.flashFlip?.(step.coord, () => {
            renderFrame();
          });
        }

        renderFrame();
      }, () => !isAnimationActive());

      if (!isAnimationActive()) {
        return;
      }

      displayBoard = undefined;
      const nextState = advanceToNextTurn(state);
      const skippedPlayers = collectSkippedPlayers(state, nextState.currentPlayer);
      turnNotice = skippedPlayers.length > 0 ? { skippedPlayers } : undefined;
      state = nextState;
      inputLocked = false;
      render();
    }
  });

  render();

  function dispose() {
    disposed = true;
    animationId += 1;
    inputLocked = false;
    displayBoard = undefined;
    turnNotice = undefined;
    detachKeyboard();
    hudView.dispose();
    boardView.dispose();
    renderer.dispose();
  }

  return { dispose };
}
