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

export default class StarField {
  constructor(scene, config = {}) {
    const radius = config.radius ?? 800
    const gridSize = config.gridSize ?? 48 // stars per grid axis on hemisphere
    const brightnessExp = config.brightnessExp ?? 6 // pow(random, exp) — higher = fewer bright stars
    const maxOffset = config.maxOffset ?? 0.43 // jitter within grid cell
    const moonEnabled = config.moon?.enabled ?? false

    // Generate star positions on upper hemisphere using grid+jitter
    // Stolen from Nugget8: grid ensures coverage, jitter prevents patterns
    const starPositions = []
    const starBrightnesses = []
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

        // Brightness: pow(random, exp) gives natural distribution
        // Most stars dim, few bright — stolen from Nugget8
        const brightness = Math.pow(seededRandom(seed++), brightnessExp)
        // Remap so even "dim" stars are somewhat visible
        starBrightnesses.push(0.15 + brightness * 0.85)
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
