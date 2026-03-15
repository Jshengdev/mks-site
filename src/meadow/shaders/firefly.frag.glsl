// Adapted from Alex-DG — changed white to warm amber
uniform float uBrightness;

void main() {
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
  float strength = 0.05 / distanceToCenter - 0.1;
  if (strength < 0.01) discard;
  // Warm amber #d4c968 — research winner value for Night Meadow
  // "Stars are cool (hope), fireflies are warm (comfort)"
  // Multiply alpha by brightness for atmosphere-driven fade
  gl_FragColor = vec4(0.83, 0.79, 0.41, strength * uBrightness);
}
