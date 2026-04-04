import type { HudScoreEntry, HudState } from "./deriveHudState";

export type HudView = {
  render: (state: HudState) => void;
  dispose: () => void;
};

function createScoreEntry(entry: HudScoreEntry) {
  const item = document.createElement("div");
  item.className = "hud-score";
  item.dataset.color = entry.color;
  item.textContent = `${entry.label} ${entry.score}`;
  return item;
}

export function createHudView(root: HTMLElement): HudView {
  root.replaceChildren();

  const announcement = document.createElement("div");
  announcement.className = "hud-announcement";
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");

  const panel = document.createElement("section");
  panel.className = "hud-panel";

  const currentPlayer = document.createElement("div");
  currentPlayer.className = "hud-current-player";

  const notice = document.createElement("div");
  notice.className = "hud-notice";

  const scoreList = document.createElement("div");
  scoreList.className = "hud-scores";

  const result = document.createElement("div");
  result.className = "hud-result";

  panel.append(currentPlayer, notice, scoreList, result);
  root.append(announcement, panel);

  let lastScoreSignature: string | null = null;
  let lastAnnouncementText: string | null = null;

  function renderScores(entries: HudScoreEntry[]) {
    scoreList.replaceChildren(...entries.map(createScoreEntry));
  }

  function render(state: HudState) {
    const announcementText = state.resultText ?? state.noticeText ?? state.currentPlayerLabel;
    const scoreSignature = state.scoreEntries.map((entry) => `${entry.color}:${entry.score}`).join("|");

    panel.dataset.phase = state.resultText ? "game-over" : "turn";
    currentPlayer.textContent = state.currentPlayerLabel;
    notice.textContent = state.noticeText ?? "";
    notice.hidden = state.noticeText === null;
    result.textContent = state.resultText ?? "";
    result.hidden = state.resultText === null;
    if (scoreSignature !== lastScoreSignature) {
      renderScores(state.scoreEntries);
      lastScoreSignature = scoreSignature;
    }

    if (announcementText !== lastAnnouncementText) {
      announcement.textContent = announcementText;
      lastAnnouncementText = announcementText;
    }
  }

  function dispose() {
    root.replaceChildren();
  }

  return { render, dispose };
}
