// Jellyfish bell + tentacle animation
// Adapted from arodic/Chrysaora asymmetric pulse technique
// Bell: radial contraction/expansion modulated by Y (rim moves more)
// Tentacles: pulse-coupled trailing physics (splay on contraction, droop on expansion)
// + jpweeks/particulate-medusae depth-dependent trailing delay
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

  // --- TENTACLE TRAILING PHYSICS (y < 0) ---
  // Coupled to bell pulse — tentacles react to contraction/expansion
  // Adapted from arodic/Chrysaora wave propagation down appendages
  // + jpweeks/particulate-medusae depth-dependent trailing delay
  //
  // Real deep-sea jellyfish behavior:
  //   Bell contracts → water jet pushes tentacles outward (splay)
  //   Bell relaxes → tentacles hang/trail downward (droop)
  //   Deeper segments lag behind base → trailing ribbon ripple
  //   Subtle cross-current twist → corkscrew, not planar
  float depth = max(0.0, -pos.y);
  float tentFactor = 1.0 - bellFactor;

  // Trailing delay: deeper segments respond later
  // 0.35 rad/unit — tips lag ~0.5 cycle behind base for 1.5-unit tentacle
  float trailDelay = depth * 0.35;
  float coupledPulse = sin(t - trailDelay);

  // Radial splay: contraction pushes tentacles outward (water jet)
  // Asymmetric — contraction splay stronger than retraction
  float splay = coupledPulse > 0.0 ? coupledPulse * 0.15 : coupledPulse * 0.06;
  vec2 tentDir = normalize(pos.xz + vec2(0.001));
  pos.xz += tentDir * splay * depth * tentFactor;

  // Cross-current spiral — perpendicular to splay direction
  // Creates twisting ribbon effect from deep-sea photography
  // Slower than bell pulse (0.6x), offset by depth for corkscrew
  float spiralPhase = t * 0.6 - depth * 0.5;
  pos.x += sin(spiralPhase) * 0.04 * depth * tentFactor;
  pos.z += cos(spiralPhase + phase * 0.7) * 0.03 * depth * tentFactor;

  // Gravity droop: tips hang heavier when bell is relaxed
  // Contraction → tentacles lift (jet pushes up) = droopFactor low
  // Expansion → gravity pulls tips down (trailing arc) = droopFactor high
  float droopFactor = max(0.0, -coupledPulse * 0.4 + 0.6);
  pos.y -= depth * depth * 0.025 * droopFactor * tentFactor;

  // Apply instance transform
  vec4 worldPos = modelMatrix * instanceMatrix * vec4(pos, 1.0);
  vWorldPos = worldPos.xyz;

  // Transform normal through instance + model matrices
  mat3 normalMat = mat3(modelMatrix) * mat3(instanceMatrix);
  vNormal = normalize(normalMat * normal);

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
