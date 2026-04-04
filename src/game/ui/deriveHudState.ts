import { PLAYER_COLORS, type GameState, type PlayerColor } from "../core/types";
import { buildScoreboard, getGameResult } from "../core/session";

export type HudScoreEntry = {
  color: PlayerColor;
  label: string;
  score: number;
};

export type HudTurnNotice = {
  skippedPlayers?: PlayerColor[];
};

export type HudState = {
  currentPlayerLabel: string;
  scoreEntries: HudScoreEntry[];
  noticeText: string | null;
  resultText: string | null;
};

function formatPlayerName(color: PlayerColor) {
  return color.charAt(0).toUpperCase() + color.slice(1);
}

function formatPlayerList(colors: PlayerColor[]) {
  if (colors.length === 0) return "";
  if (colors.length === 1) return formatPlayerName(colors[0]);
  if (colors.length === 2) {
    return `${formatPlayerName(colors[0])} and ${formatPlayerName(colors[1])}`;
  }

  const head = colors.slice(0, -1).map(formatPlayerName).join(", ");
  return `${head}, and ${formatPlayerName(colors[colors.length - 1])}`;
}

function formatPieceCount(score: number) {
  return score === 1 ? "1 piece" : `${score} pieces`;
}

function buildScoreEntries(scores: Record<PlayerColor, number>): HudScoreEntry[] {
  return PLAYER_COLORS.map((color) => ({
    color,
    label: formatPlayerName(color),
    score: scores[color]
  }));
}

export function deriveHudState(state: GameState, notice: HudTurnNotice = {}): HudState {
  const result = getGameResult(state);
  const scores = result?.scores ?? buildScoreboard(state.board);
  const scoreEntries = buildScoreEntries(scores);

  if (result) {
    const winnerNames = formatPlayerList(result.winners);
    const winnerScore = result.scores[result.winners[0]];

    return {
      currentPlayerLabel: "Game over",
      scoreEntries,
      noticeText: null,
      resultText:
        result.winners.length === 1
          ? `${winnerNames} wins with ${formatPieceCount(winnerScore)}.`
          : `Tie between ${winnerNames} with ${formatPieceCount(winnerScore)} each.`
    };
  }

  const skippedPlayers = notice.skippedPlayers ?? [];
  const skippedText =
    skippedPlayers.length > 0 ? `Skipped ${formatPlayerList(skippedPlayers)}. ` : "";

  return {
    currentPlayerLabel: `Current player: ${formatPlayerName(state.currentPlayer)}`,
    scoreEntries,
    noticeText: `${skippedText}${formatPlayerName(state.currentPlayer)} to move.`,
    resultText: null
  };
}
