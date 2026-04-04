import { describe, expect, it } from "vitest";
import { deriveHudState } from "./deriveHudState";
import type { BoardCell, GameState } from "../core/types";

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

function createEmptyBoard(): BoardCell[][] {
  return Array.from({ length: 8 }, () => Array<BoardCell>(8).fill(null));
}

describe("deriveHudState", () => {
  it("derives the current player label and live scores", () => {
    const board = createEmptyBoard();
    board[0][0] = "black";
    board[0][1] = "black";
    board[0][2] = "white";
    board[0][3] = "red";
    board[0][4] = "blue";

    const hud = deriveHudState(createState(board, "black"));

    expect(hud.currentPlayerLabel).toBe("Current player: Black");
    expect(hud.scoreEntries).toEqual([
      { color: "black", label: "Black", score: 2 },
      { color: "white", label: "White", score: 1 },
      { color: "red", label: "Red", score: 1 },
      { color: "blue", label: "Blue", score: 1 }
    ]);
    expect(hud.noticeText).toBe("Black to move.");
    expect(hud.resultText).toBeNull();
  });

  it("includes skipped players in the turn notice after advancing", () => {
    const board = createEmptyBoard();
    board[0][0] = "black";
    board[0][1] = "white";
    board[0][2] = "red";
    board[0][3] = "blue";

    const hud = deriveHudState(createState(board, "blue"), {
      skippedPlayers: ["white", "red"]
    });

    expect(hud.noticeText).toBe("Skipped White and Red. Blue to move.");
    expect(hud.resultText).toBeNull();
  });

  it("shows a winner result when the game is over", () => {
    const board = createEmptyBoard();
    board[0][0] = "black";
    board[0][1] = "black";
    board[0][2] = "black";
    board[0][3] = "white";
    board[0][4] = "white";
    board[0][5] = "red";

    const hud = deriveHudState(createState(board, "white", 4));

    expect(hud.currentPlayerLabel).toBe("Game over");
    expect(hud.noticeText).toBeNull();
    expect(hud.resultText).toBe("Black wins with 3 pieces.");
  });

  it("shows a tie result when multiple players share the lead", () => {
    const board = createEmptyBoard();
    board[0][0] = "black";
    board[0][1] = "black";
    board[0][2] = "white";
    board[0][3] = "white";
    board[0][4] = "red";
    board[0][5] = "blue";

    const hud = deriveHudState(createState(board, "red", 4));

    expect(hud.currentPlayerLabel).toBe("Game over");
    expect(hud.noticeText).toBeNull();
    expect(hud.resultText).toBe("Tie between Black and White with 2 pieces each.");
  });
});
