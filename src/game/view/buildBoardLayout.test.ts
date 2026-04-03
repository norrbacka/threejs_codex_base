import { describe, expect, it } from "vitest";
import { buildBoardLayout } from "./buildBoardLayout";

describe("buildBoardLayout", () => {
  it("returns centered tile positions for an 8x8 board", () => {
    const layout = buildBoardLayout();

    expect(layout.tiles).toHaveLength(64);
    expect(layout.tiles[0]).toMatchObject({ row: 0, col: 0, x: -3.5, z: -3.5 });
    expect(layout.tiles.at(-1)).toMatchObject({ row: 7, col: 7, x: 3.5, z: 3.5 });
  });
});
