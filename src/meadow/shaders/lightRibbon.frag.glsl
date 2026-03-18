// Light ribbon — trail fade + emissive glow
// Stolen from: mkkellogg TrailRendererJS (fraction-based alpha),
// mdkq curl noise ribbons (whisp colors)
uniform vec3 uColor;
uniform float uEmissiveIntensity;
uniform float uBrightness;

varying vec2 vUv;

void main() {
  // Trail fade: head (uv.x=0) is bright, tail (uv.x=1) dims
  // (mkkellogg: fraction = (maxID - nodeID) / range, linear fade)
  float trailFade = 1.0 - vUv.x * 0.85;

  // Edge softness — fade at ribbon edges to avoid hard silhouette
  float edgeFade = 1.0 - abs(vUv.y * 2.0 - 1.0);
  edgeFade = smoothstep(0.0, 0.3, edgeFade);

  float alpha = trailFade * edgeFade * uBrightness;
  if (alpha < 0.01) discard;

  vec3 color = uColor * uEmissiveIntensity;

  gl_FragColor = vec4(color, alpha);
}
