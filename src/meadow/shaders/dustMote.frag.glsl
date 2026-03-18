// Soft glow particles catching light — golden dust or underwater marine snow
uniform float uBrightness;
uniform vec3 uColor;

varying float vAlpha;
varying float vDepthFactor;

void main() {
  float dist = distance(gl_PointCoord, vec2(0.5));
  // Softer falloff than fireflies — dust catching light
  float strength = smoothstep(0.5, 0.1, dist);
  if (strength < 0.01) discard;

  // Depth-enhanced visibility: deeper marine snow catches more scattered light
  float depthGlow = mix(1.0, 1.2, clamp(vDepthFactor - 1.0, 0.0, 1.0));

  gl_FragColor = vec4(uColor, strength * vAlpha * uBrightness * 0.4 * depthGlow);
}
