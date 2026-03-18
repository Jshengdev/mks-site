// Void particle — soft radial glow, barely visible
// Stolen from: Alex-DG firefly frag (inverse distance), softer falloff
uniform vec3 uColor;
uniform float uBrightness;

varying float vAlpha;

void main() {
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
  // Softer falloff than fireflies — background texture, not focus
  // (Alex-DG: 0.05/dist - 0.1, here: 0.03/dist - 0.06 for dimmer glow)
  float strength = 0.03 / distanceToCenter - 0.06;
  if (strength < 0.005) discard;

  gl_FragColor = vec4(uColor, strength * vAlpha * uBrightness);
}
