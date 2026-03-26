// Ash vertex shader — slow-falling grey particles with lateral tumble
// Adapted from DustMotes pattern + creativelifeform/three-nebula snow physics
// Ash falls SLOWLY (opposite of embers), with erratic horizontal drift
uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;
uniform float uFallSpeed;

attribute float aScale;
attribute float aPhase;

varying float vAlpha;

// Hash noise stolen from al-ro/grass
float hash(float n) { return fract(sin(n) * 43758.5453); }

float noise3D(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n = i.x + i.y * 157.0 + 113.0 * i.z;
  return mix(
    mix(mix(hash(n), hash(n+1.0), f.x), mix(hash(n+157.0), hash(n+158.0), f.x), f.y),
    mix(mix(hash(n+113.0), hash(n+114.0), f.x), mix(hash(n+270.0), hash(n+271.0), f.x), f.y),
    f.z
  );
}

void main() {
  float time = uTime * 0.15; // very slow time scale

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Falling — slow descent with per-particle speed variation
  // Lifecycle wraps: falls from ceiling, resets to top
  // Stolen from rain system mod-cycle pattern
  float fallRange = 20.0; // total fall distance
  float fallOffset = mod(time * uFallSpeed * aScale + aPhase * fallRange, fallRange);
  modelPosition.y -= fallOffset;

  // Lateral tumble — wider drift than dust motes
  // Stolen from creativelifeform RandomDrift(15, 1, 15)
  float driftX = noise3D(vec3(modelPosition.xz * 0.02, time + aPhase * 5.0)) - 0.5;
  float driftZ = noise3D(vec3(modelPosition.zx * 0.03, time * 0.8 + aPhase * 3.0)) - 0.5;
  modelPosition.x += driftX * 4.0 * aScale;
  modelPosition.z += driftZ * 3.5 * aScale;

  // Gentle Y wobble — ash tumbles as it falls
  modelPosition.y += sin(time * 2.0 + aPhase * 6.28) * 0.15 * aScale;

  // Alpha: fade at extremes of height, max in mid-air
  vAlpha = smoothstep(-2.0, 1.0, modelPosition.y) * smoothstep(18.0, 12.0, modelPosition.y);

  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  // Distance fade
  vAlpha *= smoothstep(100.0, 15.0, -viewPosition.z);

  gl_PointSize = perspectivePointSize(uSize * aScale * uPixelRatio, viewPosition.z, 1.0);
  gl_PointSize = clamp(gl_PointSize, 0.5, 12.0);
}
