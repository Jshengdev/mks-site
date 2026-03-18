// Copper leaf instances — metallic leaves with wind wobble
// Adapted from flower.vert.glsl sway pattern + mattatz/THREE.Tree branching
uniform float uTime;
attribute float aPhase;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 pos = position;

  // Wind-driven wobble — two frequencies for organic feel
  // Height-dependent: stronger at leaf tip (pos.y)
  float wobble = sin(uTime * 1.5 + aPhase * 6.283) * 0.08;
  float wobble2 = sin(uTime * 2.3 + aPhase * 4.1) * 0.04;
  pos.x += (wobble + wobble2) * pos.y;
  pos.z += wobble * 0.5 * pos.y;

  vec4 worldPosition = modelMatrix * instanceMatrix * vec4(pos, 1.0);
  vPosition = worldPosition.xyz;
  vNormal = normalize(mat3(instanceMatrix) * normal);

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
