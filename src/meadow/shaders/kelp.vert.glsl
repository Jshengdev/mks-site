// Kelp vertex shader — adapted from al-ro/grass quaternion sway
// + spacejack/terra height-scaled wind + Khronos foliage oscillation
// Underwater current instead of wind: 3-5x slower, more sinusoidal,
// height^2 scaling (base anchored, tips free)

uniform float uTime;
uniform float uKelpHeight;       // 10-15 units (5x grass)
uniform float uCurrentSpeed;     // 0.3-0.5 (much slower than wind)
uniform vec2  uCurrentDir;       // normalized XZ current direction

varying float vElevation;        // 0 at base, 1 at tip
varying vec3  vWorldPos;
varying vec3  vNormal;

// Hash for per-instance phase offset (from Nitash-Biswas)
float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  // Per-instance phase from position hash (prevents synchronization)
  float instancePhase = rand(vec2(instanceMatrix[3].x, instanceMatrix[3].z)) * 6.2831;
  float heightFactor = position.y / uKelpHeight;  // 0 at base, 1 at tip
  float hf2 = heightFactor * heightFactor;         // quadratic — tips move most

  vec4 worldPos = instanceMatrix * vec4(position, 1.0);

  // ─── Layer 1: Primary ocean current sway (slow, wide) ───
  // al-ro: 2-sine pattern, adapted for underwater (0.4x speed)
  float primaryPhase = uTime * uCurrentSpeed * 0.4 + instancePhase;
  float primarySway = sin(primaryPhase) * 0.18 * hf2;

  // ─── Layer 2: Cross-current (perpendicular, even slower) ───
  // spacejack/terra: secondary oscillation decorrelated by position
  float crossPhase = uTime * uCurrentSpeed * 0.25 + instancePhase * 1.7 + worldPos.z * 0.1;
  float crossSway = cos(crossPhase) * 0.10 * hf2;

  // ─── Layer 3: Micro-turbulence at tips only ───
  // Khronos foliage: high-freq, low-amplitude flutter
  float tipFactor = smoothstep(0.6, 1.0, heightFactor);  // only top 40%
  float microPhase = uTime * 1.2 + instancePhase * 3.0 + position.y * 2.5;
  float microSway = sin(microPhase) * 0.04 * tipFactor;

  // ─── Layer 4: Deep ocean swell (very slow, very wide) ───
  // Third frequency layer from al-ro adaptation
  float swellPhase = uTime * uCurrentSpeed * 0.12 + worldPos.x * 0.03 + worldPos.z * 0.02;
  float swellSway = sin(swellPhase) * 0.06 * hf2;

  // Apply displacement along current direction + perpendicular
  worldPos.x += (primarySway + microSway + swellSway) * uCurrentDir.x
              + crossSway * (-uCurrentDir.y);
  worldPos.z += (primarySway + microSway + swellSway) * uCurrentDir.y
              + crossSway * uCurrentDir.x;

  // Y stretch when swaying (kelp is elastic — spacejack/terra technique)
  worldPos.y += abs(primarySway) * 0.08;

  gl_Position = projectionMatrix * viewMatrix * worldPos;

  vElevation = heightFactor;
  vWorldPos = worldPos.xyz;
  // Approximate normal from blade face (flat ribbon)
  vec3 localNormal = normalize((instanceMatrix * vec4(0.0, 0.0, 1.0, 0.0)).xyz);
  vNormal = localNormal;
}
