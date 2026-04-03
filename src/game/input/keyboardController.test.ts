import { afterEach, describe, expect, it, vi } from "vitest";
import { attachKeyboardController } from "./keyboardController";

describe("attachKeyboardController", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("owns movement keys on the active host even when the cursor cannot move further", () => {
    const host = document.createElement("div");
    host.tabIndex = 0;
    document.body.append(host);
    host.focus();

    const onCursorChange = vi.fn();
    const onConfirm = vi.fn();
    const detach = attachKeyboardController(host, {
      getCursor: () => ({ row: 0, col: 0 }),
      onCursorChange,
      onConfirm
    });

    const event = new KeyboardEvent("keydown", { code: "ArrowUp", cancelable: true });
    host.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(onCursorChange).not.toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();

    detach();
  });

  it("ignores owned keys when the host is not the active element", () => {
    const host = document.createElement("div");
    host.tabIndex = 0;
    const other = document.createElement("button");
    document.body.append(host, other);
    other.focus();

    const onCursorChange = vi.fn();
    const onConfirm = vi.fn();
    const detach = attachKeyboardController(host, {
      getCursor: () => ({ row: 3, col: 3 }),
      onCursorChange,
      onConfirm
    });
    other.focus();

    const event = new KeyboardEvent("keydown", { code: "KeyD", cancelable: true });
    host.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(onCursorChange).not.toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();

    detach();
  });

  it("confirms placements with enter and space while active", () => {
    const host = document.createElement("div");
    host.tabIndex = 0;
    document.body.append(host);
    host.focus();

    const onCursorChange = vi.fn();
    const onConfirm = vi.fn();
    const detach = attachKeyboardController(host, {
      getCursor: () => ({ row: 3, col: 3 }),
      onCursorChange,
      onConfirm
    });

    const enter = new KeyboardEvent("keydown", { code: "Enter", cancelable: true });
    host.dispatchEvent(enter);
    const space = new KeyboardEvent("keydown", { code: "Space", cancelable: true });
    host.dispatchEvent(space);

    expect(enter.defaultPrevented).toBe(true);
    expect(space.defaultPrevented).toBe(true);
    expect(onConfirm).toHaveBeenCalledTimes(2);
    expect(onCursorChange).not.toHaveBeenCalled();

    detach();
  });
});
