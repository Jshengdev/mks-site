// Soft glow particles catching golden light
uniform float uBrightness;
varying float vAlpha;

void main() {
  float dist = distance(gl_PointCoord, vec2(0.5));
  // Softer falloff than fireflies — dust catching light
  float strength = smoothstep(0.5, 0.1, dist);
  if (strength < 0.01) discard;
  // Warm white-gold (golden hour dust)
  vec3 color = vec3(1.0, 0.95, 0.8);
  gl_FragColor = vec4(color, strength * vAlpha * uBrightness * 0.4);
}
