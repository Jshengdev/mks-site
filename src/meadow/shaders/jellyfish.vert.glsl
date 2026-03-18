// Jellyfish bell + tentacle animation
// Adapted from arodic/Chrysaora asymmetric pulse technique
// Bell: radial contraction/expansion modulated by Y (rim moves more)
// Tentacles: depth-dependent wave propagation
// Phase offset per instance from instanceMatrix position

uniform float uTime;

// Per-instance species variation (InstancedBufferAttribute)
attribute float aColorIndex;   // 0-1 → maps to 5 deep-sea species in frag shader
attribute float aOpacityScale; // 0.25-1.0 → per-instance transparency

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vBellFactor;
varying float vColorIndex;
varying float vOpacityScale;

void main() {
  // Extract instance position for per-jellyfish phase offset
  vec3 instancePos = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
  float phase = instancePos.x * 0.37 + instancePos.z * 0.23 + instancePos.y * 0.41;

  vec3 pos = position;

  // Determine bell vs tentacle by Y position (bell y>0, tentacles y<0)
  float bellFactor = smoothstep(-0.1, 0.1, pos.y);
  vBellFactor = bellFactor;
  vColorIndex = aColorIndex;
  vOpacityScale = aOpacityScale;

  // --- BELL PULSE (y > 0) ---
  // Adapted from Chrysaora: asymmetric sine — fast contraction, slow expansion
  // "time = mod(uTime + posY * 1.50, TAU)" — wave propagates down the bell
  float t = uTime * 1.8 + phase;
  float pulse = sin(t);
  // Asymmetric: contraction amplitude 0.18, expansion 0.10 (fast in, slow out)
  float contraction = pulse > 0.0 ? pulse * 0.18 : pulse * 0.10;

  // Radial displacement — more at rim (low Y), less at top (high Y)
  // "offset = smoothstep(0, 1, max(0, -posY - 0.8) / 10.0)" from Chrysaora
  float rimFactor = smoothstep(0.65, 0.0, pos.y);
  vec2 radialDir = normalize(pos.xz + vec2(0.001));
  pos.xz += radialDir * contraction * rimFactor * bellFactor;

  // Slight vertical compression during contraction (bell squashes)
  pos.y += contraction * 0.05 * bellFactor;

  // Scalloped rim modulation — 8 riffles around circumference
  // Adapted from holtsetio/aurelia: sin(azimuth * 16) * 0.02
  float azimuth = atan(pos.z, pos.x);
  float riffle = sin(azimuth * 8.0 + phase) * 0.03 * rimFactor * bellFactor;
  pos.xz += radialDir * riffle;

  // --- TENTACLE WAVE (y < 0) ---
  // Adapted from particulate-medusae: depth-dependent wave propagation
  // Deeper = more displacement (tentacle tips swing wider)
  float depth = max(0.0, -pos.y);
  float tentWave = sin(uTime * 1.2 + phase + depth * 2.5) * 0.12 * depth;
  pos.x += tentWave * (1.0 - bellFactor);
  pos.z += cos(uTime * 0.9 + phase * 1.7 + depth * 1.8) * 0.08 * depth * (1.0 - bellFactor);

  // Apply instance transform
  vec4 worldPos = modelMatrix * instanceMatrix * vec4(pos, 1.0);
  vWorldPos = worldPos.xyz;

  // Transform normal through instance + model matrices
  mat3 normalMat = mat3(modelMatrix) * mat3(instanceMatrix);
  vNormal = normalize(normalMat * normal);

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
