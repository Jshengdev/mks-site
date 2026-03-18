// Rotating gear instances — adapted from EmptySamurai/GearTrain
// Each instance rotates at its own speed around local Z axis (face normal)
// Gear shape lives in XY plane, extruded along Z
uniform float uTime;
attribute float aRotationSpeed;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // Spin around local Z axis (gear face normal)
  float angle = uTime * aRotationSpeed;
  float s = sin(angle);
  float c = cos(angle);

  vec3 pos = vec3(
    position.x * c - position.y * s,
    position.x * s + position.y * c,
    position.z
  );

  vec3 norm = vec3(
    normal.x * c - normal.y * s,
    normal.x * s + normal.y * c,
    normal.z
  );

  vec4 worldPosition = modelMatrix * instanceMatrix * vec4(pos, 1.0);
  vPosition = worldPosition.xyz;
  vNormal = normalize(mat3(instanceMatrix) * norm);

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
