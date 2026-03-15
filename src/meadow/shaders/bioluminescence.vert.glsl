// Bioluminescent plankton vertex shader
// Adapted from Alex-DG/vite-three-webxr-flowers FirefliesMaterial
// Changed from firefly behavior (bob + drift) to plankton behavior
// (slow drift in all 3 axes + pulse + current-driven motion)
//
// Key difference from fireflies: plankton move in 3D (not just vertical bob)
// and pulse in brightness rather than flicker.

attribute float aScale;
attribute float aPhase;       // random phase for desynchronized pulsing
attribute float aColorIndex;  // which color from the palette (0-3)

uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;
uniform float uBrightness;
uniform float uDriftSpeed;
uniform vec3 uCurrentDir;

varying float vPulse;         // brightness pulse multiplier
varying float vColorIndex;

void main() {
  float time = uTime * 0.001;  // convert from ms to seconds

  // --- 3D drift (plankton float in all directions) ---
  // Stolen from Alex-DG firefly bob, extended to 3D
  vec3 drift = vec3(
    sin(time * 0.3 + aPhase * 6.28) * 0.5,                    // X drift
    sin(time * 0.2 + aPhase * 3.14) * 0.3 + cos(time * 0.15 + aPhase) * 0.2,  // Y drift (vertical float)
    cos(time * 0.25 + aPhase * 4.71) * 0.4                    // Z drift
  ) * uDriftSpeed;

  // Add slight current drift (plankton are pushed by underwater current)
  drift += uCurrentDir * time * uDriftSpeed * 0.1;

  vec3 pos = position + drift;

  // --- Brightness pulse ---
  // Bioluminescence pulses slowly (chemical reaction cycling)
  // sin with phase offset = desynchronized across particles
  float pulse = 0.3 + 0.7 * pow(max(sin(time * 0.8 + aPhase * 6.28), 0.0), 2.0);
  vPulse = pulse * uBrightness;
  vColorIndex = aColorIndex;

  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);

  // Size: distance-scaled + scale attribute + pulse modulation
  float basePtSize = uSize * uPixelRatio;
  gl_PointSize = basePtSize * aScale * (0.7 + 0.3 * pulse) * (200.0 / -mvPos.z);
  gl_Position = projectionMatrix * mvPos;
}
