// Ember fragment shader — cooling sparks with anisotropic trail glow
// Color ramp stolen from Ppratik765/liquid-lava-effect + skeeto/webgl-fire palette
// Radial glow from Alex-DG firefly.frag.glsl
// Trail: glow stretches BEHIND motion, tail cools one ramp-step further than core
uniform float uBrightness; // atmosphere-driven overall brightness

varying float vAge;        // 0=newborn, 1=dead
varying float vBrightness; // per-particle brightness from vertex shader
varying vec2 vTrailDir;    // motion direction in pointCoord space
varying float vTrailLen;   // trail elongation factor

void main() {
  vec2 uv = gl_PointCoord - 0.5;

  // ─── Anisotropic trail glow ───
  // Decompose UV into parallel (along motion) and perpendicular components
  float parallel = dot(uv, vTrailDir);   // positive = ahead of motion
  float perp = dot(uv, vec2(-vTrailDir.y, vTrailDir.x));

  // Shift hot core FORWARD along motion direction
  // The bright center leads, the dimming tail stretches behind
  parallel -= vTrailLen * 0.12;

  // Stretch glow BEHIND the core (negative parallel = trail)
  // Compress the effective distance → glow extends further backward
  // Ahead of core: normal falloff (no forward streak)
  float stretchedPar = parallel < 0.0
    ? parallel / (1.0 + vTrailLen * 1.2)   // behind: elongate
    : parallel;                              // ahead: tight

  float dist = sqrt(perp * perp + stretchedPar * stretchedPar);

  // Radial glow — inverse-distance from Alex-DG
  // Same 0.04 core as before, now anisotropic
  float strength = 0.04 / dist - 0.08;
  if (strength < 0.01) discard;

  // 3-stop color ramp — stolen from Ppratik765 lava effect
  vec3 hotColor  = vec3(1.0, 0.89, 0.63);  // white-yellow — just born
  vec3 warmColor = vec3(1.0, 0.40, 0.0);   // molten orange — mid-life
  vec3 coolColor = vec3(0.20, 0.02, 0.0);  // dying ember — death

  // Smoothstep blending for smooth ramp
  vec3 color = mix(hotColor, warmColor, smoothstep(0.0, 0.35, vAge));
  color = mix(color, coolColor, smoothstep(0.35, 0.85, vAge));

  // Trail tail cooling — further behind the core = one ramp-step cooler
  // Creates visible color gradient along the streak (hot core → cooler tail)
  float tailAmount = smoothstep(0.0, 0.25, max(-parallel, 0.0)) * vTrailLen;
  float tailAge = min(vAge + tailAmount * 0.25, 1.0);
  vec3 tailColor = mix(hotColor, warmColor, smoothstep(0.0, 0.35, tailAge));
  tailColor = mix(tailColor, coolColor, smoothstep(0.35, 0.85, tailAge));
  color = mix(color, tailColor, tailAmount);

  // Emissive boost at birth — white-hot flash
  float emissive = smoothstep(0.08, 0.0, vAge) * 0.4;
  color += vec3(emissive);

  // Alpha fades with age — embers become transparent as they die
  float alphaFade = 1.0 - smoothstep(0.6, 1.0, vAge);

  gl_FragColor = vec4(color, strength * vBrightness * alphaFade * uBrightness);
}
