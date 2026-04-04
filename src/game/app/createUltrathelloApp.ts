import { buildMoveTimeline } from "../animation/buildMoveTimeline";
import { playTimeline } from "../animation/moveAnimator";
import { createInitialState } from "../core/createInitialState";
import { advanceToNextTurn } from "../core/session";
import { analyzeMove, applyMove, getLegalMoves } from "../core/rules";
import type { BoardCell } from "../core/types";
import { attachKeyboardController } from "../input/keyboardController";
import { createBoardView } from "../view/boardView";
import { createSceneRenderer } from "../view/createSceneRenderer";

export function createUltrathelloApp(host: HTMLElement) {
  let state = createInitialState();
  let cursor = { row: 2, col: 6 };
  let inputLocked = false;
  let displayBoard: BoardCell[][] | undefined;
  const renderer = createSceneRenderer(host);
  const boardView = createBoardView();
  renderer.scene.add(boardView.group);

  function render() {
    boardView.renderState(state, displayBoard);
    boardView.updateCursor?.(cursor);
    boardView.updateLegalMoves?.(getLegalMoves(state));
    renderer.renderer.render(renderer.scene, renderer.camera);
  }

  const detachKeyboard = attachKeyboardController(host, {
    getCursor: () => cursor,
    onCursorChange: (next) => {
      if (inputLocked) return;

      cursor = next;
      render();
    },
    onConfirm: async () => {
      if (inputLocked) return;

      const analysis = analyzeMove(state, cursor);
      if (!analysis) {
        boardView.pulseInvalidMove?.(() => {
          renderer.renderer.render(renderer.scene, renderer.camera);
        });
        renderer.renderer.render(renderer.scene, renderer.camera);
        return;
      }

      const player = state.currentPlayer;
      const stagedBoard = state.board.map((row) => [...row]);
      stagedBoard[cursor.row][cursor.col] = player;
      inputLocked = true;
      state = applyMove(state, cursor);
      displayBoard = stagedBoard;
      render();

      await playTimeline(buildMoveTimeline(analysis), (step) => {
        if (step.kind === "place") {
          boardView.pulsePlacedPiece?.(cursor, () => {
            renderer.renderer.render(renderer.scene, renderer.camera);
          });
        }

        if (step.kind === "flip") {
          displayBoard = displayBoard?.map((row) => [...row]);
          if (displayBoard) {
            displayBoard[step.coord.row][step.coord.col] = state.board[step.coord.row][step.coord.col];
            boardView.renderState(state, displayBoard);
          }

          boardView.flashFlip?.(step.coord, () => {
            renderer.renderer.render(renderer.scene, renderer.camera);
          });
        }

        renderer.renderer.render(renderer.scene, renderer.camera);
      });

      displayBoard = undefined;
      state = advanceToNextTurn(state);
      inputLocked = false;
      render();
    }
  });

  render();

  function dispose() {
    detachKeyboard();
    boardView.dispose();
    renderer.dispose();
  }

  return { dispose };
}
