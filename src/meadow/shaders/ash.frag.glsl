// Ash fragment shader — grey volcanic ash, soft and nearly transparent
// Uses NormalBlending (not additive) — ash occludes, doesn't glow
// Color values from hzy5000 campfire smoke emitter
uniform float uBrightness;

varying float vAlpha;

void main() {
  float dist = distance(gl_PointCoord, vec2(0.5));

  // Softer falloff than embers — ash is diffuse, not glowing
  // Stolen from dustMote smoothstep pattern
  float strength = smoothstep(0.5, 0.15, dist);
  if (strength < 0.01) discard;

  // Grey volcanic ash — slight warm tint from lava light below
  // Color range from hzy5000: medium grey with very slight warmth
  vec3 color = vec3(0.35, 0.32, 0.30);

  // Very low opacity — ash is atmospheric, not a wall
  // Max alpha ~0.25 even at full brightness
  gl_FragColor = vec4(color, strength * vAlpha * uBrightness * 0.25);
}
