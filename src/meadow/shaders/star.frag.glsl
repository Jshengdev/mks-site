// Star fragment shader — soft glow point stars
// Adapted from Nugget8/Three.js-Ocean-Scene star rendering
// Uses inverse-distance glow similar to Alex-DG firefly pattern
uniform float uBrightness;

varying float vBrightness;

void main() {
  float dist = distance(gl_PointCoord, vec2(0.5));

  // Soft radial falloff — tighter than fireflies for star-like points
  float strength = 0.03 / dist - 0.06;
  if (strength < 0.005) discard;

  // Cool blue-white star color with slight warmth variation per star
  // Brighter stars lean warmer (like real stellar classification)
  vec3 coolWhite = vec3(0.75, 0.82, 1.0);   // blue-white (most stars)
  vec3 warmWhite = vec3(1.0, 0.92, 0.80);   // warm white (bright stars)
  vec3 color = mix(coolWhite, warmWhite, vBrightness * 0.5);

  gl_FragColor = vec4(color, strength * vBrightness * uBrightness);
}
