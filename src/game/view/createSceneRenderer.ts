import {
  AmbientLight,
  Color,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";

declare global {
  interface GPUTexture {}
}

export function createSceneRenderer(host: HTMLElement) {
  const scene = new Scene();
  scene.background = new Color("#070b14");

  const camera = new PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 11, 9);
  camera.lookAt(0, 0, 0);

  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  host.append(renderer.domElement);

  scene.add(new AmbientLight("#7ea3ff", 1.2));

  const keyLight = new DirectionalLight("#ffffff", 1.8);
  keyLight.position.set(4, 10, 6);
  scene.add(keyLight);

  function resize() {
    const { clientWidth, clientHeight } = host;
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  }

  resize();
  window.addEventListener("resize", resize);

  return { scene, camera, renderer, resize };
}
