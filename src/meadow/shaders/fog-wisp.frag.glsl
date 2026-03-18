// Fog wisp fragment shader — soft radial gradient with wispy noise
// Radial gradient technique from soft particle literature
// Noise layering stolen from transition.frag.glsl
uniform float uTime;
uniform vec3 uFogColor;       // warm fog color matching world palette
uniform float uOpacity;       // global opacity control from atmosphere

varying vec2 vUv;
varying float vAlpha;
varying float vPhase;

// Stolen from transition.frag.glsl (Inigo Quiléz)
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

void main() {
  // ─── Soft radial gradient (center opaque, edges transparent) ───
  vec2 center = vUv - 0.5;
  float dist = length(center);
  float radial = smoothstep(0.5, 0.15, dist); // soft circular mask

  // ─── Wispy noise (multi-octave, time-animated) ───
  // UV offset by time for internal fog churning
  float timeOffset = uTime * 0.03;
  vec2 noiseUV = vUv * 2.0 + vec2(timeOffset, timeOffset * 0.7) + vPhase * 10.0;
  float wisp = noise(noiseUV * 3.0) * 0.6
             + noise(noiseUV * 6.0) * 0.25
             + noise(noiseUV * 12.0) * 0.15;

  // Combine: radial mask * wispy noise * distance fade
  float alpha = radial * wisp * vAlpha * uOpacity;

  // Discard nearly transparent fragments
  if (alpha < 0.005) discard;

  // Slight color variation — warmer center, cooler edges
  vec3 col = mix(uFogColor * 1.1, uFogColor * 0.85, dist * 1.5);

  gl_FragColor = vec4(col, alpha);
}
