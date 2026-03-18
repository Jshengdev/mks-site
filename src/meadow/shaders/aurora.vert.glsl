// Aurora curtain vertex shader — dome curvature + wave displacement
// Curves flat PlaneGeometry into dome visible from below
// Wave displacement creates flowing curtain motion
uniform float uTime;
uniform float uWaveAmplitude;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying float vEdgeFade;

void main() {
  vUv = uv;

  vec3 pos = position;

  // Curve into dome — edges droop down, center stays highest
  // Creates natural sky-dome curvature visible from below
  float centerDist = length(uv - 0.5) * 2.0;
  pos.y -= centerDist * centerDist * 35.0; // parabolic droop at edges

  // Flowing wave displacement — curtain ripple
  // Multiple frequencies for organic motion
  pos.y += sin(pos.x * 0.04 + uTime * 0.25) * uWaveAmplitude * 3.0;
  pos.y += sin(pos.z * 0.06 + uTime * 0.18) * uWaveAmplitude * 2.0;
  pos.x += sin(pos.z * 0.025 + uTime * 0.12) * uWaveAmplitude * 1.5;

  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPosition.xyz;

  // Edge fade — aurora fades toward edges of the dome
  vEdgeFade = 1.0 - smoothstep(0.25, 0.92, centerDist);

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
