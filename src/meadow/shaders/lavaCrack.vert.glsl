// Lava crack vertex shader — terrain-placed glowing fissures
// Crack strips sit on the terrain surface with slight Y offset
// Passes world position to fragment for FBM-based glow pattern
varying vec2 vUv;
varying vec3 vWorldPos;

void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
