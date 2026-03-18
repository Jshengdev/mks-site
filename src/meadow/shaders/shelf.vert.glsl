// Floating shelf vertex shader — glacial rotation
// Impossible angles drifting slowly (Escher library geometry)
// Quaternion rotation stolen from zadvorsky/three.bas
uniform float uTime;

attribute float aPhase;
attribute float aRotSpeed;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec3 vLocalPos;

// Quaternion rotation (stolen from zadvorsky/three.bas)
vec3 rotateVector(vec4 q, vec3 v) {
  return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

vec4 quatFromAxisAngle(vec3 axis, float angle) {
  float halfAngle = angle * 0.5;
  return vec4(axis * sin(halfAngle), cos(halfAngle));
}

void main() {
  vec3 pos = position;
  vec3 n = normal;

  // Glacial Y-rotation — shelves slowly drift in impossible orientations
  float yAngle = uTime * aRotSpeed + aPhase;
  vec4 qY = quatFromAxisAngle(vec3(0.0, 1.0, 0.0), yAngle);
  pos = rotateVector(qY, pos);
  n = rotateVector(qY, n);

  vec4 worldPos = modelMatrix * instanceMatrix * vec4(pos, 1.0);

  vNormal = normalize(mat3(instanceMatrix) * n);
  vWorldPos = worldPos.xyz;
  vLocalPos = position; // un-rotated for edge detection

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
