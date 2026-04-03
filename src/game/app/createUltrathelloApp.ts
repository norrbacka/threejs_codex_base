import { createInitialState } from "../core/createInitialState";
import { advanceToNextTurn } from "../core/session";
import { analyzeMove, applyMove, getLegalMoves } from "../core/rules";
import { attachKeyboardController } from "../input/keyboardController";
import { createBoardView } from "../view/boardView";
import { createSceneRenderer } from "../view/createSceneRenderer";

export function createUltrathelloApp(host: HTMLElement) {
  let state = createInitialState();
  let cursor = { row: 2, col: 6 };
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
      cursor = next;
      render();
    },
    onConfirm: () => {
      if (!analyzeMove(state, cursor)) {
        boardView.pulseInvalidMove?.(() => {
          renderer.renderer.render(renderer.scene, renderer.camera);
        });
        renderer.renderer.render(renderer.scene, renderer.camera);
        return;
      }

      state = advanceToNextTurn(applyMove(state, cursor));
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
