// Rain fragment shader — elongated white streaks
// Adapted from three.quarks soft particle approach
// Simple elongated point with vertical stretch
uniform float uBrightness;

varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord;

  // Elongated vertically — rain streaks are tall and thin
  float distX = abs(uv.x - 0.5) * 4.0;  // narrow horizontally
  float distY = abs(uv.y - 0.5) * 1.5;  // stretched vertically

  float strength = 1.0 - smoothstep(0.0, 1.0, max(distX, distY));
  if (strength < 0.01) discard;

  // Cool white-blue rain color
  vec3 color = vec3(0.65, 0.70, 0.78);

  gl_FragColor = vec4(color, strength * vAlpha * uBrightness);
}
