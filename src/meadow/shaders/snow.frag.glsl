// Snow fragment shader — soft round flakes with optional aurora tinting
// Blue-white base, picks up aurora color at 30% (config.auroraResponse)
uniform float uBrightness;
uniform vec3 uAuroraColor;
uniform float uAuroraResponse;

varying float vAlpha;
varying float vHeight;

void main() {
  // Soft round particle (not stretched like rain)
  float dist = distance(gl_PointCoord, vec2(0.5));
  float strength = 1.0 - smoothstep(0.0, 0.5, dist);
  if (strength < 0.01) discard;

  // Blue-white snow base
  vec3 baseColor = vec3(0.85, 0.88, 0.95);
  // Higher flakes pick up more aurora color
  float auroraFactor = smoothstep(-2.0, 22.0, vHeight) * uAuroraResponse;
  vec3 color = mix(baseColor, uAuroraColor, auroraFactor);

  gl_FragColor = vec4(color, strength * vAlpha * uBrightness);
}
