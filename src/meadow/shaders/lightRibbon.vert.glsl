// Light ribbon — CPU positions the ribbon, shader adds shimmer
// Stolen from: Codrops high-speed light trails (sinusoidal distortion),
// mkkellogg TrailRendererJS (trail fade UV mapping)
uniform float uTime;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
