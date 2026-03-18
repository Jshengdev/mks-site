// Stolen from stemkoski glow sphere + danieldelcore breathing icosahedron
// + ektogamat fake-glow-material Fresnel
// InstancedMesh — instanceMatrix auto-injected by Three.js
uniform float uTime;
uniform float uPulseIntensity;

attribute float aPhase;
attribute float aBaseScale;

varying float vFresnel;
varying float vPulse;

void main() {
  // Sin-wave breathing (danieldelcore: speed ~1.2, amplitude 0.5)
  float pulse = 1.0 + sin(uTime * 1.2 + aPhase * 6.28) * 0.5 * uPulseIntensity;
  // Secondary harmonic for organic feel (kuhung pattern)
  pulse += sin(uTime * 2.7 + aPhase * 3.14) * 0.15 * uPulseIntensity;
  vPulse = pulse;

  // Scale vertex by pulse and per-instance base scale
  vec3 scaled = position * pulse * aBaseScale;

  // Apply instance transform (world position)
  vec4 worldPos = modelMatrix * instanceMatrix * vec4(scaled, 1.0);
  vec4 mvPosition = viewMatrix * worldPos;

  // Fresnel: edge glow from view angle
  // (stemkoski: pow(c - dot(N, V), p), c=1.0, p=2.0)
  vec3 worldNormal = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
  vec3 viewDir = normalize(cameraPosition - worldPos.xyz);
  vFresnel = pow(1.0 - max(dot(worldNormal, viewDir), 0.0), 2.0);

  gl_Position = projectionMatrix * mvPosition;
}
