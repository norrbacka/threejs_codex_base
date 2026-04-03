export type AppShell = {
  canvasHost: HTMLDivElement;
  hudRoot: HTMLDivElement;
};

export function createAppShell(root: HTMLElement): AppShell {
  root.replaceChildren();

  const canvasHost = document.createElement("div");
  canvasHost.className = "canvas-host";
  canvasHost.dataset.role = "canvas-host";

  const hudRoot = document.createElement("div");
  hudRoot.className = "hud-root";
  hudRoot.dataset.role = "hud-root";

  root.append(canvasHost, hudRoot);

  return { canvasHost, hudRoot };
}
