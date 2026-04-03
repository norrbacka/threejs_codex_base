import { beforeEach, describe, expect, it, vi } from "vitest";
import { Group, PerspectiveCamera, Scene } from "three";
import { createUltrathelloApp } from "./createUltrathelloApp";

const mocks = vi.hoisted(() => ({
  renderState: vi.fn(),
  updateCursor: vi.fn(),
  updateLegalMoves: vi.fn(),
  pulseInvalidMove: vi.fn(),
  disposeBoardView: vi.fn(),
  renderFrame: vi.fn(),
  disposeRenderer: vi.fn(),
  createInitialState: vi.fn(),
  sceneAdd: vi.fn(),
  attachKeyboardController: vi.fn(),
  analyzeMove: vi.fn(),
  applyMove: vi.fn(),
  getLegalMoves: vi.fn(),
  advanceToNextTurn: vi.fn()
}));

vi.mock("../core/createInitialState", () => ({
  createInitialState: mocks.createInitialState
}));

vi.mock("../input/keyboardController", () => ({
  attachKeyboardController: mocks.attachKeyboardController
}));

vi.mock("../core/rules", () => ({
  analyzeMove: mocks.analyzeMove,
  applyMove: mocks.applyMove,
  getLegalMoves: mocks.getLegalMoves
}));

vi.mock("../core/session", () => ({
  advanceToNextTurn: mocks.advanceToNextTurn
}));

vi.mock("../view/boardView", () => ({
  createBoardView: vi.fn(() => ({
    group: new Group(),
    renderState: mocks.renderState,
    updateCursor: mocks.updateCursor,
    updateLegalMoves: mocks.updateLegalMoves,
    pulseInvalidMove: mocks.pulseInvalidMove,
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
    mocks.updateCursor.mockReset();
    mocks.updateLegalMoves.mockReset();
    mocks.pulseInvalidMove.mockReset();
    mocks.disposeBoardView.mockReset();
    mocks.renderFrame.mockReset();
    mocks.disposeRenderer.mockReset();
    mocks.sceneAdd.mockReset();
    mocks.createInitialState.mockReset();
    mocks.attachKeyboardController.mockReset();
    mocks.analyzeMove.mockReset();
    mocks.applyMove.mockReset();
    mocks.getLegalMoves.mockReset();
    mocks.advanceToNextTurn.mockReset();

    mocks.createInitialState.mockReturnValue({
      board: Array.from({ length: 8 }, () => Array(8).fill(null)),
      currentPlayer: "black",
      consecutivePasses: 0,
      lastMove: null
    });
    mocks.attachKeyboardController.mockReturnValue(vi.fn());
    mocks.getLegalMoves.mockReturnValue([]);
    mocks.pulseInvalidMove.mockImplementation((onRestore?: () => void) => {
      onRestore?.();
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

  it("renders both the invalid flash and its restoration on rejected placement", () => {
    const host = document.createElement("div");
    let keyboardHandlers:
      | {
          getCursor: () => { row: number; col: number };
          onCursorChange: (next: { row: number; col: number }) => void;
          onConfirm: () => void;
        }
      | undefined;

    mocks.attachKeyboardController.mockImplementation((_, handlers) => {
      keyboardHandlers = handlers;
      return vi.fn();
    });
    mocks.analyzeMove.mockReturnValue(null);

    createUltrathelloApp(host);
    keyboardHandlers?.onConfirm();

    expect(mocks.pulseInvalidMove).toHaveBeenCalledTimes(1);
    expect(mocks.renderFrame).toHaveBeenCalledTimes(3);
  });
});
