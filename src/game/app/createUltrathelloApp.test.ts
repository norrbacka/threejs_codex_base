import { beforeEach, describe, expect, it, vi } from "vitest";
import { Group, PerspectiveCamera, Scene } from "three";
import { createUltrathelloApp } from "./createUltrathelloApp";

const mocks = vi.hoisted(() => ({
  renderState: vi.fn(),
  updateCursor: vi.fn(),
  updateLegalMoves: vi.fn(),
  pulseInvalidMove: vi.fn(),
  pulsePlacedPiece: vi.fn(),
  flashFlip: vi.fn(),
  disposeBoardView: vi.fn(),
  renderFrame: vi.fn(),
  disposeRenderer: vi.fn(),
  createInitialState: vi.fn(),
  sceneAdd: vi.fn(),
  attachKeyboardController: vi.fn(),
  analyzeMove: vi.fn(),
  applyMove: vi.fn(),
  getLegalMoves: vi.fn(),
  advanceToNextTurn: vi.fn(),
  buildMoveTimeline: vi.fn(),
  playTimeline: vi.fn()
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

vi.mock("../animation/buildMoveTimeline", () => ({
  buildMoveTimeline: mocks.buildMoveTimeline
}));

vi.mock("../animation/moveAnimator", () => ({
  playTimeline: mocks.playTimeline
}));

vi.mock("../view/boardView", () => ({
  createBoardView: vi.fn(() => ({
    group: new Group(),
    renderState: mocks.renderState,
    updateCursor: mocks.updateCursor,
    updateLegalMoves: mocks.updateLegalMoves,
    pulseInvalidMove: mocks.pulseInvalidMove,
    pulsePlacedPiece: mocks.pulsePlacedPiece,
    flashFlip: mocks.flashFlip,
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
    mocks.pulsePlacedPiece.mockReset();
    mocks.flashFlip.mockReset();
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
    mocks.buildMoveTimeline.mockReset();
    mocks.playTimeline.mockReset();

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
    mocks.buildMoveTimeline.mockReturnValue([]);
    mocks.playTimeline.mockResolvedValue(undefined);
  });

  it("renders the initial board and disposes owned resources", () => {
    const host = document.createElement("div");

    const app = createUltrathelloApp(host);

    expect(mocks.sceneAdd).toHaveBeenCalledTimes(1);
    expect(mocks.renderState).toHaveBeenCalledWith(
      mocks.createInitialState.mock.results[0]?.value,
      undefined
    );
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

  it("keeps captured pieces on their previous owner until the flip step runs", async () => {
    const host = document.createElement("div");
    const initialBoard = Array.from({ length: 8 }, () => Array(8).fill(null));
    initialBoard[3][3] = "white";
    const initialState = {
      board: initialBoard,
      currentPlayer: "black",
      consecutivePasses: 0,
      lastMove: null
    };
    const appliedBoard = initialBoard.map((row) => [...row]);
    appliedBoard[3][4] = "black";
    appliedBoard[3][3] = "black";
    const appliedState = {
      ...initialState,
      board: appliedBoard,
      lastMove: { row: 3, col: 4 }
    };

    let keyboardHandlers:
      | {
          getCursor: () => { row: number; col: number };
          onCursorChange: (next: { row: number; col: number }) => void;
          onConfirm: () => Promise<void>;
        }
      | undefined;
    let finishTimeline: (() => void) | undefined;

    mocks.createInitialState.mockReturnValue(initialState);
    mocks.attachKeyboardController.mockImplementation((_, handlers) => {
      keyboardHandlers = handlers;
      return vi.fn();
    });
    mocks.analyzeMove.mockReturnValue({
      move: { row: 3, col: 4 },
      captured: [{ row: 3, col: 3 }]
    });
    mocks.applyMove.mockReturnValue(appliedState);
    mocks.advanceToNextTurn.mockImplementation((state) => state);
    mocks.buildMoveTimeline.mockReturnValue([
      { kind: "place", at: 0 },
      { kind: "flip", at: 90, coord: { row: 3, col: 3 } }
    ]);
    mocks.playTimeline.mockImplementation(
      async (
        steps: { kind: "place" | "flip"; coord?: { row: number; col: number } }[],
        runStep: (step: { kind: "place" | "flip"; coord?: { row: number; col: number } }) => void
      ) =>
        new Promise<void>((resolve) => {
          runStep(steps[0]);
          finishTimeline = () => {
            runStep(steps[1]);
            resolve();
          };
        })
    );

    createUltrathelloApp(host);
    keyboardHandlers?.onCursorChange({ row: 3, col: 4 });

    const pendingConfirm = keyboardHandlers?.onConfirm();
    expect(pendingConfirm).toBeDefined();

    const stagedRender = mocks.renderState.mock.calls.find((call) => call[1] !== undefined);
    const stagedBoard = stagedRender?.[1] as string[][];
    expect(stagedRender?.[0]).toBe(appliedState);
    expect(stagedBoard[3][4]).toBe("black");
    expect(stagedBoard[3][3]).toBe("white");

    finishTimeline?.();
    await pendingConfirm;
  });

  it("keeps input locked while the animation is pending", async () => {
    const host = document.createElement("div");
    const initialState = {
      board: Array.from({ length: 8 }, () => Array(8).fill(null)),
      currentPlayer: "black",
      consecutivePasses: 0,
      lastMove: null
    };
    const appliedState = {
      ...initialState,
      board: initialState.board.map((row) => [...row]),
      lastMove: { row: 2, col: 6 }
    };
    let keyboardHandlers:
      | {
          getCursor: () => { row: number; col: number };
          onCursorChange: (next: { row: number; col: number }) => void;
          onConfirm: () => Promise<void>;
        }
      | undefined;
    let finishTimeline: (() => void) | undefined;

    mocks.createInitialState.mockReturnValue(initialState);
    mocks.attachKeyboardController.mockImplementation((_, handlers) => {
      keyboardHandlers = handlers;
      return vi.fn();
    });
    mocks.analyzeMove.mockReturnValue({
      move: { row: 2, col: 6 },
      captured: [{ row: 2, col: 5 }]
    });
    mocks.applyMove.mockReturnValue(appliedState);
    mocks.advanceToNextTurn.mockImplementation((state) => state);
    mocks.buildMoveTimeline.mockReturnValue([{ kind: "place", at: 0 }]);
    mocks.playTimeline.mockImplementation(
      async (_steps, runStep) =>
        new Promise<void>((resolve) => {
          runStep({ kind: "place", at: 0 });
          finishTimeline = () => resolve();
        })
    );

    createUltrathelloApp(host);

    const pendingConfirm = keyboardHandlers?.onConfirm();
    expect(pendingConfirm).toBeDefined();
    expect(mocks.updateLegalMoves).toHaveBeenLastCalledWith([]);

    const renderCallsBeforeLockedMove = mocks.renderState.mock.calls.length;
    keyboardHandlers?.onCursorChange({ row: 0, col: 0 });
    keyboardHandlers?.onConfirm();

    expect(mocks.renderState).toHaveBeenCalledTimes(renderCallsBeforeLockedMove);
    expect(mocks.playTimeline).toHaveBeenCalledTimes(1);

    finishTimeline?.();
    await pendingConfirm;
  });

  it("ignores in-flight animation callbacks after dispose", async () => {
    const host = document.createElement("div");
    const initialState = {
      board: Array.from({ length: 8 }, () => Array(8).fill(null)),
      currentPlayer: "black",
      consecutivePasses: 0,
      lastMove: null
    };
    const appliedBoard = initialState.board.map((row) => [...row]);
    appliedBoard[2][6] = "black";
    appliedBoard[2][5] = "black";
    const appliedState = {
      ...initialState,
      board: appliedBoard,
      lastMove: { row: 2, col: 6 }
    };
    let keyboardHandlers:
      | {
          getCursor: () => { row: number; col: number };
          onCursorChange: (next: { row: number; col: number }) => void;
          onConfirm: () => Promise<void>;
        }
      | undefined;
    let capturedRunStep:
      | ((step: { kind: "place" | "flip"; at: number; coord?: { row: number; col: number } }) => void)
      | undefined;
    let finishTimeline: (() => void) | undefined;

    mocks.createInitialState.mockReturnValue(initialState);
    mocks.attachKeyboardController.mockImplementation((_, handlers) => {
      keyboardHandlers = handlers;
      return vi.fn();
    });
    mocks.analyzeMove.mockReturnValue({
      move: { row: 2, col: 6 },
      captured: [{ row: 2, col: 5 }]
    });
    mocks.applyMove.mockReturnValue(appliedState);
    mocks.advanceToNextTurn.mockImplementation((state) => state);
    mocks.buildMoveTimeline.mockReturnValue([
      { kind: "place", at: 0 },
      { kind: "flip", at: 90, coord: { row: 2, col: 5 } }
    ]);
    mocks.playTimeline.mockImplementation(
      async (_steps, runStep) =>
        new Promise<void>((resolve) => {
          capturedRunStep = runStep;
          finishTimeline = resolve;
        })
    );

    const app = createUltrathelloApp(host);
    const pendingConfirm = keyboardHandlers?.onConfirm();
    expect(pendingConfirm).toBeDefined();

    app.dispose();
    const renderCountAtDispose = mocks.renderFrame.mock.calls.length;

    capturedRunStep?.({ kind: "place", at: 0 });
    capturedRunStep?.({ kind: "flip", at: 90, coord: { row: 2, col: 5 } });
    finishTimeline?.();
    await pendingConfirm;

    expect(mocks.renderFrame).toHaveBeenCalledTimes(renderCountAtDispose);
    expect(mocks.pulsePlacedPiece).not.toHaveBeenCalled();
    expect(mocks.flashFlip).not.toHaveBeenCalled();
  });
});
