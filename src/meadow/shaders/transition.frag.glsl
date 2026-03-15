// Portal transition fragment shader — GLSL dissolves between environments
// Adapted from gl-transitions/gl-transitions patterns (MIT license)
// Supports multiple transition types via uType uniform
uniform sampler2D tFrom;     // current environment FBO
uniform sampler2D tTo;       // target environment FBO
uniform float uProgress;     // 0 → 1 transition progress
uniform int uType;           // transition type (0-4)
uniform vec3 uColor;         // transition color (fog/flash color)

varying vec2 vUv;

// ─── Transition types (stolen from gl-transitions library) ───

// Type 0: Fade through color (fog)
// Adapted from gl-transitions "fade" with color intermediate
vec4 fadeThrough(vec2 uv, float progress) {
  vec4 from = texture2D(tFrom, uv);
  vec4 to = texture2D(tTo, uv);

  // Fade out → color → fade in (1.5x speed each half)
  float fadeOut = smoothstep(0.0, 0.5, progress);
  float fadeIn = smoothstep(0.5, 1.0, progress);

  vec4 mid = vec4(uColor, 1.0);
  vec4 result = mix(from, mid, fadeOut);
  result = mix(result, to, fadeIn);
  return result;
}

// Type 1: Fade through darkness
// Adapted from gl-transitions "fadecolor" — black intermediate
vec4 fadeDark(vec2 uv, float progress) {
  vec4 from = texture2D(tFrom, uv);
  vec4 to = texture2D(tTo, uv);

  // Sharper: dim → black → emerge
  float dimOut = smoothstep(0.0, 0.4, progress);
  float brightIn = smoothstep(0.6, 1.0, progress);

  vec3 dark = vec3(0.02, 0.02, 0.04);
  vec3 result = mix(from.rgb, dark, dimOut);
  result = mix(result, to.rgb, brightIn);
  return vec4(result, 1.0);
}

// Type 2: Brush stroke dissolve
// Adapted from gl-transitions "perlin" — noise-based reveal
// Uses simple hash noise instead of texture for portability
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

vec4 brushDissolve(vec2 uv, float progress) {
  vec4 from = texture2D(tFrom, uv);
  vec4 to = texture2D(tTo, uv);

  // Multi-octave noise for painterly edge
  float n = noise(uv * 8.0) * 0.5
          + noise(uv * 16.0) * 0.25
          + noise(uv * 32.0) * 0.125;

  float threshold = progress * 1.4 - 0.2; // expand range for clean start/end
  float edge = smoothstep(threshold - 0.05, threshold + 0.05, n);

  return mix(to, from, edge);
}

// Type 3: Lightning flash (white screen → new scene)
// Adapted from gl-transitions "flash" concept
vec4 lightningFlash(vec2 uv, float progress) {
  vec4 from = texture2D(tFrom, uv);
  vec4 to = texture2D(tTo, uv);

  // Flash white at midpoint
  float flash = exp(-pow((progress - 0.3) * 6.0, 2.0));
  float reveal = smoothstep(0.3, 0.7, progress);

  vec4 result = mix(from, to, reveal);
  result.rgb += vec3(flash * 1.5); // white flash additive
  return result;
}

// Type 4: Simple crossfade (fallback)
vec4 crossfade(vec2 uv, float progress) {
  vec4 from = texture2D(tFrom, uv);
  vec4 to = texture2D(tTo, uv);
  return mix(from, to, smoothstep(0.0, 1.0, progress));
}

void main() {
  vec4 color;

  if (uType == 0) {
    color = fadeThrough(vUv, uProgress);      // Meadow → Ocean: fade through fog
  } else if (uType == 1) {
    color = fadeDark(vUv, uProgress);          // Meadow → Night: through darkness
  } else if (uType == 2) {
    color = brushDissolve(vUv, uProgress);     // Meadow → Ghibli: brush dissolve
  } else if (uType == 3) {
    color = lightningFlash(vUv, uProgress);    // Meadow → Storm: lightning flash
  } else {
    color = crossfade(vUv, uProgress);         // Fallback
  }

  gl_FragColor = color;
}
