// Adapted from Alex-DG — configurable color + depth-density glow
// Default: warm amber #d4c968 (meadow fireflies)
// Underwater: teal-green bioluminescent plankton
uniform float uBrightness;
uniform vec3 uColor;

varying float vDepthFactor;    // from vertex shader depth-density gradient

void main() {
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
  float strength = 0.05 / distanceToCenter - 0.1;
  if (strength < 0.01) discard;

  // Depth-enhanced glow: deeper plankton glow more intensely
  // as bioluminescence replaces sunlight (vDepthFactor > 1.0 = deeper)
  float depthGlow = mix(1.0, 1.4, clamp(vDepthFactor - 1.0, 0.0, 1.0));

  gl_FragColor = vec4(uColor, strength * uBrightness * depthGlow);
}
