// Slow drifting particles catching sunlight (stolen from L16 patterns)
uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;

attribute float aScale;
attribute float aPhase;

varying float vAlpha;

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
  float time = uTime * 0.0003; // very slow drift
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Slow turbulent drift (stolen from L16 fBM pattern)
  float turb = noise3D(modelPosition.xyz * 0.03 + time + aPhase) * 1.5;
  modelPosition.x += turb;
  modelPosition.y += sin(time * 500.0 + aPhase) * 0.3 * aScale;
  modelPosition.z += noise3D(modelPosition.zxy * 0.04 + time * 0.7) * 1.0;

  // Alpha: more visible mid-air, fade near ground and high up
  vAlpha = smoothstep(0.0, 0.5, modelPosition.y) * smoothstep(4.0, 2.5, modelPosition.y);

  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
  gl_PointSize = uSize * aScale * uPixelRatio;
  gl_PointSize *= (1.0 / -viewPosition.z);
}
