import {
  BoxGeometry,
  Color,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial
} from "three";
import type { GameState, PlayerColor } from "../core/types";
import { buildBoardLayout } from "./buildBoardLayout";

const playerColors: Record<PlayerColor, string> = {
  black: "#1f2430",
  white: "#f6f7fb",
  red: "#f04b4b",
  blue: "#4f7cff"
};

export function createBoardView() {
  const group = new Group();
  const board = new Mesh(
    new BoxGeometry(8.8, 0.8, 8.8),
    new MeshStandardMaterial({ color: new Color("#10192c") })
  );
  board.position.y = -0.45;
  group.add(board);

  const tileGeometry = new BoxGeometry(0.94, 0.08, 0.94);
  const pieceGeometry = new CylinderGeometry(0.34, 0.42, 0.26, 24);
  const layout = buildBoardLayout();

  for (const tile of layout.tiles) {
    const tileMesh = new Mesh(
      tileGeometry,
      new MeshStandardMaterial({
        color: (tile.row + tile.col) % 2 === 0 ? "#18243b" : "#11192d"
      })
    );
    tileMesh.position.set(tile.x, 0, tile.z);
    group.add(tileMesh);

    const piece = new Mesh(
      pieceGeometry,
      new MeshStandardMaterial({ color: "#000000", emissive: "#000000" })
    );
    piece.name = `piece-${tile.row}-${tile.col}`;
    piece.position.set(tile.x, 0.18, tile.z);
    piece.visible = false;
    group.add(piece);
  }

  function renderState(state: GameState) {
    for (const tile of layout.tiles) {
      const piece = group.getObjectByName(`piece-${tile.row}-${tile.col}`) as Mesh;
      const cell = state.board[tile.row][tile.col];
      piece.visible = cell !== null;

      if (cell) {
        const material = piece.material as MeshStandardMaterial;
        material.color = new Color(playerColors[cell]);
        material.emissive = new Color(playerColors[cell]).multiplyScalar(0.12);
      }
    }
  }

  return { group, renderState };
}
