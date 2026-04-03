import { Group, Mesh, MeshStandardMaterial } from "three";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { BoardCell, GameState } from "../core/types";
import { createBoardView } from "./boardView";

function createState(board: BoardCell[][]): GameState {
  return {
    board,
    currentPlayer: "black",
    consecutivePasses: 0,
    lastMove: null
  };
}

describe("createBoardView", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("maps board state to piece visibility and material colors", () => {
    const board = Array.from({ length: 8 }, () => Array<BoardCell>(8).fill(null));
    board[0][0] = "black";
    board[0][1] = "white";
    board[0][2] = "red";
    board[0][3] = "blue";

    const view = createBoardView();
    view.renderState(createState(board));

    const blackPiece = view.group.getObjectByName("piece-0-0") as Mesh;
    const whitePiece = view.group.getObjectByName("piece-0-1") as Mesh;
    const redPiece = view.group.getObjectByName("piece-0-2") as Mesh;
    const bluePiece = view.group.getObjectByName("piece-0-3") as Mesh;
    const emptyPiece = view.group.getObjectByName("piece-7-7") as Mesh;

    expect(blackPiece.visible).toBe(true);
    expect(whitePiece.visible).toBe(true);
    expect(redPiece.visible).toBe(true);
    expect(bluePiece.visible).toBe(true);
    expect(emptyPiece.visible).toBe(false);

    expect((blackPiece.material as MeshStandardMaterial).color.getHexString()).toBe("1f2430");
    expect((whitePiece.material as MeshStandardMaterial).color.getHexString()).toBe("f6f7fb");
    expect((redPiece.material as MeshStandardMaterial).color.getHexString()).toBe("f04b4b");
    expect((bluePiece.material as MeshStandardMaterial).color.getHexString()).toBe("4f7cff");
  });

  it("renders and clears legal move markers", () => {
    const view = createBoardView();
    const markers = view.group.children.find(
      (child): child is Group => child instanceof Group && child !== view.group
    ) as Group;

    view.updateLegalMoves([
      { row: 2, col: 3 },
      { row: 4, col: 5 }
    ]);

    expect(markers.children).toHaveLength(2);

    view.updateLegalMoves([]);

    expect(markers.children).toHaveLength(0);
  });

  it("restores the cursor pulse and invokes the restore callback", () => {
    vi.useFakeTimers();

    const view = createBoardView();
    const cursor = view.group.children.find(
      (child) => child instanceof Mesh && child.geometry.type === "RingGeometry"
    ) as Mesh;
    const material = cursor.material as MeshStandardMaterial;
    const onRestore = vi.fn();

    view.pulseInvalidMove(onRestore);

    expect(material.color.getHexString()).toBe("ff6b87");
    expect(material.emissive.getHexString()).toBe("ff3355");

    vi.advanceTimersByTime(120);

    expect(material.color.getHexString()).toBe("fff27a");
    expect(material.emissive.getHexString()).toBe("ffcc33");
    expect(onRestore).toHaveBeenCalledTimes(1);
  });
});
