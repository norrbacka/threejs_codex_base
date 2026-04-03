export type AppShell = {
  canvasHost: HTMLDivElement;
  hudRoot: HTMLDivElement;
};

export function createAppShell(root: HTMLElement): AppShell {
  root.replaceChildren();

  const canvasHost = document.createElement("div");
  canvasHost.className = "canvas-host";

  const hudRoot = document.createElement("div");
  hudRoot.className = "hud-root";

  root.append(canvasHost, hudRoot);

  return { canvasHost, hudRoot };
}
