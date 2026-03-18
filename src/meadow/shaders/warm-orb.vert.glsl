// Warm light orb vertex shader — Stemkoski glow technique
// Gentle pulsing scale + data for fresnel in fragment
// Adapted from stemkoski/Shader-Glow.html
uniform float uTime;

attribute float aPhase;
attribute float aPulseSpeed;

varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  // Gentle scale pulsing (breathing warm light)
  float pulse = 1.0 + sin(uTime * aPulseSpeed + aPhase) * 0.15;
  vec3 pos = position * pulse;

  vec4 worldPos = modelMatrix * instanceMatrix * vec4(pos, 1.0);

  // World-space normal and view direction for fresnel
  vNormal = normalize(mat3(instanceMatrix) * normal);
  vViewDir = normalize(cameraPosition - worldPos.xyz);

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
