// Steam vent fragment — soft gaussian particle with life-based fade
// Adapted from stemkoski/ParticleEngine opacityTween pattern
uniform vec3 uColor;
uniform float uBrightness;

varying float vLife;

void main() {
  float dist = distance(gl_PointCoord, vec2(0.5));

  // Soft gaussian falloff (not hard circle)
  float alpha = exp(-dist * dist * 8.0);
  if (alpha < 0.02) discard;

  // Fade in fast (0→0.1), sustain, fade out slow (0.5→1.0)
  float fadeIn = smoothstep(0.0, 0.1, vLife);
  float fadeOut = 1.0 - smoothstep(0.5, 1.0, vLife);
  alpha *= fadeIn * fadeOut;

  gl_FragColor = vec4(uColor, alpha * uBrightness);
}
