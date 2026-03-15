// Bubble particle vertex shader — rising bubbles in the Tide Pool
// Simple point sprites that rise slowly with horizontal wobble
// Adapted from: dust.vert.glsl pattern (point particles with size attenuation)

attribute float aScale;
attribute float aPhase;

uniform float uTime;
uniform float uPixelRatio;
uniform float uRiseSpeed;         // 0.5 world units/sec
uniform float uWobbleFrequency;   // 2.0
uniform float uWobbleAmplitude;   // 0.3
uniform float uSurfaceHeight;     // respawn when reaching surface

varying float vAlpha;

void main() {
  float time = uTime;

  // Rise: bubble position.y increases with time, wraps at surface
  float cycleTime = uSurfaceHeight / uRiseSpeed;
  float t = mod(time + aPhase * cycleTime, cycleTime);
  float riseY = t * uRiseSpeed;

  // Horizontal wobble — sinusoidal path
  float wobbleX = sin(time * uWobbleFrequency + aPhase * 6.28) * uWobbleAmplitude;
  float wobbleZ = cos(time * uWobbleFrequency * 0.7 + aPhase * 4.71) * uWobbleAmplitude * 0.6;

  vec3 pos = position;
  pos.y += riseY;
  pos.x += wobbleX;
  pos.z += wobbleZ;

  // Fade in at bottom, fade out near surface
  float normalizedY = riseY / uSurfaceHeight;
  vAlpha = smoothstep(0.0, 0.1, normalizedY) * smoothstep(1.0, 0.85, normalizedY);

  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);

  // Size: slightly larger as they rise (expanding gas)
  float sizeGrow = 1.0 + normalizedY * 0.5;
  gl_PointSize = (30.0 + aScale * 40.0) * sizeGrow * uPixelRatio * (150.0 / -mvPos.z);
  gl_Position = projectionMatrix * mvPos;
}
