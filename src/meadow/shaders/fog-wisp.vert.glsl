// Fog wisp vertex shader — camera-facing billboard quads
// Billboard technique from three.js sprite shader / Chinedufn WebGL particles
// Each wisp is a PlaneGeometry made camera-facing via view-space alignment
uniform float uTime;

attribute float aPhase;       // unique drift phase per instance
attribute float aWispScale;   // size variation per instance

varying vec2 vUv;
varying float vAlpha;
varying float vPhase;

// Stolen hash from L16
float hash(float n) { return fract(sin(n) * 43758.5453); }

void main() {
  vUv = uv;
  vPhase = aPhase;

  // ─── Billboard alignment (camera-facing) ───
  // Extract camera right and up from view matrix (column vectors)
  vec3 camRight = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 camUp = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);

  // Get instance world position from instanceMatrix
  vec3 instancePos = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);

  // ─── Slow horizontal drift (the defining motion) ───
  float driftSpeed = 0.08 + hash(aPhase * 73.0) * 0.06; // 0.08-0.14 units/sec
  float driftDir = hash(aPhase * 137.0) * 6.28; // random direction
  instancePos.x += sin(driftDir) * uTime * driftSpeed;
  instancePos.z += cos(driftDir) * uTime * driftSpeed;
  // Gentle vertical undulation
  instancePos.y += sin(uTime * 0.15 + aPhase * 6.28) * 0.3;

  // Billboard vertex offset (position.xy is the quad local coords)
  float scale = aWispScale;
  vec3 worldPos = instancePos
    + camRight * position.x * scale
    + camUp * position.y * scale;

  // ─── Distance-based alpha fade ───
  float dist = length(worldPos - cameraPosition);
  vAlpha = smoothstep(80.0, 50.0, dist) * smoothstep(2.0, 8.0, dist);
  // Fade wisps that are too close (< 8 units) or too far (> 50 units)

  gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
}
