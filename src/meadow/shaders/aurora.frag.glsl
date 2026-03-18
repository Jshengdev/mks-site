// Aurora curtain fragment shader — nimitz triNoise2d on dome mesh
// Source: nimitz "Auroras" (Shadertoy XtGGRt), CC BY-NC-SA 3.0
// Adapted from raymarching to UV-based sampling on curved plane
// Magic numbers preserved from original: z=1.8, z2=2.5, bp*1.85,
// z2*=0.45, z*=0.42, pow(rz*29.0, 1.3), color vec3(2.15,-0.5,1.2)
uniform float uTime;
uniform float uBrightness;
uniform float uSpeed;
uniform vec3 uColorBase;
uniform float uColorShift;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying float vEdgeFade;

// nimitz rotation matrix
mat2 mm2(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, s, -s, c);
}

// nimitz constant rotation (cos(0.3), sin(0.3))
const mat2 m2 = mat2(0.95534, 0.29552, -0.29552, 0.95534);

// nimitz triangle wave basis — creates vein/curtain patterns
// NOT smooth Perlin — the discontinuities ARE the aurora curtains
float tri(float x) {
  return clamp(abs(fract(x) - 0.5), 0.01, 0.49);
}

vec2 tri2(vec2 p) {
  return vec2(tri(p.x) + tri(p.y), tri(p.y + tri(p.x)));
}

// nimitz triNoise2d — 5-octave triangle-wave FBM with animated rotation
// This is the core aurora pattern generator
float triNoise2d(vec2 p, float spd) {
  float z = 1.8;
  float z2 = 2.5;
  float rz = 0.0;
  p *= mm2(p.x * 0.06);
  vec2 bp = p;
  for (float i = 0.0; i < 5.0; i++) {
    vec2 dg = tri2(bp * 1.85) * 0.75;
    dg *= mm2(uTime * spd);
    p -= dg / z2;
    bp *= 1.3;
    z2 *= 0.45;
    z *= 0.42;
    p *= 1.21 + (rz - 1.0) * 0.02;
    rz += tri(p.x + tri(p.y)) * z;
    p *= -m2;
  }
  return clamp(1.0 / pow(rz * 29.0, 1.3), 0.0, 0.55);
}

void main() {
  // Sample aurora pattern from world-space XZ (large scale for sky dome)
  vec2 p = vWorldPosition.xz * 0.007;

  // Two aurora layers at different scales + speeds for depth
  float noise1 = triNoise2d(p, uSpeed);
  float noise2 = triNoise2d(p * 0.65 + vec2(47.0, 31.0), uSpeed * 0.75);

  // Combined aurora intensity
  float aurora = noise1 * 0.6 + noise2 * 0.4;

  // Color cycling — nimitz sin(1.0 - colorBase + layer * colorShift)
  // Creates green→purple→blue cycling across the curtain
  vec3 color1 = sin(1.0 - uColorBase) * 0.5 + 0.5;
  vec3 color2 = sin(1.0 - uColorBase + uColorShift * 14.0) * 0.5 + 0.5;
  float blend = noise2 / max(noise1 + noise2, 0.001);
  vec3 auroraColor = mix(color1, color2, blend);

  // Boost greens slightly (aurora is predominantly green)
  auroraColor.g *= 1.15;

  // Final color with intensity
  vec3 finalColor = auroraColor * aurora * 2.8;

  // Alpha: noise pattern * edge fade * brightness control
  float alpha = aurora * vEdgeFade;
  alpha = smoothstep(0.02, 0.35, alpha) * uBrightness;

  gl_FragColor = vec4(finalColor * uBrightness, alpha);
}
