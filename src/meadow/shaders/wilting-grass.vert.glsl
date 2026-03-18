// Wilting grass vertex shader — heavy drooping blades with golden-brown tips
// Wind stolen from Nitash-Biswas grass-shader-glsl (4-layer deform)
// Droop physics: gravity pulls blade tips down quadratically with height
uniform float uTime;
uniform float uWindSpeed;
uniform float uDroopStrength;  // 0-1 how much blades droop (0.6 = heavy wilt)

attribute float aScale;
attribute float aPhase;

varying float vHeight;        // 0=root, 1=tip — for color gradient
varying vec3 vWorldPos;

// Stolen from Nitash-Biswas (hash noise for wind variation)
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
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  float heightFactor = position.y; // 0 at root, ~1 at tip
  vHeight = heightFactor;

  // ─── Wind (slow, sighing — stolen from Nitash-Biswas 4-layer wind) ───
  float windNoise = noise3D(worldPos.xyz * 0.05 + uTime * uWindSpeed * 0.3);
  float windBend = sin(uTime * uWindSpeed * 0.4 + worldPos.x * 0.3 + aPhase * 6.28)
                 * heightFactor * heightFactor  // quadratic: only tips move
                 * 0.15                         // amplitude
                 * (0.5 + windNoise * 0.5);     // noise modulation

  worldPos.x += windBend;
  worldPos.z += windBend * 0.3;

  // ─── Droop (gravity pulling tips down — the defining visual) ───
  // Quadratic droop: tips hang low, creating heavy arcs
  // Each blade droops slightly differently (aPhase adds variation)
  float droopVariation = 0.7 + hash(aPhase * 1000.0) * 0.6; // 0.7-1.3
  float droop = heightFactor * heightFactor * uDroopStrength * droopVariation;
  worldPos.y -= droop;

  // Extra lateral sag — drooping blades also lean sideways
  float sagDir = sin(aPhase * 37.7) * 2.0 - 1.0; // -1 or +1 lean direction
  worldPos.x += heightFactor * heightFactor * uDroopStrength * 0.15 * sagDir;

  vWorldPos = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
  gl_PointSize = aScale * 3.0; // for point-based rendering if needed
}
