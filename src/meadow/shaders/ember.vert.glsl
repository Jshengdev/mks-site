// Ember particle vertex shader — rising ash/sparks from lava lake
// Adapted from Alex-DG firefly system (firefly.vert.glsl) + yomotsu/three-particle-fire
// Key difference: embers RISE (positive Y drift) instead of bob (sin oscillation)
// They also cool as they rise — size shrinks, brightness fades
uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute float aPhase;   // per-particle random phase (0-1)
attribute float aLifetime; // per-particle lifetime multiplier

// Simple hash noise for drift turbulence (stolen from L16 fBM pattern)
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

varying float vAge;       // 0=newborn, 1=dead — drives color/alpha fade
varying float vBrightness;

void main() {
  float time = uTime * 0.001;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // ─── Rising motion ───
  // Each ember has a looping lifecycle based on its phase
  // fract() creates the loop — ember rises, resets, rises again
  float cycleTime = fract(time * 0.15 * aLifetime + aPhase);
  vAge = cycleTime; // 0=just born from lava, 1=about to die

  // Vertical rise — fast initial burst, then decelerating (sqrt curve)
  // Embers rise 15-25 units before dying
  float riseHeight = sqrt(cycleTime) * 20.0 * aLifetime;
  modelPosition.y += riseHeight;

  // ─── Horizontal drift (thermal turbulence) ───
  // More turbulent than fireflies — volcanic updrafts are chaotic
  float turb = noise3D(modelPosition.xyz * 0.08 + time * 0.2) * 0.8
             + noise3D(modelPosition.xyz * 0.15 + time * 0.3) * 0.4;
  modelPosition.x += turb * aScale * 1.5;
  modelPosition.z += turb * aScale * 1.2;

  // Slight spiral — thermal column rotation
  float angle = cycleTime * 3.14159 * 2.0 * aPhase;
  float spiralR = cycleTime * 2.0;
  modelPosition.x += sin(angle) * spiralR * 0.3;
  modelPosition.z += cos(angle) * spiralR * 0.3;

  // ─── Size fade ───
  // Embers shrink as they cool and die
  float sizeFade = 1.0 - cycleTime * 0.7; // shrinks to 30% at death
  vBrightness = sizeFade;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;
  gl_PointSize = uSize * aScale * sizeFade * uPixelRatio;
  gl_PointSize *= (1.0 / -viewPosition.z);
}
