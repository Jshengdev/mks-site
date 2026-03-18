// Portal door interior — swirling FBM noise with radial glow
// Stolen from: VoXelo/Procedural Portal (domain-warped FBM + swirl),
// spite/vertex-displacement-noise-3d (noise functions),
// existing portal.frag.glsl (edge fade pattern)

uniform float uTime;
uniform vec3 uColor;
uniform float uBrightness;

varying vec2 vUv;

// Hash noise — stolen from portal.frag.glsl
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// FBM — 5 octaves, stolen from VoXelo procedural portal
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vUv - 0.5;
  float dist = length(uv);

  // Swirl distortion — VoXelo technique
  // Portal rotation: angle warps with distance for depth illusion
  float angle = atan(uv.y, uv.x);
  angle += uTime * 0.3 + dist * 3.0;

  // Domain-warped FBM noise — two layers for visual depth
  vec2 warpedUV = vec2(cos(angle), sin(angle)) * 2.0 + uTime * 0.15;
  float n1 = fbm(warpedUV);
  float n2 = fbm(warpedUV + n1 * 1.5 + 0.8); // second warp layer

  // Radial falloff — bright center, fading edges
  float glow = smoothstep(0.5, 0.05, dist) * (0.4 + n2 * 0.6);

  // Edge ring — brighter at the threshold (portal boundary)
  float ring = smoothstep(0.48, 0.38, dist) * smoothstep(0.20, 0.35, dist) * 0.6;

  // Slow pulse — breathing, not mechanical
  float pulse = 0.85 + sin(uTime * 0.6) * 0.15;

  vec3 col = uColor * (glow + ring) * pulse;

  // Slight color shift toward white at center (intense energy)
  col += vec3(0.15, 0.12, 0.08) * smoothstep(0.3, 0.0, dist) * n1;

  float alpha = (glow * 0.9 + ring * 0.5) * uBrightness;

  gl_FragColor = vec4(col, alpha);
}
