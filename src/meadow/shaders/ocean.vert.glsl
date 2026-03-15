// Stylized ocean vertex shader — gentle wave displacement
// Adapted from thaslle/stylized-water vertex approach
// Uses sine waves for gentle bob motion
uniform float uTime;
uniform float uBobAmplitude;
uniform float uBobSpeed;

varying vec2 vUv;
varying vec3 vWorldPos;

void main() {
  vUv = uv;

  vec3 pos = position;

  // Gentle bob — whole plane rises and falls
  // Stolen from thaslle: simple sine for calm water
  pos.y += sin(uTime * uBobSpeed) * uBobAmplitude;

  // Subtle per-vertex wave displacement for surface variation
  float wave1 = sin(pos.x * 0.08 + uTime * 0.5) * 0.15;
  float wave2 = cos(pos.z * 0.06 + uTime * 0.3) * 0.1;
  pos.y += wave1 + wave2;

  vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
