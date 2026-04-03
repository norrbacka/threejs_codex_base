import { describe, expect, it } from "vitest";
import { moveCursor } from "./cursor";

describe("moveCursor", () => {
  it("clamps movement to the board edges", () => {
    expect(moveCursor({ row: 0, col: 0 }, "ArrowUp")).toEqual({ row: 0, col: 0 });
    expect(moveCursor({ row: 0, col: 0 }, "ArrowLeft")).toEqual({ row: 0, col: 0 });
    expect(moveCursor({ row: 7, col: 7 }, "ArrowDown")).toEqual({ row: 7, col: 7 });
    expect(moveCursor({ row: 7, col: 7 }, "ArrowRight")).toEqual({ row: 7, col: 7 });
    expect(moveCursor({ row: 3, col: 3 }, "KeyD")).toEqual({ row: 3, col: 4 });
  });
});
