// src/meadow/MeadowScene.js
import * as THREE from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js'

const DEFAULT_FOG_COLOR = new THREE.Color(0.85, 0.78, 0.55)
const DEFAULT_LIGHT_COLOR = new THREE.Color(1.0, 0.92, 0.75)

// Reusable color for vertex color interpolation
const _cA = new THREE.Color()
const _cB = new THREE.Color()
const _cC = new THREE.Color()

// ─── Gradient dome sky (Ghibli cel-dome) ───
// Hand-painted feel: zenith → mid → horizon as vertex colors on inverted sphere
function createGradientSky(scene, skyConfig) {
  const geometry = new THREE.SphereGeometry(5000, 32, 24)
  const pos = geometry.attributes.position
  const colors = new Float32Array(pos.count * 3)

  const zenith = _cA.setRGB(...(skyConfig.zenithColor ?? [0.25, 0.45, 0.75]))
  const mid = _cB.setRGB(...(skyConfig.midColor ?? [0.65, 0.55, 0.40]))
  const horizon = _cC.setRGB(...(skyConfig.horizonColor ?? [0.85, 0.70, 0.40]))

  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i)
    const t = Math.max(0, y / 5000) // 0 at equator, 1 at zenith (ignore bottom hemisphere)
    const c = new THREE.Color()
    if (t > 0.3) {
      c.lerpColors(mid, zenith, Math.min(1, (t - 0.3) / 0.7))
    } else {
      c.lerpColors(horizon, mid, t / 0.3)
    }
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const material = new THREE.MeshBasicMaterial({
    vertexColors: true,
    side: THREE.BackSide,
    fog: false,
  })

  const skyMesh = new THREE.Mesh(geometry, material)
  scene.add(skyMesh)
  return skyMesh
}

export function setupScene(scene, envConfig = {}) {
  const skyConfig = envConfig.sky ?? {}
  const lightingConfig = envConfig.lighting ?? {}
  const fogConfig = envConfig.fog ?? {}

  // Fog (3-zone handled by shaders, this is base fog)
  const fogColor = fogConfig.color ? new THREE.Color(fogConfig.color) : DEFAULT_FOG_COLOR
  scene.fog = new THREE.FogExp2(fogColor, fogConfig.density ?? 0.003)

  // ─── Sky dome: Preetham or gradient dome ───
  let sky = null
  let skyMesh = null
  const sunPosition = new THREE.Vector3()
  const elevation = skyConfig.sunElevation ?? 12
  const phi = THREE.MathUtils.degToRad(90 - elevation)
  const theta = THREE.MathUtils.degToRad(240)
  sunPosition.setFromSphericalCoords(1, phi, theta)

  if (skyConfig.type === 'cel-dome') {
    // Ghibli: gradient dome — not Preetham
    skyMesh = createGradientSky(scene, skyConfig)
  } else if (skyConfig.type === 'night-atmosphere') {
    // Night sky: no Preetham dome — dark background lets StarField show through.
    // Preetham at sunElevation < -10 produces a near-black opaque mesh that
    // overwrites star particles (renderOrder -100 < sky's 0). Skip it entirely.
    const bgColor = fogConfig.color ? new THREE.Color(fogConfig.color) : new THREE.Color(0x060610)
    scene.background = bgColor
  } else if (skyConfig.type === 'cavern-void' || skyConfig.type === 'void' || skyConfig.type === 'void-dark') {
    // Underground / void worlds — dark hemisphere, no atmospheric sky
    // The "sky" is absence: near-black dome matching the cavern void
    const bgHex = skyConfig.backgroundColor
    const voidColor = bgHex
      ? (() => { const c = new THREE.Color(bgHex); return [c.r, c.g, c.b] })()
      : (skyConfig.voidColor ?? [0.01, 0.01, 0.02])
    const geometry = new THREE.SphereGeometry(5000, 16, 12)
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(...voidColor),
      side: THREE.BackSide,
      fog: false,
    })
    skyMesh = new THREE.Mesh(geometry, material)
    scene.add(skyMesh)
    // Also set scene background to match void — prevents any Preetham bleed
    scene.background = new THREE.Color(...voidColor)
  } else {
    // Default: Preetham atmospheric model
    sky = new Sky()
    sky.scale.setScalar(10000)
    scene.add(sky)

    const skyUniforms = sky.material.uniforms
    skyUniforms['turbidity'].value = skyConfig.turbidity ?? 10
    skyUniforms['rayleigh'].value = skyConfig.rayleigh ?? 1.5
    skyUniforms['mieCoefficient'].value = skyConfig.mieCoefficient ?? 0.008
    skyUniforms['mieDirectionalG'].value = 0.9
    skyUniforms['sunPosition'].value.copy(sunPosition)
  }

  // Directional light
  const sunColor = lightingConfig.sunColor
    ? new THREE.Color().setRGB(...lightingConfig.sunColor)
    : DEFAULT_LIGHT_COLOR
  const sunLight = new THREE.DirectionalLight(sunColor, lightingConfig.sunIntensity ?? 1.5)
  sunLight.position.copy(sunPosition).multiplyScalar(100)
  scene.add(sunLight)

  // Ambient light (subtle fill)
  const ambient = new THREE.AmbientLight(0xffffff, lightingConfig.ambientIntensity ?? 0.15)
  scene.add(ambient)

  return { sky, skyMesh, sunLight, sunPosition, ambientLight: ambient }
}
