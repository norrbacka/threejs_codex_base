import "./style.css";
import { createAppShell } from "./game/app/createAppShell";

const root = document.querySelector<HTMLDivElement>("#app");

if (!root) {
  throw new Error("Missing #app root");
}

createAppShell(root);
