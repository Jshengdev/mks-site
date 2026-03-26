// Marine snow — the endless rain of organic detritus from the surface
// Adapted from jpweeks/particulate-medusae plankton drift:
//   mod(y - time, area) for looping fall
//   sin(cos(y*0.1) + sin(y*0.1 + x*0.1) * 2.0) for sinusoidal wander
// + madmappersoftware/MadMapper-Materials MarineSnow.fs (3D hash field)
// Falls DOWNWARD very slowly — barely visible white specks

uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;
uniform float uFallSpeed;

attribute float aScale;
attribute float aPhase;

varying float vAlpha;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Vertical fall: looping over 20-unit column
  // Stolen from particulate-medusae: mod(y - time * speed, area)
  float area = 20.0;
  float y = mod(modelPosition.y - uTime * uFallSpeed + aPhase * area, area);
  modelPosition.y = y;

  // Sinusoidal wander as particles fall — not straight lines, organic drift
  // Stolen from particulate-medusae: sin(cos(y*0.1) + sin(y*0.1 + x*0.1) * 2.0)
  modelPosition.x += sin(cos(y * 0.1) + sin(y * 0.1 + position.x * 0.1) * 2.0) * 0.3;
  modelPosition.z += sin(cos(y * 0.15) + sin(y * 0.12 + position.z * 0.08) * 2.0) * 0.3;

  // Alpha: varies slightly with depth (catch bioluminescent light at different depths)
  vAlpha = 0.4 + 0.6 * sin(aPhase + y * 0.5);

  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  gl_PointSize = perspectivePointSize(uSize * aScale * uPixelRatio, viewPosition.z, 1.0);
}
