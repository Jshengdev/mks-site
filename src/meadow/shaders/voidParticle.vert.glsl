// Void particles — fibonacci sphere with slow drift + twinkle
// Stolen from: Alex-DG firefly vert (bob pattern, 5x slower),
// codecruzer starfield (depth-based sizing), stephanbogner fibonacci sphere
uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;

attribute float aScale;
attribute float aPhase;

varying float vAlpha;

void main() {
  float time = uTime * 0.001;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Very slow drift — 5x slower than fireflies, emphasizes void scale
  // (Alex-DG bob pattern but reduced amplitude and frequency)
  float drift = sin(time * 0.2 + aPhase * 6.28) * 0.3;
  modelPosition.x += drift * aScale;
  modelPosition.y += sin(time * 0.15 + aPhase * 3.14) * 0.2 * aScale;
  modelPosition.z += cos(time * 0.18 + aPhase * 4.71) * 0.25 * aScale;

  // Twinkle — per-particle brightness oscillation (slow shimmer)
  vAlpha = 0.3 + 0.7 * (0.5 + 0.5 * sin(time * 0.5 + aPhase * 12.57));

  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  // Point size with perspective attenuation (shared _particle-utils.glsl)
  gl_PointSize = perspectivePointSize(uSize * aScale * uPixelRatio, viewPosition.z, 1.0);
}
