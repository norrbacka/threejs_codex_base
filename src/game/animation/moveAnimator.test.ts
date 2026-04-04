import { afterEach, describe, expect, it, vi } from "vitest";
import { playTimeline } from "./moveAnimator";

describe("playTimeline", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("runs steps at their scheduled offsets", async () => {
    vi.useFakeTimers();

    let now = 0;
    vi.spyOn(performance, "now").mockImplementation(() => now);

    const seen: { kind: string; at: number }[] = [];
    const promise = playTimeline(
      [
        { kind: "place", at: 0 },
        { kind: "flip", at: 90, coord: { row: 3, col: 3 } },
        { kind: "flip", at: 180, coord: { row: 3, col: 2 } }
      ],
      (step) => {
        seen.push({ kind: step.kind, at: now });
      }
    );

    await Promise.resolve();
    expect(seen).toEqual([{ kind: "place", at: 0 }]);

    now = 89;
    await vi.advanceTimersByTimeAsync(89);
    expect(seen).toEqual([{ kind: "place", at: 0 }]);

    now = 90;
    await vi.advanceTimersByTimeAsync(1);
    expect(seen).toEqual([
      { kind: "place", at: 0 },
      { kind: "flip", at: 90 }
    ]);

    now = 180;
    await vi.advanceTimersByTimeAsync(90);
    await promise;

    expect(seen).toEqual([
      { kind: "place", at: 0 },
      { kind: "flip", at: 90 },
      { kind: "flip", at: 180 }
    ]);
  });

  it("stops before future steps when cancelled", async () => {
    vi.useFakeTimers();

    let now = 0;
    let cancelled = false;
    vi.spyOn(performance, "now").mockImplementation(() => now);

    const seen: string[] = [];
    const promise = playTimeline(
      [
        { kind: "place", at: 0 },
        { kind: "flip", at: 90, coord: { row: 3, col: 3 } }
      ],
      (step) => {
        seen.push(step.kind);
      },
      () => cancelled
    );

    await Promise.resolve();
    expect(seen).toEqual(["place"]);

    cancelled = true;
    now = 90;
    await vi.advanceTimersByTimeAsync(90);
    await promise;

    expect(seen).toEqual(["place"]);
  });
});
