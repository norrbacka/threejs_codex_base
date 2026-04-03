import { BOARD_SIZE, TURN_ORDER } from "./constants";
import type { BoardCell, GameState } from "./types";

export function createInitialBoard(): BoardCell[][] {
  const board = Array.from({ length: BOARD_SIZE }, () =>
    Array<BoardCell>(BOARD_SIZE).fill(null)
  );

  for (let row = 2; row <= 3; row += 1) {
    for (let col = 2; col <= 3; col += 1) board[row][col] = "black";
    for (let col = 4; col <= 5; col += 1) board[row][col] = "white";
  }

  for (let row = 4; row <= 5; row += 1) {
    for (let col = 2; col <= 3; col += 1) board[row][col] = "red";
    for (let col = 4; col <= 5; col += 1) board[row][col] = "blue";
  }

  return board;
}

export function createInitialState(): GameState {
  return {
    board: createInitialBoard(),
    currentPlayer: TURN_ORDER[0],
    consecutivePasses: 0,
    lastMove: null
  };
}
