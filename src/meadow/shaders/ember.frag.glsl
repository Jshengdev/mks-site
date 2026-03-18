// Ember fragment shader — cooling sparks: white-yellow → orange → dark red
// Color ramp stolen from Ppratik765/liquid-lava-effect + skeeto/webgl-fire palette
// Radial glow from Alex-DG firefly.frag.glsl
uniform float uBrightness; // atmosphere-driven overall brightness

varying float vAge;        // 0=newborn, 1=dead
varying float vBrightness; // per-particle brightness from vertex shader

void main() {
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));

  // Radial glow — inverse-distance from Alex-DG
  // Tighter core than fireflies (0.04 vs 0.05) for sharper sparks
  float strength = 0.04 / distanceToCenter - 0.08;
  if (strength < 0.01) discard;

  // 3-stop color ramp — stolen from Ppratik765 lava effect
  vec3 hotColor  = vec3(1.0, 0.89, 0.63);  // white-yellow — just born
  vec3 warmColor = vec3(1.0, 0.40, 0.0);   // molten orange — mid-life
  vec3 coolColor = vec3(0.20, 0.02, 0.0);  // dying ember — death

  // Smoothstep blending for smooth ramp (cleaner than if/else branch)
  vec3 color = mix(hotColor, warmColor, smoothstep(0.0, 0.35, vAge));
  color = mix(color, coolColor, smoothstep(0.35, 0.85, vAge));

  // Emissive boost at birth — white-hot flash
  float emissive = smoothstep(0.08, 0.0, vAge) * 0.4;
  color += vec3(emissive);

  // Alpha fades with age — embers become transparent as they die
  float alphaFade = 1.0 - smoothstep(0.6, 1.0, vAge);

  gl_FragColor = vec4(color, strength * vBrightness * alphaFade * uBrightness);
}
