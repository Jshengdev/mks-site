// Screen-space lens flare — sun burst + ghost reflections
// Adapted from ektogamat's vanilla Three.js lens flare
// Technique: radial star burst + ghost discs along sun-center ray

uniform vec2 uSunScreenPos;   // UV coords of sun on screen (0-1)
uniform float uSunVisible;    // 0-1 occlusion fade
uniform float uIntensity;     // 0.3 default
uniform float uGhostSpacing;  // 0.3 default

#define STAR_POINTS 6
#define GHOST_COUNT 3

// Star burst pattern — N-point radial arms
float starBurst(vec2 uv, vec2 sunPos) {
    vec2 delta = uv - sunPos;
    float dist = length(delta);
    float angle = atan(delta.y, delta.x);

    // N-point star with smooth center fade
    float star = pow(abs(cos(angle * float(STAR_POINTS) / 2.0)), 32.0);
    float centerFade = smoothstep(0.0, 0.01, dist);
    // Steep radial falloff — keep star tight around sun
    float falloff = exp(-dist * 20.0);

    return star * falloff * centerFade;
}

// Single ghost disc
float ghostDisc(vec2 uv, vec2 center, float radius) {
    float d = length(uv - center);
    return smoothstep(radius, radius * 0.5, d) * 0.15;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    if (uSunVisible < 0.01 || uIntensity < 0.01) {
        outputColor = inputColor;
        return;
    }

    vec2 sunPos = uSunScreenPos;
    vec3 flareColor = vec3(1.0, 0.9, 0.7); // warm amber

    // Star burst — subtle rays
    float star = starBurst(uv, sunPos) * 0.4;

    // Ghost reflections along sun→center ray
    vec2 ghostDir = vec2(0.5) - sunPos;
    float ghosts = 0.0;
    for (int i = 0; i < GHOST_COUNT; i++) {
        float t = uGhostSpacing * (float(i) + 1.0);
        vec2 ghostPos = sunPos + ghostDir * t;
        float radius = 0.02 + float(i) * 0.01;
        ghosts += ghostDisc(uv, ghostPos, radius);
    }

    // Tight halo ring around sun
    float sunDist = length(uv - sunPos);
    float halo = smoothstep(0.15, 0.08, sunDist) * smoothstep(0.04, 0.08, sunDist) * 0.15;

    // Combine
    float flare = (star + ghosts + halo) * uIntensity * uSunVisible;
    vec3 result = inputColor.rgb + flareColor * flare;

    outputColor = vec4(result, inputColor.a);
}
