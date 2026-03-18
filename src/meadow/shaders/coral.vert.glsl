// Coral vertex shader — gentle sway from underwater current
// Adapted from flower.vert.glsl sway pattern, much slower
// Coral is rigid at base, slight flex at branch tips

uniform float uTime;

varying vec3 vWorldPos;
varying vec3 vNormal;
varying float vHeight;  // normalized height within coral cluster

void main() {
  vec4 worldPos = instanceMatrix * vec4(position, 1.0);

  // Per-instance phase from position hash
  float phase = fract(sin(dot(vec2(instanceMatrix[3].x, instanceMatrix[3].z),
    vec2(12.9898, 78.233))) * 43758.5453) * 6.2831;

  // Coral sway: very gentle, only at tips (rigid structure)
  // Height in local space — coral tips flex, base stays planted
  float localHeight = position.y;
  float flexFactor = smoothstep(0.0, 2.0, localHeight);  // only flex above 2 units

  // Single slow oscillation (coral is rigid, not kelp-flexible)
  float sway = sin(uTime * 0.3 + phase) * 0.02 * flexFactor;
  worldPos.x += sway;
  worldPos.z += sway * 0.7;

  gl_Position = projectionMatrix * viewMatrix * worldPos;

  vWorldPos = worldPos.xyz;
  vNormal = normalize((instanceMatrix * vec4(normal, 0.0)).xyz);
  vHeight = localHeight;
}
