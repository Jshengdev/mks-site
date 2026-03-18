// Origami grass vertex shader — angular paper blades
// Adapted from Nitash-Biswas/grass-shader-glsl billboard rotation
// Stripped to bare essentials: paper is RIGID, barely moves

uniform float uTime;

varying vec3 vNormal;
varying vec3 vPosition;

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

mat3 rotationY(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

void main() {
  vec3 pos = position;
  float hash = rand(vec2(instanceMatrix[3].x, instanceMatrix[3].z));

  // Paper flutter — stiff angular snap, not smooth sway
  // Only blade tips move, and barely (paper is rigid)
  float flutter = sin(uTime * 1.2 + hash * 20.0) * 0.015 * pos.y;
  pos.x += flutter;

  // Occasional crinkle — sharp snap back (paper catching wind)
  float crinkle = step(0.94, sin(uTime * 0.25 + hash * 50.0));
  pos.z += crinkle * 0.025 * pos.y;

  // Billboard to camera (from Nitash-Biswas)
  vec3 camPos = inverse(viewMatrix)[3].xyz;
  vec3 bladeWorldPos = instanceMatrix[3].xyz;
  vec2 toCamera2D = normalize(camPos.xz - bladeWorldPos.xz);
  float angleToCamera = atan(toCamera2D.y, toCamera2D.x);
  mat3 billboardRot = rotationY(angleToCamera);
  pos = billboardRot * pos;

  vec4 worldPosition = instanceMatrix * vec4(pos, 1.0);
  vPosition = worldPosition.xyz;

  // Flat face normals — each triangle face is a paper surface
  // Billboard rotation applied to normal so lighting matches orientation
  vNormal = normalize(mat3(instanceMatrix) * billboardRot * normal);

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
