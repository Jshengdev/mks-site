// Floating platform vertex shader — instanced stone slabs with gentle bob
// Stolen from: pailhead instancing (InstancedBufferAttribute + GPU animation),
// spite/vertex-displacement-noise-3d (per-instance phase offset pattern)
// Uses instanceMatrix for InstancedMesh rendering (same pattern as flower.vert.glsl)

uniform float uTime;
uniform float uBobAmplitude;

attribute float aPhase;
attribute vec3 aInstanceColor;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec3 vInstanceColor;

void main() {
  vec3 pos = position;

  // Apply instance transform first
  vec4 instancePos = instanceMatrix * vec4(pos, 1.0);

  // Gentle floating bob — sinusoidal with per-instance phase
  // Slow (0.4x time) for dreamlike quality, not mechanical
  float bob = sin(uTime * 0.4 + aPhase) * uBobAmplitude;
  // Secondary micro-bob at different frequency for organic feel
  bob += sin(uTime * 0.7 + aPhase * 2.3) * uBobAmplitude * 0.3;
  instancePos.y += bob;

  // World position
  vec4 worldPos = modelMatrix * instancePos;
  vWorldPos = worldPos.xyz;

  // Normal in world space — extract rotation from instanceMatrix
  vNormal = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);

  vInstanceColor = aInstanceColor;

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
