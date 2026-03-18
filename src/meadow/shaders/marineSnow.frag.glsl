// Marine snow fragment — barely visible white specks
// Adapted from particulate-medusae: squared distance falloff for soft glow
// These are organic detritus from the surface — the only connection to sunlight
// Pale, ghostly, almost invisible — you notice them only when you stop looking

uniform float uBrightness;
varying float vAlpha;

void main() {
  float dist = distance(gl_PointCoord, vec2(0.5));

  // Squared falloff — softer than inverse distance, more natural
  float strength = max(0.0, (0.5 - dist) / 0.5);
  strength = strength * strength;
  if (strength < 0.01) discard;

  // Pale blue-white — organic matter catching faint bioluminescent light
  vec3 color = vec3(0.55, 0.60, 0.65);

  gl_FragColor = vec4(color, strength * vAlpha * uBrightness);
}
