// Glowing mushroom fragment shader — bioluminescent pulse
// Adapted from:
//   stemkoski — Schlick's fresnel edge glow
//   ektogamat/fake-glow-material — glowInternalRadius=6.0, falloffAmount=0.1
//   Alex-DG bioluminescence pattern — chemical pulse cycling
//
// The cap glows. The stem is dark. Life from the underground.

uniform vec3 uGlowColor;        // bioluminescent color (from config)
uniform vec3 uStemColor;         // dark stem color
uniform float uBrightness;      // atmosphere-driven brightness
uniform float uPulseIntensity;  // 0.3 — max brightness swing

varying vec3 vNormal;
varying vec3 vPosition;
varying float vFresnel;
varying float vPulse;
varying float vCapMask;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(cameraPosition - vPosition);

  // Fresnel edge glow — brighter at edges (ektogamat pattern)
  float glow = pow(vFresnel, 3.0) * 1.5;

  // Pulsing emission — cap only, stem stays dark
  float pulse = vPulse * uPulseIntensity * vCapMask;

  // Cap color: emissive glow + fresnel edge + pulse
  vec3 capColor = uGlowColor * (0.6 + pulse + glow);

  // Stem color: dark, just ambient
  vec3 stemColor = uStemColor * 0.3;

  // Mix based on cap mask
  vec3 col = mix(stemColor, capColor, vCapMask);

  // Dim fresnel rim on stem too (subtle — mushroooms catch light at edges)
  col += uGlowColor * vFresnel * 0.15 * (1.0 - vCapMask);

  col *= uBrightness;

  gl_FragColor = vec4(col, 1.0);
}
