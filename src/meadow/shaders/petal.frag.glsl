// Petal fragment shader — soft oval cherry blossom shape
// Uses rotated UV for petal-like oval, soft pink-white palette
uniform float uBrightness;

varying float vAlpha;
varying float vRotation;

void main() {
  // Rotate UV by vRotation for tumbling petal effect
  vec2 uv = gl_PointCoord - 0.5;
  float c = cos(vRotation);
  float s = sin(vRotation);
  uv = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);

  // Oval shape — stretched horizontally for petal silhouette
  float dist = length(uv * vec2(1.8, 1.0));
  float strength = smoothstep(0.5, 0.2, dist);
  if (strength < 0.01) discard;

  // Soft pink-white palette — varies by rotation for subtle color shifts
  float warmth = sin(vRotation * 0.5) * 0.5 + 0.5;
  vec3 pink = vec3(1.0, 0.82, 0.85);
  vec3 white = vec3(1.0, 0.95, 0.92);
  vec3 color = mix(pink, white, warmth * 0.6);

  gl_FragColor = vec4(color, strength * vAlpha * uBrightness);
}
