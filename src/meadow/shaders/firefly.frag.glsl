// Adapted from Alex-DG — changed white to warm amber
uniform float uBrightness;

void main() {
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
  float strength = 0.05 / distanceToCenter - 0.1;
  if (strength < 0.01) discard;
  // Warm amber instead of white (BotW golden hour)
  // Multiply alpha by brightness for atmosphere-driven fade
  gl_FragColor = vec4(1.0, 0.85, 0.4, strength * uBrightness);
}
