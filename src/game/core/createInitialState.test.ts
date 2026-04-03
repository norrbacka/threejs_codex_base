import { describe, expect, it } from "vitest";
import { BOARD_SIZE, TURN_ORDER } from "./constants";
import { createInitialState } from "./createInitialState";

describe("createInitialState", () => {
  it("creates an 8x8 board with the 4x4 quadrant opening", () => {
    const state = createInitialState();
    const expectedBoard = [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, "black", "black", "white", "white", null, null],
      [null, null, "black", "black", "white", "white", null, null],
      [null, null, "red", "red", "blue", "blue", null, null],
      [null, null, "red", "red", "blue", "blue", null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null]
    ];

    expect(BOARD_SIZE).toBe(8);
    expect(state.board).toHaveLength(BOARD_SIZE);
    expect(state.board[0]).toHaveLength(BOARD_SIZE);
    expect(state.currentPlayer).toBe("black");
    expect(state.consecutivePasses).toBe(0);
    expect(state.lastMove).toBeNull();
    expect(TURN_ORDER).toEqual(["black", "white", "red", "blue"]);
    expect(state.board).toEqual(expectedBoard);
  });
});
