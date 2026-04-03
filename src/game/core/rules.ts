import { BOARD_SIZE } from "./constants";
import type { BoardCoord, GameState, MoveAnalysis, PlayerColor } from "./types";

const DIRECTIONS = [
  { row: -1, col: -1 },
  { row: -1, col: 0 },
  { row: -1, col: 1 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
  { row: 1, col: -1 },
  { row: 1, col: 0 },
  { row: 1, col: 1 }
];

function isOnBoard({ row, col }: BoardCoord): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

function collectDirection(
  state: GameState,
  move: BoardCoord,
  player: PlayerColor,
  delta: BoardCoord
): BoardCoord[] {
  const captured: BoardCoord[] = [];
  let row = move.row + delta.row;
  let col = move.col + delta.col;

  while (isOnBoard({ row, col })) {
    const cell = state.board[row][col];

    if (cell === null) return [];
    if (cell === player) return captured.length > 0 ? [...captured].reverse() : [];

    captured.push({ row, col });
    row += delta.row;
    col += delta.col;
  }

  return [];
}

export function analyzeMove(state: GameState, move: BoardCoord): MoveAnalysis | null {
  if (!isOnBoard(move) || state.board[move.row][move.col] !== null) return null;

  const captured = DIRECTIONS.flatMap((direction) =>
    collectDirection(state, move, state.currentPlayer, direction)
  );

  if (captured.length === 0) return null;

  return { move, captured };
}

export function getLegalMoves(state: GameState): BoardCoord[] {
  const moves: BoardCoord[] = [];

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const move = { row, col };
      if (analyzeMove(state, move)) moves.push(move);
    }
  }

  return moves;
}

export function applyMove(state: GameState, move: BoardCoord): GameState {
  const analysis = analyzeMove(state, move);

  if (!analysis) {
    throw new Error(`Illegal move at ${move.row},${move.col}`);
  }

  const board = state.board.map((cells) => [...cells]);
  board[move.row][move.col] = state.currentPlayer;

  for (const coord of analysis.captured) {
    board[coord.row][coord.col] = state.currentPlayer;
  }

  return {
    ...state,
    board,
    lastMove: move,
    consecutivePasses: 0
  };
}
