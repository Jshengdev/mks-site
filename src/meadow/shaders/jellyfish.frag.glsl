// Jellyfish bioluminescent glow — per-instance species color + Fresnel rim
// 5 deep-sea species adapted from real photography:
//   Aequorea victoria (cyan), Mnemiopsis leidyi (deep blue),
//   Crossota norvegica (blood crimson), Beroe forskalii (violet),
//   Leucothea multicornis (ghost white)
// Fresnel rim: otanodesignco/Fresnel-Shader-Material: pow(1-dot(N,V), power)
// Bulb patterns: jpweeks/particulate-medusae
// Inner glow: aurelia ray-to-center distance falloff

uniform vec3 uBellColor;     // fallback body color
uniform vec3 uGlowColor;     // fallback glow color
uniform float uFresnelPower;
uniform float uBrightness;
uniform float uTime;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vBellFactor;
varying float vColorIndex;
varying float vOpacityScale;

// Deep-sea jellyfish species palette — bioluminescent glow colors
// Controlled randomness: 5 curated colors from real deep-sea photography
// Distribution (set in JS): 35% cyan, 25% blue, 15% red, 15% violet, 10% white
vec3 getSpeciesGlow(float idx) {
  if (idx < 0.35) return vec3(0.20, 0.90, 0.80);  // cyan — Aequorea (dominant)
  if (idx < 0.60) return vec3(0.12, 0.40, 0.88);  // deep blue — Mnemiopsis
  if (idx < 0.75) return vec3(0.82, 0.10, 0.12);  // blood crimson — Crossota
  if (idx < 0.90) return vec3(0.50, 0.18, 0.72);  // violet — Beroe
  return vec3(0.80, 0.78, 0.68);                    // ghost white — Leucothea
}

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  vec3 N = normalize(vNormal);

  // Per-instance species colors (body = dark translucent version of glow)
  vec3 glowColor = getSpeciesGlow(vColorIndex);
  vec3 bodyColor = glowColor * 0.12;

  // Fresnel rim glow (stolen from otanodesignco)
  float fresnel = pow(1.0 - abs(dot(N, viewDir)), uFresnelPower);

  // Inner body glow — per-species pulse rate (different heartbeat speeds)
  // Biological: jellyfish contraction frequency varies 1.5-2.5 Hz by species
  float pulseSpeed = 1.6 + vColorIndex * 0.8;
  float innerGlow = 0.12 + 0.08 * sin(uTime * pulseSpeed + vWorldPos.y * 2.0);

  // Color: translucent body + Fresnel rim glow
  vec3 color = mix(bodyColor, glowColor, fresnel * 0.8);
  color += glowColor * innerGlow * vBellFactor;

  // Tentacle glow: faint edge-only luminescence
  float tentacleGlow = (1.0 - vBellFactor) * fresnel * 0.5;

  // Alpha: translucent body with glowing rim, per-instance opacity
  // Ghost species (>0.90) nearly invisible, blood-red most opaque
  float alpha = vBellFactor * (0.25 + fresnel * 0.6) + tentacleGlow;
  alpha *= vOpacityScale;

  // Brightness pulse — per-species rate (not all jellyfish pulse in sync)
  float pulse = 0.85 + 0.15 * sin(uTime * pulseSpeed + vWorldPos.x * 0.5);

  gl_FragColor = vec4(color * pulse, alpha * uBrightness);
}
