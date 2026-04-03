import { beforeEach, describe, expect, it, vi } from "vitest";
import { Group, PerspectiveCamera, Scene } from "three";
import { createUltrathelloApp } from "./createUltrathelloApp";

const mocks = vi.hoisted(() => ({
  renderState: vi.fn(),
  disposeBoardView: vi.fn(),
  renderFrame: vi.fn(),
  disposeRenderer: vi.fn(),
  createInitialState: vi.fn(),
  sceneAdd: vi.fn()
}));

vi.mock("../core/createInitialState", () => ({
  createInitialState: mocks.createInitialState
}));

vi.mock("../view/boardView", () => ({
  createBoardView: vi.fn(() => ({
    group: new Group(),
    renderState: mocks.renderState,
    dispose: mocks.disposeBoardView
  }))
}));

vi.mock("../view/createSceneRenderer", () => ({
  createSceneRenderer: vi.fn(() => ({
    scene: { add: mocks.sceneAdd } as unknown as Scene,
    camera: new PerspectiveCamera(),
    renderer: { render: mocks.renderFrame } as unknown as { render: typeof mocks.renderFrame },
    dispose: mocks.disposeRenderer
  }))
}));

describe("createUltrathelloApp", () => {
  beforeEach(() => {
    mocks.renderState.mockReset();
    mocks.disposeBoardView.mockReset();
    mocks.renderFrame.mockReset();
    mocks.disposeRenderer.mockReset();
    mocks.sceneAdd.mockReset();
    mocks.createInitialState.mockReset();
    mocks.createInitialState.mockReturnValue({
      board: Array.from({ length: 8 }, () => Array(8).fill(null)),
      currentPlayer: "black",
      consecutivePasses: 0,
      lastMove: null
    });
  });

  it("renders the initial board and disposes owned resources", () => {
    const host = document.createElement("div");

    const app = createUltrathelloApp(host);

    expect(mocks.sceneAdd).toHaveBeenCalledTimes(1);
    expect(mocks.renderState).toHaveBeenCalledWith(mocks.createInitialState.mock.results[0]?.value);
    expect(mocks.renderFrame).toHaveBeenCalledTimes(1);

    app.dispose();

    expect(mocks.disposeBoardView).toHaveBeenCalledTimes(1);
    expect(mocks.disposeRenderer).toHaveBeenCalledTimes(1);
  });
});
