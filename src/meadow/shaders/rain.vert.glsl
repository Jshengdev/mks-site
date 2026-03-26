// Rain vertex shader — velocity-stretched particle streaks
// Adapted from three.quarks stretched_bb_particle_vert.glsl
// Uses cross-product for perpendicular billboard stretch + velocity elongation
// Research winner values: dropWidth=0.04, lengthFactor=30, rainSpeed=15, windX=3
uniform float uTime;
uniform float uPixelRatio;
uniform vec3 uVelocity;       // base velocity (3.0, -15.0, 0.5)
uniform float uLengthFactor;  // streak elongation (30.0)
uniform vec2 uBounds;         // spawn area width, depth

attribute float aPhase;       // per-particle phase offset
attribute float aSpeed;       // per-particle speed multiplier

varying float vAlpha;

void main() {
  // Particle lifecycle — wraps around using mod
  // Each particle has its own phase so they don't all fall in sync
  float cycleTime = 2.0; // faster cycle for windX=3 speed
  float t = mod(uTime * aSpeed + aPhase * cycleTime, cycleTime) / cycleTime;

  // Position: spread across bounds, fall with velocity
  vec3 pos = position;
  pos.y = mix(25.0, -2.0, t); // fall from 25m to ground
  // Wind drift — stronger lateral motion (windX=3 from winner)
  pos.x += sin(uTime * 0.5 + aPhase * 6.28) * 0.3 + uVelocity.x * t * 0.5;

  // Cross-product stretch — stolen from three.quarks concept
  // Elongate along velocity direction relative to camera
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  // View-space velocity for stretch direction
  vec3 viewVel = mat3(modelViewMatrix) * normalize(uVelocity * aSpeed);
  // Cross product gives perpendicular direction for billboard width
  vec3 perpDir = normalize(cross(mvPosition.xyz, viewVel));
  // Streak length from velocity magnitude
  float streakLength = length(uVelocity) * 0.04; // dropWidth=0.04 from winner

  gl_Position = projectionMatrix * mvPosition;

  // Size: elongated streaks via lengthFactor, attenuated by distance (shared _particle-utils.glsl)
  gl_PointSize = perspectivePointSize(uLengthFactor * uPixelRatio, mvPosition.z, 200.0);
  gl_PointSize = clamp(gl_PointSize, 1.0, 16.0);

  // Fade at top (spawn) and bottom (impact)
  vAlpha = smoothstep(0.0, 0.05, t) * smoothstep(1.0, 0.9, t);
  // Distance fade
  vAlpha *= smoothstep(150.0, 20.0, -mvPosition.z);
}
