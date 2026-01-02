// Minimal Three.js exports for better tree-shaking
// Only exports what's needed for the liquid shader (~200KB bundle savings)

export { WebGLRenderer } from "three/src/renderers/WebGLRenderer.js";
export { Scene } from "three/src/scenes/Scene.js";
export { OrthographicCamera } from "three/src/cameras/OrthographicCamera.js";
export { ShaderMaterial } from "three/src/materials/ShaderMaterial.js";
export { PlaneGeometry } from "three/src/geometries/PlaneGeometry.js";
export { Mesh } from "three/src/objects/Mesh.js";
export { Vector2 } from "three/src/math/Vector2.js";
export { Matrix3 } from "three/src/math/Matrix3.js";
