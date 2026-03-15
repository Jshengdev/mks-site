// Star vertex shader — procedural stars on sky sphere
// Adapted from Nugget8/Three.js-Ocean-Scene SkyboxShader.js star rendering
// Stars are Points on a large sphere, brightness-based sizing
uniform float uPixelRatio;
uniform float uBaseSize;
uniform float uBrightness;
uniform float uTime;

attribute float aStarBrightness;

varying float vBrightness;

void main() {
  vBrightness = aStarBrightness;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Size from brightness — brighter stars are larger
  // pow(brightness, 0.5) gives visible range from dim to bright
  float size = uBaseSize * (0.3 + aStarBrightness * 0.7) * uPixelRatio;

  // Subtle twinkle — sin with per-star phase from brightness
  float twinkle = 1.0 + sin(uTime * (1.5 + aStarBrightness * 3.0) + aStarBrightness * 100.0) * 0.15;
  size *= twinkle;

  gl_PointSize = size;
  // No depth attenuation — stars are infinitely far
}
