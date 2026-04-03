import {
  AmbientLight,
  Color,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";

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

  let disposed = false;

  function resize() {
    if (disposed) {
      return;
    }

    const { clientWidth, clientHeight } = host;
    const width = Math.max(clientWidth, 1);
    const height = Math.max(clientHeight, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function dispose() {
    if (disposed) {
      return;
    }

    disposed = true;
    window.removeEventListener("resize", resize);
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  }

  resize();
  window.addEventListener("resize", resize);

  return { scene, camera, renderer, resize, dispose };
}
