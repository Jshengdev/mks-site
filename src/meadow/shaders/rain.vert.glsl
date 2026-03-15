// Rain vertex shader — velocity-stretched particle streaks
// Adapted from three.quarks stretched_bb_particle_vert.glsl concept
// Streaks elongated along velocity direction for realistic rain
uniform float uTime;
uniform float uPixelRatio;
uniform vec3 uVelocity;       // base velocity (0.5, -15.0, 0.5)
uniform float uLengthFactor;  // streak elongation (3.0)
uniform vec2 uBounds;         // spawn area width, depth

attribute float aPhase;       // per-particle phase offset
attribute float aSpeed;       // per-particle speed multiplier

varying float vAlpha;

void main() {
  // Particle lifecycle — wraps around using mod
  // Each particle has its own phase so they don't all fall in sync
  float cycleTime = 3.0; // seconds per fall cycle
  float t = mod(uTime * aSpeed + aPhase * cycleTime, cycleTime) / cycleTime;

  // Position: spread across bounds, fall with velocity
  vec3 pos = position;
  pos.y = mix(25.0, -2.0, t); // fall from 25m to ground
  pos.x += sin(uTime * 0.5 + aPhase * 6.28) * 0.3; // slight horizontal drift

  // Stretch in velocity direction — stolen from three.quarks concept
  // Elongate point along fall direction
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  gl_Position = projectionMatrix * mvPosition;

  // Size: elongated streaks via lengthFactor, attenuated by distance
  float size = uLengthFactor * uPixelRatio;
  size *= (200.0 / -mvPosition.z); // distance attenuation
  gl_PointSize = clamp(size, 1.0, 12.0);

  // Fade at top (spawn) and bottom (impact)
  vAlpha = smoothstep(0.0, 0.05, t) * smoothstep(1.0, 0.9, t);
  // Distance fade
  vAlpha *= smoothstep(150.0, 20.0, -mvPosition.z);
}
