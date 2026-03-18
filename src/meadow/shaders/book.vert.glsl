// Floating book vertex shader — rotation + bob animation
// Quaternion rotation stolen from zadvorsky/three.bas
// Bob animation stolen from L16 patterns
uniform float uTime;

attribute float aPhase;
attribute float aBobSpeed;
attribute float aBobAmp;
attribute float aRotSpeed;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vSpineFactor;

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

  // Spine detection from local position (before transforms)
  // Spine vertices are near x=0, cover vertices are at |x| > 0.04
  vSpineFactor = 1.0 - smoothstep(0.01, 0.05, abs(position.x));

  // Slow Y-axis rotation (per-instance speed + phase)
  float yAngle = uTime * aRotSpeed + aPhase;
  vec4 qY = quatFromAxisAngle(vec3(0.0, 1.0, 0.0), yAngle);
  pos = rotateVector(qY, pos);
  n = rotateVector(qY, n);

  // Gentle static tilt (per-instance, derived from phase)
  float tiltAngle = sin(aPhase * 3.7) * 0.15; // ±8.6 degrees
  vec4 qX = quatFromAxisAngle(vec3(1.0, 0.0, 0.0), tiltAngle);
  pos = rotateVector(qX, pos);
  n = rotateVector(qX, n);

  vec4 worldPos = modelMatrix * instanceMatrix * vec4(pos, 1.0);

  // Gentle bob (per-instance speed + amplitude)
  worldPos.y += sin(uTime * aBobSpeed + aPhase) * aBobAmp;

  vNormal = normalize(mat3(instanceMatrix) * n);
  vWorldPos = worldPos.xyz;

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
