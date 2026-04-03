import { createInitialState } from "../core/createInitialState";
import { createBoardView } from "../view/boardView";
import { createSceneRenderer } from "../view/createSceneRenderer";

export function createUltrathelloApp(host: HTMLElement) {
  const state = createInitialState();
  const renderer = createSceneRenderer(host);
  const boardView = createBoardView();
  renderer.scene.add(boardView.group);
  boardView.renderState(state);
  renderer.renderer.render(renderer.scene, renderer.camera);

  function dispose() {
    boardView.dispose();
    renderer.dispose();
  }

  return { dispose };
}
