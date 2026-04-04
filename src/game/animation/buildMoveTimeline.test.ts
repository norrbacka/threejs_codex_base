import { describe, expect, it } from "vitest";
import { buildMoveTimeline } from "./buildMoveTimeline";

describe("buildMoveTimeline", () => {
  it("places first, then flips captured tiles in sequence order", () => {
    const timeline = buildMoveTimeline({
      move: { row: 3, col: 4 },
      captured: [
        { row: 3, col: 3 },
        { row: 3, col: 2 },
        { row: 3, col: 1 }
      ]
    });

    expect(timeline[0]).toMatchObject({ kind: "place", at: 0 });
    expect(timeline[1]).toMatchObject({ kind: "flip", at: 90, coord: { row: 3, col: 3 } });
    expect(timeline[3]).toMatchObject({ kind: "flip", at: 270, coord: { row: 3, col: 1 } });
  });
});
