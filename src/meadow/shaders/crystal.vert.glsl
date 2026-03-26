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
varying float vInstancePhase;   // per-crystal phase offset for emissive pulsing

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

  // Per-instance phase from world position — each crystal hums differently
  // Derived from instanceMatrix translation (unique per placement)
  vec3 instancePos = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
  float instancePhase = fract(sin(dot(instancePos.xz, vec2(12.9898, 78.233))) * 43758.5453);
  vInstancePhase = instancePhase;

  // Crystal hum — layered sine displacement along normal
  // Two detuned frequencies create organic resonance (spite pattern)
  // instancePhase offsets each crystal's resonance cycle
  float hum = sin(pos.y * uHumFrequency + uTime * 12.0 + instancePhase * 6.28318) * uHumIntensity;
  hum += sin(pos.y * uHumFrequency * 2.3 + uTime * 7.0 + instancePhase * 3.14) * uHumIntensity * 0.5;

  // Low-frequency turbulence wobble — slow crystal breathing
  float turb = noise3D(pos * 0.5 + uTime * 0.3 + instancePhase) * 0.02;
  pos += normal * (hum + turb);

  // Normalized height for fragment shader gradient (0 = base, 1 = tip)
  // Crystal geometry: Y range from 0 to height, tip is top
  vHeight = clamp(position.y, 0.0, 1.0);

  vec4 worldPosition = modelMatrix * instanceMatrix * vec4(pos, 1.0);
  vPosition = worldPosition.xyz;
  vNormal = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
  vWorldNormal = vNormal;

  // Fresnel — Schlick's approximation (shared _rim-light.glsl)
  vec3 viewDir = normalize(cameraPosition - worldPosition.xyz);
  vFresnel = fresnelRim(vWorldNormal, viewDir, 3.0);

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
