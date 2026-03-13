// Upgraded from Alex-DG — phase fix + turbulence (stolen from L16)
uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

attribute float aScale;

// Simple hash noise for turbulence (stolen from L16 fBM pattern)
float hash(float n) { return fract(sin(n) * 43758.5453); }

float noise3D(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n = i.x + i.y * 157.0 + 113.0 * i.z;
  return mix(
    mix(mix(hash(n), hash(n+1.0), f.x), mix(hash(n+157.0), hash(n+158.0), f.x), f.y),
    mix(mix(hash(n+113.0), hash(n+114.0), f.x), mix(hash(n+270.0), hash(n+271.0), f.x), f.y),
    f.z
  );
}

void main() {
  float time = uTime * 0.001;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Phase fix: + aScale * 6.28 so each particle bobs differently
  // (stolen from L16: prevents phase aliasing at modelPosition.x * 100.0)
  modelPosition.y += sin(time + modelPosition.x * 100.0 + aScale * 6.28) * aScale * 0.2;

  // Turbulence field — slow 3D noise drift (stolen from L16 fBM)
  float turb = noise3D(modelPosition.xyz * 0.05 + time * 0.1) * 0.4
             + noise3D(modelPosition.xyz * 0.1 + time * 0.15) * 0.2;
  modelPosition.x += turb * aScale;
  modelPosition.z += turb * aScale * 0.7;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;
  gl_PointSize = uSize * aScale * uPixelRatio;
  gl_PointSize *= (1.0 / -viewPosition.z);
}
