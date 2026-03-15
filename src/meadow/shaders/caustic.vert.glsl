// Caustic projection vertex shader
// Used by CausticProjector to project animated caustic light onto terrain/objects
// Technique: world-space XZ coordinates drive procedural noise pattern
// Source: martinRenou/threejs-caustics (projection concept) +
//         Shadertoy MdlXz8 by Dave_Hoskins (tileable caustic noise)

varying vec3 vWorldPos;
varying float vDepth;    // normalized depth for absorption falloff

uniform float uSurfaceHeight;  // water surface Y position

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;

  // Depth = distance below water surface, normalized
  // 0.0 at surface, 1.0 at pool floor
  vDepth = clamp((uSurfaceHeight - worldPos.y) / uSurfaceHeight, 0.0, 1.0);

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
