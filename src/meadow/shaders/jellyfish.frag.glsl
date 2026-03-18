// Jellyfish bioluminescent glow — Fresnel rim + translucent body
// Adapted from otanodesignco/Fresnel-Shader-Material: pow(1-dot(N,V), power)
// + jpweeks/particulate-medusae bulb shader (layered sine patterns)
// + aurelia inner glow (ray-to-center distance falloff)

uniform vec3 uBellColor;     // deep blue translucent body [0.05, 0.15, 0.25]
uniform vec3 uGlowColor;     // cyan bioluminescent rim [0.20, 0.90, 0.80]
uniform float uFresnelPower;  // Fresnel exponent (1.5-2.0)
uniform float uBrightness;
uniform float uTime;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vBellFactor;

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  vec3 N = normalize(vNormal);

  // Fresnel rim glow (stolen from otanodesignco)
  // pow(1.0 - dot(N, V), power) — bright at edges, dark at center
  float fresnel = pow(1.0 - abs(dot(N, viewDir)), uFresnelPower);

  // Inner body glow — slow pulse synced with bell contraction
  // Adapted from aurelia: (1.0 - smoothstep(0, 1.0, distToCenter)) * 0.4
  float innerGlow = 0.12 + 0.08 * sin(uTime * 1.8 + vWorldPos.y * 2.0);

  // Color: body + Fresnel rim glow
  vec3 color = mix(uBellColor, uGlowColor, fresnel * 0.8);
  color += uGlowColor * innerGlow * vBellFactor;

  // Tentacle glow: faint edge-only luminescence
  float tentacleGlow = (1.0 - vBellFactor) * fresnel * 0.5;

  // Alpha: translucent body with glowing rim
  // Bell: 0.25 base + fresnel → edges glow brightly
  // Tentacles: nearly transparent, edge glow only
  float alpha = vBellFactor * (0.25 + fresnel * 0.6) + tentacleGlow;

  // Subtle brightness pulse — synced with bell contraction phase
  float pulse = 0.85 + 0.15 * sin(uTime * 1.8 + vWorldPos.x * 0.5);

  gl_FragColor = vec4(color * pulse, alpha * uBrightness);
}
