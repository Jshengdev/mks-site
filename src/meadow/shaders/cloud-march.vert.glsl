// cloud-march.vert.glsl — Fullscreen quad vertex shader (GLSL3)
// Outputs UV + ray direction for cloud ray-marching

out vec2 vUv;
out vec3 vRayDir;

uniform mat4 uInvProjection;
uniform mat4 uInvView;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);

  // Reconstruct ray direction from clip-space position
  vec4 clipPos = vec4(position.xy, -1.0, 1.0);
  vec4 viewPos = uInvProjection * clipPos;
  viewPos = vec4(viewPos.xy, -1.0, 0.0);
  vec4 worldDir = uInvView * viewPos;
  vRayDir = normalize(worldDir.xyz);
}
