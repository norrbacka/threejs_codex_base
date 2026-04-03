import { describe, expect, it } from "vitest";
import { createAppShell } from "./createAppShell";

describe("createAppShell", () => {
  it("creates separate mount points for the renderer and HUD", () => {
    const root = document.createElement("div");
    const shell = createAppShell(root);

    expect(shell.canvasHost.dataset.role).toBe("canvas-host");
    expect(shell.hudRoot.dataset.role).toBe("hud-root");
    expect(root.children).toHaveLength(2);
  });
});
