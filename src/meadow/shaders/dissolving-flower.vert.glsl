// Dissolving flower vertex shader — InstancedMesh with lifecycle animation
// Stolen noise from transition.frag.glsl (Inigo Quiléz hash), wind from Nitash-Biswas
// Each instance has a unique lifecycle phase via aLifecyclePhase attribute
uniform float uTime;

attribute float aLifecyclePhase; // 0-1 unique phase offset per instance

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vLocalPos;       // for dissolve noise in fragment
varying float vLifecycle;     // 0→1 lifecycle progress (bloom→dissolve)
varying float vScale;         // instance scale for fragment

void main() {
  // Lifecycle: each flower cycles through bloom→hold→dissolve→respawn
  // cyclePeriod = 8 seconds, staggered by aLifecyclePhase
  float cyclePeriod = 8.0;
  float t = fract(uTime / cyclePeriod + aLifecyclePhase);
  vLifecycle = t;

  // Scale animation: grow in (0-0.2), hold (0.2-0.6), shrink+dissolve (0.6-1.0)
  float growIn = smoothstep(0.0, 0.2, t);
  float shrinkOut = 1.0 - smoothstep(0.6, 0.85, t);
  float scaleAnim = growIn * shrinkOut;

  vec3 pos = position;

  // Gentle sway — heavier than normal flowers (weighted down, dying)
  float sway = sin(uTime * 0.5 + pos.x * 3.0 + aLifecyclePhase * 6.28) * 0.08 * pos.y;
  float droop = -pos.y * pos.y * 0.05 * (1.0 - shrinkOut * 0.5); // droop as dissolving
  pos.x += sway;
  pos.y += droop;
  pos.z += sway * 0.4;

  // Apply lifecycle scale
  pos *= scaleAnim;

  vec4 worldPosition = modelMatrix * instanceMatrix * vec4(pos, 1.0);
  vPosition = worldPosition.xyz;
  vLocalPos = position; // unscaled local position for noise
  vNormal = normalize(mat3(instanceMatrix) * normal);
  vScale = scaleAnim;

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
