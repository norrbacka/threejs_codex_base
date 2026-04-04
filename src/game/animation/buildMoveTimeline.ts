import type { MoveAnalysis } from "../core/types";

export type AnimationStep =
  | { kind: "place"; at: number }
  | { kind: "flip"; at: number; coord: { row: number; col: number } };

export function buildMoveTimeline(analysis: MoveAnalysis): AnimationStep[] {
  return [
    { kind: "place", at: 0 },
    ...analysis.captured.map((coord, index) => ({
      kind: "flip" as const,
      at: 90 * (index + 1),
      coord
    }))
  ];
}
