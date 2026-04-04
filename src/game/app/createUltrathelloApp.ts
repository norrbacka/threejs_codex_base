import { buildMoveTimeline } from "../animation/buildMoveTimeline";
import { playTimeline } from "../animation/moveAnimator";
import { createInitialState } from "../core/createInitialState";
import { advanceToNextTurn } from "../core/session";
import { analyzeMove, applyMove, getLegalMoves } from "../core/rules";
import { attachKeyboardController } from "../input/keyboardController";
import { createBoardView } from "../view/boardView";
import { createSceneRenderer } from "../view/createSceneRenderer";

export function createUltrathelloApp(host: HTMLElement) {
  let state = createInitialState();
  let cursor = { row: 2, col: 6 };
  let inputLocked = false;
  const renderer = createSceneRenderer(host);
  const boardView = createBoardView();
  renderer.scene.add(boardView.group);

  function render() {
    boardView.renderState(state);
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

      inputLocked = true;
      state = applyMove(state, cursor);
      render();

      await playTimeline(buildMoveTimeline(analysis), (step) => {
        if (step.kind === "place") {
          boardView.pulsePlacedPiece?.(cursor);
        }

        if (step.kind === "flip") {
          boardView.flashFlip?.(step.coord);
        }

        renderer.renderer.render(renderer.scene, renderer.camera);
      });

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
