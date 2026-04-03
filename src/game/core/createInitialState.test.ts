import { describe, expect, it } from "vitest";
import { BOARD_SIZE, TURN_ORDER } from "./constants";
import { createInitialState } from "./createInitialState";

describe("createInitialState", () => {
  it("creates an 8x8 board with the 4x4 quadrant opening", () => {
    const state = createInitialState();

    expect(BOARD_SIZE).toBe(8);
    expect(state.board).toHaveLength(BOARD_SIZE);
    expect(state.board[0]).toHaveLength(BOARD_SIZE);
    expect(state.currentPlayer).toBe("black");
    expect(TURN_ORDER).toEqual(["black", "white", "red", "blue"]);

    expect(state.board[2][2]).toBe("black");
    expect(state.board[2][5]).toBe("white");
    expect(state.board[5][2]).toBe("red");
    expect(state.board[5][5]).toBe("blue");
  });
});
