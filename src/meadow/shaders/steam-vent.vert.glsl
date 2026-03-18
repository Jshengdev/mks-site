// Steam vent particles — adapted from stemkoski/ParticleEngine + SqrtPapere/SmokeGL
// Particles rise from ground vents, expand, drift laterally, fade out
uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;

attribute float aLifeOffset;
attribute float aSpeed;

varying float vLife;

void main() {
  // Looping lifecycle: each particle has staggered birth via aLifeOffset
  float period = 4.0; // seconds per full cycle
  float life = fract(uTime / period + aLifeOffset);
  vLife = life;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Rise: quadratic acceleration upward (stemkoski smoke pattern)
  float rise = life * life * aSpeed * 6.0;
  modelPosition.y += rise;

  // Lateral drift: sinusoidal with per-particle phase (SqrtPapere spiral)
  float drift = life * 2.0;
  float phase = aLifeOffset * 6.283;
  modelPosition.x += sin(uTime * 0.8 + phase) * drift * 0.4;
  modelPosition.z += cos(uTime * 0.6 + phase * 1.3) * drift * 0.3;

  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  // Size grows as steam expands (stemkoski sizeTween: 32→128)
  float sizeScale = 1.0 + life * 4.0;
  gl_PointSize = uSize * sizeScale * uPixelRatio;
  gl_PointSize *= (1.0 / -viewPosition.z);
}
