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

  it("accumulates existing passes while skipping dead turns", () => {
    const board: BoardCell[][] = Array.from({ length: 8 }, () => Array<BoardCell>(8).fill("black"));
    board[7][7] = null;
    board[7][6] = "red";

    const next = advanceToNextTurn(createState(board, "white", 1));

    expect(next.currentPlayer).toBe("black");
    expect(next.consecutivePasses).toBe(3);
  });

  it("returns scores and tied winners when the board is full", () => {
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

    const result = getGameResult(createState(board, "black"));
    const scoreboard = buildScoreboard(board);

    expect(result).not.toBeNull();
    expect(result?.scores).toEqual(scoreboard);
    expect(result?.winners).toEqual(["black", "white", "red", "blue"]);
    expect(scoreboard.black).toBe(16);
  });
});
