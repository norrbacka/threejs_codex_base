import { TURN_ORDER } from "./constants";
import { getLegalMoves } from "./rules";
import type { BoardCell, GameState, PlayerColor } from "./types";

export type Scoreboard = Record<PlayerColor, number>;

export type GameResult = {
  winners: PlayerColor[];
  scores: Scoreboard;
};

export function buildScoreboard(board: BoardCell[][]): Scoreboard {
  return board.flat().reduce<Scoreboard>(
    (scores, cell) => {
      if (cell) scores[cell] += 1;
      return scores;
    },
    { black: 0, white: 0, red: 0, blue: 0 }
  );
}

function nextPlayer(current: PlayerColor): PlayerColor {
  const index = TURN_ORDER.indexOf(current);
  return TURN_ORDER[(index + 1) % TURN_ORDER.length];
}

function boardIsFull(board: BoardCell[][]): boolean {
  return board.every((row) => row.every((cell) => cell !== null));
}

export function advanceToNextTurn(state: GameState): GameState {
  let currentPlayer = nextPlayer(state.currentPlayer);
  let consecutivePasses = state.consecutivePasses;

  for (let checked = 0; checked < TURN_ORDER.length; checked += 1) {
    const candidate = { ...state, currentPlayer };

    if (getLegalMoves(candidate).length > 0) {
      return { ...state, currentPlayer, consecutivePasses };
    }

    consecutivePasses += 1;
    currentPlayer = nextPlayer(currentPlayer);
  }

  return { ...state, currentPlayer, consecutivePasses: 4 };
}

export function getGameResult(state: GameState): GameResult | null {
  if (!boardIsFull(state.board) && state.consecutivePasses < 4) return null;

  const scores = buildScoreboard(state.board);
  const top = Math.max(...Object.values(scores));
  const winners = TURN_ORDER.filter((player) => scores[player] === top);

  return { winners, scores };
}
