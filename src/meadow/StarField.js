// StarField — Procedural star field on sky sphere
// Adapted from Nugget8/Three.js-Ocean-Scene SkyboxShader.js star generation
// Uses grid+jitter placement with pow(random, exponent) brightness distribution
// for natural star density (many dim, few bright)
import * as THREE from 'three'
import vertexShader from './shaders/star.vert.glsl?raw'
import fragmentShader from './shaders/star.frag.glsl?raw'

// Seeded random for deterministic star placement
// (same sky every visit — stolen from Nugget8 hash pattern)
function seededRandom(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

// 6 spectral color types — stolen from Nugget8 stellar classification
// O/B (blue-white), A (white), F (yellow-white), G (yellow), K (orange), M (red)
// Each star gets a spectral class based on brightness (bright = hot = blue)
const SPECTRAL_COLORS = [
  [0.65, 0.72, 1.00],  // O/B — hot blue-white (brightest)
  [0.80, 0.85, 1.00],  // A — white with blue tint
  [0.95, 0.93, 0.88],  // F — yellow-white
  [1.00, 0.92, 0.70],  // G — warm yellow (sun-like)
  [1.00, 0.78, 0.50],  // K — orange
  [1.00, 0.60, 0.40],  // M — cool red (dimmest)
]

export default class StarField {
  constructor(scene, config = {}) {
    const radius = config.radius ?? 800
    const gridSize = config.gridSize ?? 90 // ~8100 stars on hemisphere (90x90)
    const brightnessExp = config.brightnessExp ?? 3 // pow(random, 3) — more visible bright stars
    const maxOffset = config.maxOffset ?? 0.43 // jitter within grid cell
    const moonEnabled = config.moon?.enabled ?? false

    // Generate star positions on upper hemisphere using grid+jitter
    // Stolen from Nugget8: grid ensures coverage, jitter prevents patterns
    const starPositions = []
    const starBrightnesses = []
    const starColors = [] // RGB per star — 6 spectral types
    let seed = 42

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        // Normalized grid position with jitter
        const u = (i + seededRandom(seed++) * maxOffset * 2 - maxOffset) / gridSize
        const v = (j + seededRandom(seed++) * maxOffset * 2 - maxOffset) / gridSize

        // Map to spherical coordinates (upper hemisphere + some below horizon)
        // phi: 0 (zenith) to PI*0.7 (below equator for horizon stars)
        const phi = u * Math.PI * 0.7
        const theta = v * Math.PI * 2

        const x = radius * Math.sin(phi) * Math.cos(theta)
        const y = radius * Math.cos(phi) // up
        const z = radius * Math.sin(phi) * Math.sin(theta)

        // Skip stars too close to horizon (they'd be in fog)
        if (y < radius * 0.05) continue

        starPositions.push(x, y, z)

        // Brightness: pow(random, 3) gives natural distribution
        // More visible bright stars than exp=6 — stolen from Nugget8
        const brightness = Math.pow(seededRandom(seed++), brightnessExp)
        // Remap so even "dim" stars are somewhat visible
        starBrightnesses.push(0.15 + brightness * 0.85)

        // Spectral color: bright stars are hotter (bluer), dim stars cooler (redder)
        // Map brightness to spectral index: 0 (bright=blue) → 5 (dim=red)
        const spectralIdx = Math.min(5, Math.floor((1.0 - brightness) * 5.99))
        const color = SPECTRAL_COLORS[spectralIdx]
        starColors.push(color[0], color[1], color[2])
      }
    }

    const count = starPositions.length / 3

    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false, // Stars always behind everything
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uBaseSize: { value: config.size ?? 3.0 },
        uBrightness: { value: 1.0 },
      },
      vertexShader,
      fragmentShader,
    })

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3))
    geometry.setAttribute('aStarBrightness', new THREE.Float32BufferAttribute(starBrightnesses, 1))
    geometry.setAttribute('aStarColor', new THREE.Float32BufferAttribute(starColors, 3))

    this.points = new THREE.Points(geometry, this.material)
    this.points.renderOrder = -100 // Render before everything else
    scene.add(this.points)

    // Moon — large bright glow point
    this.moon = null
    if (moonEnabled) {
      this._createMoon(scene, radius, config.moon)
    }
  }

  _createMoon(scene, radius, moonConfig) {
    const moonSize = moonConfig.size ?? 5000
    const moonSharpness = moonConfig.sharpness ?? 12000

    // Moon position — upper sky, offset from center
    const moonPhi = THREE.MathUtils.degToRad(35)  // 35deg from zenith
    const moonTheta = THREE.MathUtils.degToRad(120) // azimuth
    const moonPos = new THREE.Vector3(
      radius * 0.9 * Math.sin(moonPhi) * Math.cos(moonTheta),
      radius * 0.9 * Math.cos(moonPhi),
      radius * 0.9 * Math.sin(moonPhi) * Math.sin(moonTheta),
    )

    // Simple sprite for moon glow
    const moonGeometry = new THREE.PlaneGeometry(40, 40)
    const moonMaterial = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
      uniforms: {
        uBrightness: { value: 1.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uBrightness;
        varying vec2 vUv;
        void main() {
          // Concentric glow — tight bright center, soft halo
          // Stolen from Nugget8 moon: sharpness controls falloff
          float dist = distance(vUv, vec2(0.5));
          float core = smoothstep(0.12, 0.0, dist);  // bright disk
          float halo = exp(-dist * 6.0) * 0.5;       // soft glow
          float strength = core + halo;
          vec3 color = vec3(0.85, 0.88, 0.95);  // cool moonlight
          gl_FragColor = vec4(color, strength * uBrightness);
        }
      `,
    })

    this.moon = new THREE.Mesh(moonGeometry, moonMaterial)
    this.moon.position.copy(moonPos)
    this.moon.lookAt(0, 0, 0)
    this.moon.renderOrder = -99
    scene.add(this.moon)
    this._moonMaterial = moonMaterial
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed
  }

  setBrightness(value) {
    this.material.uniforms.uBrightness.value = value
    this.points.visible = value > 0.01
    if (this._moonMaterial) {
      this._moonMaterial.uniforms.uBrightness.value = value
      this.moon.visible = value > 0.01
    }
  }

  dispose() {
    this.points.geometry.dispose()
    this.material.dispose()
    if (this.moon) {
      this.moon.geometry.dispose()
      this._moonMaterial.dispose()
    }
  }
}
