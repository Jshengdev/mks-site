// Ember fragment shader — cooling sparks from bright yellow to dark red
// Adapted from Alex-DG firefly.frag.glsl radial glow
// Color ramp: white-yellow (birth) → orange (mid) → dark red (death)
// Sources: yomotsu/three-particle-fire color concept, neungkl/fire-simulation palette
uniform float uBrightness; // atmosphere-driven overall brightness

varying float vAge;        // 0=newborn, 1=dead
varying float vBrightness; // per-particle brightness from vertex shader

void main() {
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));

  // Radial glow — same inverse-distance trick as fireflies
  // Slightly tighter core than fireflies (0.04 vs 0.05) for sharper sparks
  float strength = 0.04 / distanceToCenter - 0.08;
  if (strength < 0.01) discard;

  // ─── Color ramp based on age ───
  // Birth (age=0): hot white-yellow #FFE4A0 → (1.0, 0.89, 0.63)
  // Mid (age=0.4): molten orange #FF6600 → (1.0, 0.40, 0.0)
  // Death (age=1.0): dying ember #330000 → (0.20, 0.0, 0.0)
  vec3 hotColor = vec3(1.0, 0.89, 0.63);   // white-yellow
  vec3 warmColor = vec3(1.0, 0.40, 0.0);    // molten orange
  vec3 coolColor = vec3(0.20, 0.02, 0.0);   // dying ember

  vec3 color;
  if (vAge < 0.4) {
    color = mix(hotColor, warmColor, vAge / 0.4);
  } else {
    color = mix(warmColor, coolColor, (vAge - 0.4) / 0.6);
  }

  // Alpha fades with age — embers become transparent as they die
  float alphaFade = 1.0 - smoothstep(0.6, 1.0, vAge);

  gl_FragColor = vec4(color, strength * vBrightness * alphaFade * uBrightness);
}
