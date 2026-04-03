import { BOARD_SIZE } from "../core/constants";

export type TileLayout = {
  row: number;
  col: number;
  x: number;
  z: number;
};

export function buildBoardLayout() {
  const origin = (BOARD_SIZE - 1) / 2;
  const tiles: TileLayout[] = [];

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      tiles.push({
        row,
        col,
        x: col - origin,
        z: row - origin
      });
    }
  }

  return { tiles };
}
