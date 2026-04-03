import { describe, expect, it } from "vitest";
import { analyzeMove, applyMove, getLegalMoves } from "./rules";
import type { BoardCell, BoardCoord, GameState } from "./types";

function createState(board: BoardCell[][], currentPlayer: GameState["currentPlayer"]): GameState {
  return {
    board,
    currentPlayer,
    consecutivePasses: 0,
    lastMove: null
  };
}

describe("rules", () => {
  it("finds legal moves for the current player", () => {
    const board: BoardCell[][] = [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, "black", "black", "white", "white", null, null],
      [null, null, "black", "black", "white", "white", null, null],
      [null, null, "red", "red", "blue", "blue", null, null],
      [null, null, "red", "red", "blue", "blue", null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null]
    ];

    const moves = getLegalMoves(createState(board, "black"));

    expect(moves).toHaveLength(9);
    expect(moves).toEqual([
      { row: 1, col: 5 },
      { row: 2, col: 6 },
      { row: 3, col: 6 },
      { row: 5, col: 1 },
      { row: 5, col: 6 },
      { row: 6, col: 2 },
      { row: 6, col: 3 },
      { row: 6, col: 5 },
      { row: 6, col: 6 }
    ]);
  });

  it("captures mixed-color lines and flips them to the active player", () => {
    const board: BoardCell[][] = [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ["black", "red", "white", "blue", null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null]
    ];

    const state = createState(board, "black");
    const move: BoardCoord = { row: 3, col: 4 };

    expect(analyzeMove(state, move)?.captured).toEqual([
      { row: 3, col: 1 },
      { row: 3, col: 2 },
      { row: 3, col: 3 }
    ]);

    const next = applyMove(state, move);

    expect(next.board[3][1]).toBe("black");
    expect(next.board[3][2]).toBe("black");
    expect(next.board[3][3]).toBe("black");
    expect(next.lastMove).toEqual(move);
    expect(next.consecutivePasses).toBe(0);
  });

  it("rejects illegal moves", () => {
    const board: BoardCell[][] = [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, "black", "black", "white", "white", null, null],
      [null, null, "black", "black", "white", "white", null, null],
      [null, null, "red", "red", "blue", "blue", null, null],
      [null, null, "red", "red", "blue", "blue", null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null]
    ];

    expect(() => applyMove(createState(board, "black"), { row: 3, col: 3 })).toThrow(
      "Illegal move at 3,3"
    );
  });
});
