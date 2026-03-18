// Stolen from ektogamat fake-glow + stemkoski glow sphere
// Fresnel rim glow with emissive core
uniform vec3 uColor;
uniform vec3 uFresnelColor;
uniform float uEmissiveIntensity;
uniform float uFresnelIntensity;
uniform float uBrightness;

varying float vFresnel;
varying float vPulse;

void main() {
  // Core: deep violet, intensity scales with pulse breathing
  vec3 core = uColor * uEmissiveIntensity * (0.3 + vPulse * 0.7);

  // Fresnel rim: lighter violet edge glow
  // (ektogamat: fresnel * sharpness + fresnel, falloff smoothstep)
  vec3 rim = uFresnelColor * vFresnel * uFresnelIntensity;

  vec3 finalColor = core + rim;

  // Alpha: base opacity from core, rim adds edge glow
  float alpha = (0.4 + vFresnel * 0.6) * uBrightness;

  gl_FragColor = vec4(finalColor * uBrightness, alpha);
}
