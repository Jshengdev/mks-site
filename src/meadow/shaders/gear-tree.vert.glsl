// Instanced metallic trunk/branch cylinders — adapted from mattatz/THREE.Tree
// Static instances positioned via instanceMatrix, no per-frame animation
uniform float uTime;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec4 worldPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);
  vPosition = worldPosition.xyz;
  vNormal = normalize(mat3(instanceMatrix) * normal);

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
