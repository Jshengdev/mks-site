// Lava lake vertex shader — slow magma heave displacement
// Adapted from thaslle/stylized-water vertex approach (ocean.vert.glsl)
// Slower, heavier motion than water — magma is viscous
uniform float uTime;
uniform float uHeaveAmplitude; // 0.3 — magma breathes slowly
uniform float uHeaveSpeed;     // 0.4 — glacial, viscous

varying vec2 vUv;
varying vec3 vWorldPos;

void main() {
  vUv = uv;

  vec3 pos = position;

  // Slow magma heave — the whole surface breathes
  // Stolen from thaslle: simple sine for calm water, slowed 3x for viscous magma
  pos.y += sin(uTime * uHeaveSpeed) * uHeaveAmplitude;

  // Per-vertex magma convection cells — slower, broader than ocean waves
  // Two overlapping sine waves create irregular bulging
  float heave1 = sin(pos.x * 0.04 + uTime * 0.15) * 0.25;
  float heave2 = cos(pos.z * 0.035 + uTime * 0.1) * 0.18;
  // Third frequency: very slow long-wavelength undulation (convection current)
  float convection = sin(pos.x * 0.015 - pos.z * 0.02 + uTime * 0.08) * 0.4;
  pos.y += heave1 + heave2 + convection;

  vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
