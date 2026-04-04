import { describe, expect, it } from "vitest";
import { createHudView } from "./hudView";
import { deriveHudState } from "./deriveHudState";
import type { BoardCell, GameState } from "../core/types";

function createState(
  board: BoardCell[][],
  currentPlayer: GameState["currentPlayer"],
  consecutivePasses = 0
): GameState {
  return {
    board,
    currentPlayer,
    consecutivePasses,
    lastMove: null
  };
}

function createEmptyBoard(): BoardCell[][] {
  return Array.from({ length: 8 }, () => Array<BoardCell>(8).fill(null));
}

describe("createHudView", () => {
  it("keeps the live announcement separate from the score grid", () => {
    const root = document.createElement("div");

    createHudView(root);

    expect(root.querySelector(".hud-panel")?.getAttribute("aria-live")).toBeNull();
    expect(root.querySelector(".hud-announcement")?.getAttribute("aria-live")).toBe("polite");
    expect(root.querySelector(".hud-announcement")?.getAttribute("aria-atomic")).toBe("true");
  });

  it("renders the active player, live scores, and skip notice", () => {
    const root = document.createElement("div");
    const view = createHudView(root);
    const board = createEmptyBoard();
    board[0][0] = "black";
    board[0][1] = "white";
    board[0][2] = "red";
    board[0][3] = "blue";

    view.render(
      deriveHudState(createState(board, "blue"), {
        skippedPlayers: ["white", "red"]
      })
    );

    expect(root.querySelector(".hud-panel")?.getAttribute("data-phase")).toBe("turn");
    expect(root.querySelector(".hud-current-player")?.textContent).toBe("Current player: Blue");
    expect(root.querySelector(".hud-notice")?.textContent).toBe("Skipped White and Red. Blue to move.");
    expect(Array.from(root.querySelectorAll(".hud-score")).map((entry) => entry.textContent)).toEqual([
      "Black 1",
      "White 1",
      "Red 1",
      "Blue 1"
    ]);
    expect((root.querySelector(".hud-result") as HTMLElement | null)?.hidden).toBe(true);
  });

  it("keeps score nodes stable when rendering the same scores again", () => {
    const root = document.createElement("div");
    const view = createHudView(root);
    const board = createEmptyBoard();
    board[0][0] = "black";
    board[0][1] = "white";

    const hud = deriveHudState(createState(board, "black"));
    view.render(hud);

    const firstScoreNodes = Array.from(root.querySelectorAll(".hud-score"));

    view.render(hud);

    const secondScoreNodes = Array.from(root.querySelectorAll(".hud-score"));
    expect(secondScoreNodes).toHaveLength(firstScoreNodes.length);
    expect(secondScoreNodes[0]).toBe(firstScoreNodes[0]);
    expect(secondScoreNodes[1]).toBe(firstScoreNodes[1]);
  });

  it("renders the final result without a turn notice", () => {
    const root = document.createElement("div");
    const view = createHudView(root);
    const board = createEmptyBoard();
    board[0][0] = "black";
    board[0][1] = "black";
    board[0][2] = "white";
    board[0][3] = "white";

    view.render(deriveHudState(createState(board, "white", 4)));

    expect(root.querySelector(".hud-panel")?.getAttribute("data-phase")).toBe("game-over");
    expect(root.querySelector(".hud-current-player")?.textContent).toBe("Game over");
    expect((root.querySelector(".hud-notice") as HTMLElement | null)?.hidden).toBe(true);
    expect(root.querySelector(".hud-result")?.textContent).toBe("Tie between Black and White with 2 pieces each.");
  });
});
