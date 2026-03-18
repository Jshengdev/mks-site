// Ice spike vertex shader — instanced translucent spikes with subtle sway
// ConeGeometry(1,1,6) translated so origin is at base (y: 0→1)
// Instance matrix sets position, rotation, scale per spike
uniform float uTime;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying float vHeightFraction;

void main() {
  // Instance matrix positions + scales each spike
  vec4 worldPosition = instanceMatrix * vec4(position, 1.0);

  // Very subtle sway — ice is frozen stiff but not perfectly rigid
  // Increases with height (position.y in cone is 0→1, scaled by instance)
  float swayPhase = worldPosition.x * 0.2 + worldPosition.z * 0.15;
  float sway = sin(uTime * 0.3 + swayPhase) * 0.015;
  worldPosition.x += sway * position.y;
  worldPosition.z += sway * 0.6 * position.y;

  vec4 mvPosition = viewMatrix * worldPosition;
  vViewPosition = mvPosition.xyz;
  vWorldPosition = worldPosition.xyz;

  // Normal from instance rotation (ignores scale for proper lighting)
  vNormal = normalize(mat3(instanceMatrix) * normal);

  // Height fraction: cone geometry after translate(0, 0.5, 0) → y: 0→1
  vHeightFraction = position.y;

  gl_Position = projectionMatrix * mvPosition;
}
