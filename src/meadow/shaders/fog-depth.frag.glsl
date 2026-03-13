// 3-Zone Depth Fog — adapted from spacejack/terra fog blending
// and iq's smooth fog articles (Shadertoy)
// Near: sharp + vivid, Mid: golden warmth, Far: desaturated cool blue

uniform float uNearEnd;
uniform float uMidEnd;
uniform float uFogStrength;
uniform vec3 uMidColor;
uniform vec3 uFarColor;
uniform float uDesaturation;

void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {
  // depth is 0..1 from camera near to far (linear)

  // Zone factors — smoothstep for gradual transitions (iq technique)
  float midFactor = smoothstep(uNearEnd, uMidEnd, depth);
  float farFactor = smoothstep(uMidEnd, 1.0, depth);

  vec3 color = inputColor.rgb;

  // Mid zone: blend toward golden haze (spacejack-style fog mix)
  color = mix(color, uMidColor, midFactor * uFogStrength);

  // Far zone: blend toward cool blue distance
  color = mix(color, uFarColor, farFactor);

  // Desaturate far zone — luma-based (BT.601 coefficients)
  float luma = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(color, vec3(luma), farFactor * uDesaturation);

  outputColor = vec4(color, inputColor.a);
}
