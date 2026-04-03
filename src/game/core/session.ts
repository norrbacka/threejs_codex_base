import { TURN_ORDER } from "./constants";
import { getLegalMoves } from "./rules";
import { PLAYER_COLORS } from "./types";
import type { BoardCell, GameState, PlayerColor } from "./types";

export type Scoreboard = Record<PlayerColor, number>;

export type GameResult = {
  winners: PlayerColor[];
  scores: Scoreboard;
};

function createEmptyScoreboard(): Scoreboard {
  return PLAYER_COLORS.reduce<Scoreboard>((scores, player) => {
    scores[player] = 0;
    return scores;
  }, {} as Scoreboard);
}

export function buildScoreboard(board: BoardCell[][]): Scoreboard {
  return board.flat().reduce<Scoreboard>((scores, cell) => {
    if (cell) scores[cell] += 1;
    return scores;
  }, createEmptyScoreboard());
}

function nextPlayer(current: PlayerColor): PlayerColor {
  const index = TURN_ORDER.indexOf(current);
  return TURN_ORDER[(index + 1) % TURN_ORDER.length];
}

function boardIsFull(board: BoardCell[][]): boolean {
  return board.every((row) => row.every((cell) => cell !== null));
}

export function advanceToNextTurn(state: GameState): GameState {
  const passLimit = TURN_ORDER.length;
  let currentPlayer = nextPlayer(state.currentPlayer);
  let consecutivePasses = state.consecutivePasses;

  for (let checked = 0; checked < passLimit; checked += 1) {
    const candidate = { ...state, currentPlayer };

    if (getLegalMoves(candidate).length > 0) {
      return { ...state, currentPlayer, consecutivePasses };
    }

    consecutivePasses += 1;
    currentPlayer = nextPlayer(currentPlayer);
  }

  return { ...state, currentPlayer, consecutivePasses: passLimit };
}

export function getGameResult(state: GameState): GameResult | null {
  const passLimit = TURN_ORDER.length;

  if (!boardIsFull(state.board) && state.consecutivePasses < passLimit) return null;

  const scores = buildScoreboard(state.board);
  const top = Math.max(...Object.values(scores));
  const winners = TURN_ORDER.filter((player) => scores[player] === top);

  return { winners, scores };
}
