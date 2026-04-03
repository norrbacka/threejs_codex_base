import "./style.css";
import { createAppShell } from "./game/app/createAppShell";
import { createUltrathelloApp } from "./game/app/createUltrathelloApp";

const root = document.querySelector<HTMLDivElement>("#app");

if (!root) {
  throw new Error("Missing #app root");
}

const shell = createAppShell(root);
createUltrathelloApp(shell.canvasHost);
