// Snow vertex shader — gentle falling particles with sinusoidal drift
// Adapted from SahilK-027/Elemental-Serenity SnowSystem
// Key differences from rain: 10x slower fall, 3x more lateral drift, round not streaked
// Magic values: X sway freq 0.8, Z sway freq 0.6, sway strength 0.3 (Elemental-Serenity)
uniform float uTime;
uniform float uPixelRatio;

attribute float aPhase;
attribute float aSpeed;
attribute float aSize;

varying float vAlpha;
varying float vHeight;

void main() {
  // Snowflake lifecycle — slow fall with wrap-around
  // Fall speed ~10x slower than rain (rain cycleTime=2.0)
  float cycleTime = 20.0;
  float t = mod(uTime * aSpeed * 0.12 + aPhase * cycleTime, cycleTime) / cycleTime;

  vec3 pos = position;
  pos.y = mix(30.0, -2.0, t); // fall from 30m to ground

  // Sinusoidal drift — snow drifts lazily (Elemental-Serenity values)
  // X freq=0.8, Z freq=0.6, strength=2.5 (world units, scaled from 0.3 * bounds)
  float drift = uTime * 0.25;
  pos.x += sin(drift * 0.8 + aPhase * 6.28) * 2.5;
  pos.z += cos(drift * 0.6 + aPhase * 3.14) * 1.8;

  // Vertical bobble — snow undulates gently as it falls
  // freq=2.0, amp=0.05 (Elemental-Serenity), scaled up for world units
  pos.y += sin(uTime * 0.4 + pos.x * 0.1) * 0.15;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  // Round point particles — perspective scaled
  gl_PointSize = aSize * uPixelRatio * (250.0 / -mvPosition.z);
  gl_PointSize = clamp(gl_PointSize, 1.0, 10.0);

  gl_Position = projectionMatrix * mvPosition;

  // Fade at spawn (top) and ground (bottom)
  vAlpha = smoothstep(0.0, 0.05, t) * smoothstep(1.0, 0.90, t);
  // Distance fade — disappear in far fog
  vAlpha *= smoothstep(200.0, 30.0, -mvPosition.z);
  // Height for aurora color response (higher flakes catch more aurora)
  vHeight = pos.y;
}
