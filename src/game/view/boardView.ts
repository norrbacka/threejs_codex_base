import {
  BoxGeometry,
  Color,
  CylinderGeometry,
  Group,
  Material,
  Mesh,
  MeshStandardMaterial,
  RingGeometry
} from "three";
import type { BoardCoord, GameState, PlayerColor } from "../core/types";
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
  const cursorMaterial = new MeshStandardMaterial({ color: "#fff27a", emissive: "#ffcc33" });
  const cursor = new Mesh(new RingGeometry(0.38, 0.47, 32), cursorMaterial);
  const markers = new Group();
  let invalidPulseTimeout: number | null = null;

  cursor.rotation.x = -Math.PI / 2;
  cursor.position.y = 0.06;
  group.add(cursor);
  group.add(markers);

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

  function getTilePosition(coord: BoardCoord) {
    return layout.tiles.find((entry) => entry.row === coord.row && entry.col === coord.col);
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

  function updateCursor(coord: BoardCoord) {
    const tile = getTilePosition(coord);
    if (!tile) return;

    cursor.position.set(tile.x, 0.06, tile.z);
  }

  function disposeMarker(marker: Mesh) {
    marker.geometry.dispose();
    disposeMaterial(marker.material);
  }

  function clearMarkers() {
    for (const child of [...markers.children]) {
      markers.remove(child);

      if (child instanceof Mesh) {
        disposeMarker(child);
      }
    }
  }

  function updateLegalMoves(moves: BoardCoord[]) {
    clearMarkers();

    for (const move of moves) {
      const tile = getTilePosition(move);
      if (!tile) continue;

      const marker = new Mesh(
        new CylinderGeometry(0.12, 0.12, 0.04, 16),
        new MeshStandardMaterial({ color: "#6ef3ff", emissive: "#1bc7ff" })
      );
      marker.position.set(tile.x, 0.08, tile.z);
      markers.add(marker);
    }
  }

  function pulseInvalidMove(onRestore?: () => void) {
    if (invalidPulseTimeout !== null) {
      window.clearTimeout(invalidPulseTimeout);
    }

    cursorMaterial.color.set("#ff6b87");
    cursorMaterial.emissive.set("#ff3355");
    invalidPulseTimeout = window.setTimeout(() => {
      cursorMaterial.color.set("#fff27a");
      cursorMaterial.emissive.set("#ffcc33");
      invalidPulseTimeout = null;
      onRestore?.();
    }, 120);
  }

  function disposeMaterial(material: Material | Material[]) {
    if (Array.isArray(material)) {
      for (const entry of material) {
        entry.dispose();
      }

      return;
    }

    material.dispose();
  }

  function dispose() {
    if (invalidPulseTimeout !== null) {
      window.clearTimeout(invalidPulseTimeout);
    }

    clearMarkers();
    const disposedGeometries = new Set();
    const disposedMaterials = new Set();

    group.traverse((child) => {
      if (!(child instanceof Mesh)) {
        return;
      }

      if (!disposedGeometries.has(child.geometry)) {
        child.geometry.dispose();
        disposedGeometries.add(child.geometry);
      }

      if (!disposedMaterials.has(child.material)) {
        disposeMaterial(child.material);
        disposedMaterials.add(child.material);
      }
    });

    group.removeFromParent();
    group.clear();
  }

  return { group, renderState, updateCursor, updateLegalMoves, pulseInvalidMove, dispose };
}
