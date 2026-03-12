// Source: Alex-DG/vite-three-webxr-flowers
// URL: https://github.com/Alex-DG/vite-three-webxr-flowers/blob/main/js/experience/shader/fireflies/fragment.glsl
// Fetched: 2026-03-12

void main()
{
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 0.05 / distanceToCenter - 0.1;

    gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
}
