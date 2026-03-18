// Ember vertex shader — rising sparks with luminous trails
// Stolen from simondevyoutube/ThreeJS_Tutorial_ParticleSystems (age-based sizing)
// + al-ro curl noise drift pattern + Alex-DG firefly base
// Trail physics: screen-space anisotropic glow stretches behind each particle
// Young fast embers = long bright trails, old slow embers = round fading dots
uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;
uniform float uRiseSpeed;
uniform float uSpawnHeight;    // Y floor where embers are born (lava surface)
uniform float uCeilingHeight;  // Y ceiling where embers die

attribute float aScale;
attribute float aPhase;        // per-particle random phase (0-1)
attribute float aLifetime;     // per-particle lifetime multiplier

varying float vAge;            // 0=newborn (hot), 1=dead (cool) → drives color ramp
varying float vBrightness;
varying vec2 vTrailDir;        // motion direction in pointCoord space
varying float vTrailLen;       // trail elongation (0=round dot, 1=max streak)

// Hash noise stolen from al-ro/grass
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

  // Looping lifecycle — fract() creates seamless cycle per particle
  // uRiseSpeed controls how fast embers traverse spawn→ceiling
  float cycleTime = fract(time * uRiseSpeed * aLifetime + aPhase);
  vAge = cycleTime;

  // Vertical rise — sqrt curve gives fast initial burst, then deceleration
  // Configurable height range for caldera geometry
  float totalHeight = uCeilingHeight - uSpawnHeight;
  float riseHeight = sqrt(cycleTime) * totalHeight * aLifetime;
  modelPosition.y = uSpawnHeight + riseHeight;

  // Horizontal drift — thermal turbulence from al-ro curl noise concept
  float turb = noise3D(modelPosition.xyz * 0.08 + time * 0.2) * 0.8
             + noise3D(modelPosition.xyz * 0.15 + time * 0.3) * 0.4;
  modelPosition.x += turb * aScale * 1.5;
  modelPosition.z += turb * aScale * 1.2;

  // Thermal column spiral — stolen from simondev rotation concept
  float angle = cycleTime * 6.28318 * aPhase;
  float spiralR = cycleTime * 2.0;
  modelPosition.x += sin(angle) * spiralR * 0.3;
  modelPosition.z += cos(angle) * spiralR * 0.3;

  // Size fades as ember cools and dies
  float sizeFade = 1.0 - cycleTime * 0.7;
  vBrightness = sizeFade;

  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  // ─── Trail direction (screen-space → pointCoord-space) ───
  // Project world-space up vector at this particle's position to clip space
  // Gives correct trail orientation regardless of camera angle
  vec4 aboveWorld = modelPosition + vec4(0.0, 1.0, 0.0, 0.0);
  vec4 aboveClip = projectionMatrix * viewMatrix * aboveWorld;
  vec2 screenCurr = gl_Position.xy / gl_Position.w;
  vec2 screenAbove = aboveClip.xy / aboveClip.w;
  vec2 upDir = screenAbove - screenCurr;
  float upLen = length(upDir);
  // Flip Y for pointCoord space (screen Y-up → pointCoord Y-down)
  vTrailDir = upLen > 0.001
    ? vec2(upDir.x, -upDir.y) / upLen
    : vec2(0.0, -1.0);

  // Trail length proportional to speed — derivative of sqrt(t) = 0.5/sqrt(t)
  // Young embers (small cycleTime) are fast → long trails
  // Old embers (large cycleTime) are slow → round dots
  float speed = 0.5 / (sqrt(max(cycleTime, 0.02)) + 0.1);
  vTrailLen = clamp(speed * 0.7, 0.0, 1.0);

  // Point size stretched to accommodate trail behind particle
  float trailScale = 1.0 + vTrailLen * 1.5;
  gl_PointSize = uSize * aScale * sizeFade * uPixelRatio * trailScale;
  gl_PointSize *= (1.0 / -viewPosition.z);
  gl_PointSize = clamp(gl_PointSize, 0.5, 36.0);
}
