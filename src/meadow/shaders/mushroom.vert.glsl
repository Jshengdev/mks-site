// Glowing mushroom vertex shader — bioluminescent cap + stem instancing
// Adapted from Alex-DG firefly pattern + stemkoski Schlick's fresnel
// Uses instanceMatrix for InstancedMesh (same pattern as flower.vert.glsl)

uniform float uTime;
uniform float uPulseSpeed;     // 1.5 — breathing rate

varying vec3 vNormal;
varying vec3 vPosition;
varying float vFresnel;
varying float vPulse;
varying float vCapMask;        // 1.0 for cap vertices, 0.0 for stem

void main() {
  vec3 pos = position;

  // Per-instance phase from world position — each mushroom pulses independently
  // Chemical reactions don't synchronize across organisms
  vec3 instancePos = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
  float instancePhase = fract(sin(dot(instancePos.xz, vec2(12.9898, 78.233))) * 43758.5453);

  // Cap mask — mushroom geometry: cap is top half (y > 0.15)
  vCapMask = smoothstep(0.12, 0.18, position.y);

  // Gentle cap sway — only top moves (same pattern as flower.vert.glsl)
  // instancePhase offsets sway so neighbors don't move in lockstep
  float sway = sin(uTime * 0.6 + position.x * 3.0 + instancePhase * 6.28318) * 0.03 * vCapMask;
  pos.x += sway;
  pos.z += sway * 0.7;

  // Bioluminescent pulse — layered sin waves for organic feel
  // Chemical reaction cycling: slow base + detuned harmonic
  // instancePhase gives each mushroom its own rhythm
  float pulse = 0.5 + 0.5 * sin(uTime * uPulseSpeed + instancePhase * 6.28318);
  pulse *= 0.7 + 0.3 * sin(uTime * uPulseSpeed * 0.37 + 1.7 + instancePhase * 3.14);
  vPulse = pulse;

  // Cap "breathing" — slight scale pulse on cap vertices
  pos.y += vCapMask * pulse * 0.008;

  vec4 worldPosition = modelMatrix * instanceMatrix * vec4(pos, 1.0);
  vPosition = worldPosition.xyz;
  vNormal = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);

  // Fresnel — Schlick's approximation (exponent 5.0 per Schlick standard)
  vec3 viewDir = normalize(cameraPosition - worldPosition.xyz);
  vFresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 5.0);

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
