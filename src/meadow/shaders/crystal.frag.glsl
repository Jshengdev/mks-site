// Crystal formation fragment shader — emissive glow + fresnel + iridescence
// Adapted from:
//   stemkoski — Shader-Glow.html (fresnel edge glow, c=0.1, p=3.0)
//   Varun Vachhar — iridescent spectrum via iquilez cosine palette
//   kamilprusko/prism — per-channel fresnel for chromatic dispersion feel
//   ektogamat/fake-glow-material — glowInternalRadius=6.0, falloffAmount=0.1

uniform vec3 uColor;            // crystal body color (from config per-type)
uniform vec3 uEmissive;         // internal glow color
uniform vec3 uSunDirection;
uniform vec3 uSunColor;
uniform float uTime;
uniform float uBrightness;      // atmosphere-driven brightness multiplier
uniform float uPulseIntensity;  // 0-1 emissive breathing depth (keyframe-driven)

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldNormal;
varying float vFresnel;
varying float vHeight;
varying float vInstancePhase;   // per-crystal phase offset

// iquilez cosine palette — iridescent spectrum
// Source: Varun Vachhar rhombic triacontahedron SDF
vec3 spectrum(float t) {
  return vec3(0.5) + vec3(0.5) * cos(6.28318 * (vec3(1.0) * t + vec3(0.0, 0.33, 0.67)));
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(uSunDirection);
  vec3 viewDir = normalize(cameraPosition - vPosition);

  // Base diffuse — toon-ish 2-band for crystalline facets
  float NdotL = dot(normal, lightDir);
  float toon = NdotL > 0.3 ? 0.8 : 0.35;
  vec3 diffuse = uColor * uSunColor * toon;

  // Emissive core — brighter toward tip (crystals glow from within)
  float emissiveStrength = 0.5 + 0.5 * vHeight;

  // Breathing pulse — two detuned sine layers for organic feel
  // Source: creative-coding principle #1 — "perfect code feels dead, imperfection is the soul"
  // Each crystal has its own phase (vInstancePhase) so formations breathe independently.
  // At uPulseIntensity=0: static glow (entrance). At 1.0: full breath (RESONANCE).
  // Frequencies 1.2 and 0.7 are non-harmonic — avoids mechanical metronome feel.
  float pulse = sin(uTime * 1.2 + vInstancePhase * 6.28318) * 0.6
              + sin(uTime * 0.7 + vInstancePhase * 4.18879) * 0.4;
  pulse = pulse * 0.5 + 0.5; // remap -1..1 → 0..1
  float breathe = mix(1.0, 0.35 + pulse * 0.65, uPulseIntensity);

  vec3 emissive = uEmissive * emissiveStrength * 2.0 * breathe;

  // Fresnel edge glow (stemkoski: c=0.1, p=3.0)
  float fresnel = vFresnel;
  vec3 fresnelGlow = uEmissive * fresnel * 1.5;

  // Iridescent shimmer — spectrum shifts with view angle + time
  // Source: Varun Vachhar — perturb normal by sin(pos*10.0), spectrum of dot product
  vec3 perturb = sin(vPosition * 10.0);
  float iridT = dot(normal + perturb * 0.05, viewDir) * 2.0;
  vec3 iridescence = spectrum(iridT + uTime * 0.1) * fresnel * 0.3;

  // Specular — sharp facet glints (kamilprusko/prism: pow(color,2.0)*4.0)
  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfDir), 0.0), 32.0);
  vec3 specular = uSunColor * spec * 0.4;

  // Combine: diffuse + emissive core + fresnel edge + iridescence + specular
  vec3 col = diffuse + emissive + fresnelGlow + iridescence + specular;
  col *= uBrightness;

  gl_FragColor = vec4(col, 1.0);
}
