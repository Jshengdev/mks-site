// Paper tree vertex shader — low-poly folded paper tree
// Adapted from flower.vert.glsl pattern (InstancedMesh + gentle sway)
// Paper trees are stiff — only crown tips sway slightly

uniform float uTime;
uniform float uTrunkHeight;  // y threshold: below = trunk (no sway), above = crown

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 pos = position;

  // Crown sway — only vertices above trunk height move
  // Paper is stiff: small amplitude, slow frequency
  float aboveTrunk = max(0.0, pos.y - uTrunkHeight) / (3.0 - uTrunkHeight);
  float sway = sin(uTime * 0.6 + pos.x * 3.0) * 0.04 * aboveTrunk;
  pos.x += sway;
  pos.z += sway * 0.3;

  vec4 worldPosition = modelMatrix * instanceMatrix * vec4(pos, 1.0);
  vPosition = worldPosition.xyz;

  // Flat face normals — each triangle is a paper surface
  vNormal = normalize(mat3(instanceMatrix) * normal);

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
