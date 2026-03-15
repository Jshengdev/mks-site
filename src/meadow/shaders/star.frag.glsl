// Star fragment shader — soft glow point stars with spectral colors
// Adapted from Nugget8/Three.js-Ocean-Scene star rendering
// 6 spectral types passed per-vertex (O/B blue → M red)
uniform float uBrightness;

varying float vBrightness;
varying vec3 vStarColor;

void main() {
  float dist = distance(gl_PointCoord, vec2(0.5));

  // Soft radial falloff — tighter than fireflies for star-like points
  float strength = 0.03 / dist - 0.06;
  if (strength < 0.005) discard;

  // Per-star spectral color from vertex attribute
  // Bright stars are hot blue-white, dim stars are cool red
  gl_FragColor = vec4(vStarColor, strength * vBrightness * uBrightness);
}
