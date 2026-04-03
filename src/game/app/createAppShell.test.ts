import { describe, expect, it } from "vitest";
import { createAppShell } from "./createAppShell";

describe("createAppShell", () => {
  it("creates separate mount points for the renderer and HUD", () => {
    const root = document.createElement("div");
    const shell = createAppShell(root);

    expect(shell.canvasHost.className).toBe("canvas-host");
    expect(shell.hudRoot.className).toBe("hud-root");
    expect(shell.canvasHost).not.toBe(shell.hudRoot);
    expect(root.firstElementChild).toBe(shell.canvasHost);
    expect(root.lastElementChild).toBe(shell.hudRoot);
    expect(root.children).toHaveLength(2);
  });

  it("marks the root element as a full-height app shell", () => {
    const root = document.createElement("div");

    createAppShell(root);

    expect(root.classList.contains("app-shell")).toBe(true);
  });
});
