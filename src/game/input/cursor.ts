import { BOARD_SIZE } from "../core/constants";
import type { BoardCoord } from "../core/types";

const KEY_DELTAS: Record<string, BoardCoord> = {
  ArrowUp: { row: -1, col: 0 },
  ArrowDown: { row: 1, col: 0 },
  ArrowLeft: { row: 0, col: -1 },
  ArrowRight: { row: 0, col: 1 },
  KeyW: { row: -1, col: 0 },
  KeyS: { row: 1, col: 0 },
  KeyA: { row: 0, col: -1 },
  KeyD: { row: 0, col: 1 }
};

export function moveCursor(current: BoardCoord, code: string): BoardCoord {
  const delta = KEY_DELTAS[code];
  if (!delta) return current;

  return {
    row: Math.min(BOARD_SIZE - 1, Math.max(0, current.row + delta.row)),
    col: Math.min(BOARD_SIZE - 1, Math.max(0, current.col + delta.col))
  };
}
