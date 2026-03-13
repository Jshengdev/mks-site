uniform float uTime;
uniform vec3 uColor;
uniform float uOpacity;

varying vec2 vUv;
varying float vWorldY;

// Simple hash noise
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

void main() {
  // Vertical shimmer — aurora-like
  float n1 = noise(vec2(vUv.x * 3.0 + uTime * 0.3, vUv.y * 5.0 - uTime * 0.5));
  float n2 = noise(vec2(vUv.x * 5.0 - uTime * 0.2, vUv.y * 8.0 + uTime * 0.4));
  float shimmer = n1 * 0.6 + n2 * 0.4;

  // Fade at edges (soften into scene)
  float edgeFade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
  float topFade = smoothstep(1.0, 0.7, vUv.y);
  float bottomFade = smoothstep(0.0, 0.2, vUv.y);

  float alpha = shimmer * edgeFade * topFade * bottomFade * uOpacity;

  // Slight color shift based on height
  vec3 col = uColor + vec3(0.1, 0.05, -0.05) * vUv.y;

  gl_FragColor = vec4(col, alpha * 0.4);
}
