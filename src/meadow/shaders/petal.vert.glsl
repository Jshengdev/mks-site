// Petal vertex shader — falling cherry blossom particles
// Adapted from standard particle flutter techniques
// Combines sine-wave flutter with spiral descent path
uniform float uTime;
uniform float uPixelRatio;
uniform float uBaseSize;

attribute float aPhase;     // per-petal phase offset
attribute float aSize;      // per-petal size multiplier
attribute vec3 aVelocity;   // per-petal drift direction

varying float vAlpha;
varying float vRotation;    // for fragment UV rotation

void main() {
  float t = uTime;

  // Spiral descent — petals flutter down with horizontal drift
  vec3 pos = position;

  // Vertical: slow fall with sine flutter
  float fallSpeed = 0.8 + aPhase * 0.4;
  pos.y -= mod(t * fallSpeed + aPhase * 20.0, 25.0); // wrap around
  pos.y = mod(pos.y + 15.0, 25.0) - 5.0; // keep in range

  // Horizontal: gentle sinusoidal drift (like a real petal)
  float flutter = sin(t * 2.0 + aPhase * 6.28) * 1.5;
  float drift = cos(t * 1.3 + aPhase * 4.0) * 0.8;
  pos.x += flutter * aVelocity.x;
  pos.z += drift * aVelocity.z;

  // Rotation for visual variety
  vRotation = t * (1.0 + aPhase * 2.0);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Size with distance attenuation
  float size = uBaseSize * aSize * uPixelRatio;
  size *= (150.0 / -mvPosition.z);
  gl_PointSize = clamp(size, 2.0, 20.0);

  // Fade near ground and at distance
  vAlpha = smoothstep(-3.0, 0.0, pos.y) * smoothstep(120.0, 30.0, -mvPosition.z);
}
