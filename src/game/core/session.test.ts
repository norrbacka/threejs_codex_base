import { describe, expect, it } from "vitest";
import { advanceToNextTurn, buildScoreboard, getGameResult } from "./session";
import type { BoardCell, GameState } from "./types";

function createState(
  board: BoardCell[][],
  currentPlayer: GameState["currentPlayer"],
  consecutivePasses = 0
): GameState {
  return {
    board,
    currentPlayer,
    consecutivePasses,
    lastMove: null
  };
}

describe("session", () => {
  it("skips players with no legal moves until it finds one", () => {
    const board: BoardCell[][] = Array.from({ length: 8 }, () => Array<BoardCell>(8).fill("black"));
    board[7][7] = null;
    board[7][6] = "red";

    const next = advanceToNextTurn(createState(board, "white"));

    expect(next.currentPlayer).toBe("black");
    expect(next.consecutivePasses).toBe(2);
  });

  it("reports tied winners when first place is shared", () => {
    const board: BoardCell[][] = [
      ["black", "black", "white", "white", "red", "red", "blue", "blue"],
      ["black", "black", "white", "white", "red", "red", "blue", "blue"],
      ["black", "black", "white", "white", "red", "red", "blue", "blue"],
      ["black", "black", "white", "white", "red", "red", "blue", "blue"],
      ["black", "black", "white", "white", "red", "red", "blue", "blue"],
      ["black", "black", "white", "white", "red", "red", "blue", "blue"],
      ["black", "black", "white", "white", "red", "red", "blue", "blue"],
      ["black", "black", "white", "white", "red", "red", "blue", "blue"]
    ];

    const result = getGameResult(createState(board, "black", 4));

    expect(buildScoreboard(board).black).toBe(16);
    expect(result?.winners).toEqual(["black", "white", "red", "blue"]);
  });
});
