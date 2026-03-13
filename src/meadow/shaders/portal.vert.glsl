varying vec2 vUv;
varying float vWorldY;

void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldY = worldPos.y;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
