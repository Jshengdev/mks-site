// Anglerfish lure glow — warm yellow against blue-black void
// Glow falloff: exp(-dist^2 * falloff) — Gaussian, stolen from
// drahcc/ppgsoFinal point light attenuation pattern
// The ONLY warm light source in the entire abyss

uniform float uBrightness;
varying float vPulse;

void main() {
  float dist = distance(gl_PointCoord, vec2(0.5));

  // Gaussian glow — softer, more atmospheric than firefly inverse-distance
  // exp(-dist^2 * 2.5) * 0.85 from config
  float glow = exp(-dist * dist * 12.0) * 0.85;
  if (glow < 0.01) discard;

  // Warm amber-yellow — the ONLY warm light in the abyss
  // Contrast against cyan bioluminescence = visual anchor
  vec3 color = vec3(0.95, 0.80, 0.40);

  // Hot white core (center of the lure glows white-hot)
  color = mix(color, vec3(1.0, 0.95, 0.85), smoothstep(0.15, 0.0, dist));

  gl_FragColor = vec4(color, glow * vPulse * uBrightness);
}
