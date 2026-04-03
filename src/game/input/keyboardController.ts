import type { BoardCoord } from "../core/types";
import { moveCursor } from "./cursor";

export type KeyboardHandlers = {
  getCursor: () => BoardCoord;
  onCursorChange: (next: BoardCoord) => void;
  onConfirm: () => void;
};

const MOVEMENT_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD"
]);

const CONFIRM_KEYS = new Set(["Space", "Enter"]);

export function attachKeyboardController(host: HTMLElement, handlers: KeyboardHandlers) {
  if (host.tabIndex < 0) {
    host.tabIndex = 0;
  }

  function focusHost() {
    host.focus();
  }

  focusHost();

  function onKeyDown(event: KeyboardEvent) {
    const ownsKey = MOVEMENT_KEYS.has(event.code) || CONFIRM_KEYS.has(event.code);
    if (!ownsKey || document.activeElement !== host) {
      return;
    }

    event.preventDefault();

    if (CONFIRM_KEYS.has(event.code)) {
      event.preventDefault();
      handlers.onConfirm();
      return;
    }

    const current = handlers.getCursor();
    const next = moveCursor(current, event.code);

    if (next.row !== current.row || next.col !== current.col) {
      handlers.onCursorChange(next);
    }
  }

  host.addEventListener("keydown", onKeyDown);
  host.addEventListener("pointerdown", focusHost);

  return () => {
    host.removeEventListener("keydown", onKeyDown);
    host.removeEventListener("pointerdown", focusHost);
  };
}
