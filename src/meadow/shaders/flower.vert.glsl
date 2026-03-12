// Simplified wind from grass system (gentle sway only)
// Uses instanceMatrix for InstancedMesh rendering
uniform float uTime;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 pos = position;

  // Gentle sway (only top vertices move, based on height)
  float sway = sin(uTime * 0.8 + position.x * 5.0) * 0.05 * pos.y;
  pos.x += sway;
  pos.z += sway * 0.5;

  vec4 worldPosition = modelMatrix * instanceMatrix * vec4(pos, 1.0);
  vPosition = worldPosition.xyz;
  vNormal = normalize(mat3(instanceMatrix) * normal);

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
