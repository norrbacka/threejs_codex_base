import type { BoardCoord } from "../core/types";
import { moveCursor } from "./cursor";

export type KeyboardHandlers = {
  getCursor: () => BoardCoord;
  onCursorChange: (next: BoardCoord) => void;
  onConfirm: () => void;
};

export function attachKeyboardController(handlers: KeyboardHandlers) {
  function onKeyDown(event: KeyboardEvent) {
    if (event.code === "Space" || event.code === "Enter") {
      event.preventDefault();
      handlers.onConfirm();
      return;
    }

    const current = handlers.getCursor();
    const next = moveCursor(current, event.code);

    if (next.row !== current.row || next.col !== current.col) {
      event.preventDefault();
      handlers.onCursorChange(next);
    }
  }

  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
}
