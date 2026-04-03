export {};

declare global {
  // Shim the minimal WebGPU global used by @types/three until the TS lib setup provides it.
  interface GPUTexture {}
}
