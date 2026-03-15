// Bubble fragment shader — translucent spheres with rim highlight
// Bubbles are NOT solid — they're thin shells of refracted light.
// The center is nearly transparent, the edge catches light as a bright rim.

uniform float uOpacity;

varying float vAlpha;

void main() {
  float dist = distance(gl_PointCoord, vec2(0.5));
  if (dist > 0.5) discard;

  // Rim highlight: bright at edge, transparent at center
  // This creates the "thin shell of light" look
  float rim = smoothstep(0.3, 0.5, dist);   // bright ring at edge
  float inner = smoothstep(0.5, 0.15, dist); // soft inner fill

  // Bubble: mostly transparent with bright rim
  float alpha = (rim * 0.8 + inner * 0.15) * uOpacity * vAlpha;

  // Slight specular highlight (off-center, like a real bubble reflection)
  float specular = smoothstep(0.12, 0.0, distance(gl_PointCoord, vec2(0.35, 0.35)));
  alpha += specular * 0.4;

  // Color: slightly blue-green tint from water, mostly white
  vec3 color = mix(vec3(0.7, 0.85, 0.9), vec3(1.0), specular);

  gl_FragColor = vec4(color, alpha);
}
