export const PLAYER_COLORS = ["black", "white", "red", "blue"] as const;

export type PlayerColor = (typeof PLAYER_COLORS)[number];
export type BoardCell = PlayerColor | null;

export type BoardCoord = {
  row: number;
  col: number;
};

export type GameState = {
  board: BoardCell[][];
  currentPlayer: PlayerColor;
  consecutivePasses: number;
  lastMove: BoardCoord | null;
};

export type MoveAnalysis = {
  move: BoardCoord;
  captured: BoardCoord[];
};
