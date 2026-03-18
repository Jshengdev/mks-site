// Crystal formation vertex shader — hexagonal prism instancing
// Adapted from spite/vertex-displacement-noise-3d-webgl-glsl-three-js
// Vibration/hum animation: high-frequency displacement along normals
// Uses instanceMatrix for InstancedMesh rendering (same pattern as flower.vert.glsl)

uniform float uTime;
uniform float uHumIntensity;   // 0.02 — subtle crystal vibration
uniform float uHumFrequency;   // 8.0  — high-freq crystal resonance

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldNormal;
varying float vFresnel;
varying float vHeight;          // normalized height for color gradient

// Simple hash noise — stolen from L16 fBM pattern (via firefly.vert.glsl)
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
  vec3 pos = position;

  // Crystal hum — layered sine displacement along normal
  // Two detuned frequencies create organic resonance (spite pattern)
  float hum = sin(pos.y * uHumFrequency + uTime * 12.0) * uHumIntensity;
  hum += sin(pos.y * uHumFrequency * 2.3 + uTime * 7.0) * uHumIntensity * 0.5;

  // Low-frequency turbulence wobble — slow crystal breathing
  float turb = noise3D(pos * 0.5 + uTime * 0.3) * 0.02;
  pos += normal * (hum + turb);

  // Normalized height for fragment shader gradient (0 = base, 1 = tip)
  // Crystal geometry: Y range from 0 to height, tip is top
  vHeight = clamp(position.y, 0.0, 1.0);

  vec4 worldPosition = modelMatrix * instanceMatrix * vec4(pos, 1.0);
  vPosition = worldPosition.xyz;
  vNormal = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
  vWorldNormal = vNormal;

  // Fresnel — Schlick's approximation (stemkoski pattern)
  vec3 viewDir = normalize(cameraPosition - worldPosition.xyz);
  vFresnel = pow(1.0 - max(dot(viewDir, vWorldNormal), 0.0), 3.0);

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
