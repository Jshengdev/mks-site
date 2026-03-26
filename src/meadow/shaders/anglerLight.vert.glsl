// Anglerfish lure — pendulum bob motion in the deep
// Adapted from paulrobello/par-term floating particle technique
// Each lure bobs on a pendulum + breathes in brightness
// Distant warm points against infinite blue-black void

uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;

attribute float aScale;
attribute float aPhase;

varying float vPulse;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Pendulum swing — each lure bobs on its own rhythm
  // Stolen from paulrobello: sin(time * 1.5) * amplitude
  float swing = sin(uTime * 1.5 + aPhase) * 0.8;
  modelPosition.x += swing * aScale;

  // Vertical bob — slower, irregular (two-frequency)
  // Adapted from Chrysaora spring physics: multiple sine layers
  modelPosition.y += sin(uTime * 0.7 + aPhase * 1.73) * 0.4;
  modelPosition.y += cos(uTime * 0.3 + aPhase * 2.31) * 0.2;

  // Brightness pulse: 0.3 + 0.7 * sin(time * 2.1 + phase * 1.73)
  // Stolen from paulrobello/par-term
  vPulse = 0.3 + 0.7 * max(sin(uTime * 2.1 + aPhase * 1.73), 0.0);

  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  gl_PointSize = perspectivePointSize(uSize * aScale * uPixelRatio, viewPosition.z, 1.0);
}
