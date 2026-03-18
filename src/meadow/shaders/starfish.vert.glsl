// Starfish vertex shader — glacial creeping movement
// Adapted from: Three.js instancing example
// Each starfish creeps imperceptibly across the pool floor

uniform float uTime;
uniform float uMoveSpeed;  // 0.001 — glacial

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vec3 pos = position;

  // Per-instance creep direction from base position hash
  float seed = instanceMatrix[3].x * 11.3 + instanceMatrix[3].z * 17.7;
  float dirAngle = fract(sin(seed) * 43758.5453) * 6.2831853;
  vec2 creepDir = vec2(cos(dirAngle), sin(dirAngle));

  vec4 worldPos = modelMatrix * instanceMatrix * vec4(pos, 1.0);

  // Glacial movement — barely perceptible over time
  worldPos.x += creepDir.x * uTime * uMoveSpeed;
  worldPos.z += creepDir.y * uTime * uMoveSpeed;

  // Subtle arm flexing — starfish arms pulse slowly
  float armFlex = sin(uTime * 0.3 + seed * 2.0) * 0.02;
  float distFromCenter = length(pos.xz);
  worldPos.y += armFlex * distFromCenter;

  vPosition = worldPos.xyz;
  vNormal = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
  vUv = uv;

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
