// src/meadow/MeadowScene.js
import * as THREE from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js'

// Default color constants from spacejack/terra world.ts
const DEFAULT_FOG_COLOR = new THREE.Color(0.85, 0.78, 0.55)
const DEFAULT_LIGHT_COLOR = new THREE.Color(1.0, 0.92, 0.75)

export function setupScene(scene, envConfig = {}) {
  const skyConfig = envConfig.sky ?? {}
  const lightingConfig = envConfig.lighting ?? {}
  const fogConfig = envConfig.fog ?? {}

  // Fog (3-zone handled by shaders, this is base fog)
  const fogColor = fogConfig.color ? new THREE.Color(fogConfig.color) : DEFAULT_FOG_COLOR
  scene.fog = new THREE.FogExp2(fogColor, fogConfig.density ?? 0.003)
  // Do NOT set scene.background — Sky dome handles it

  // Sky dome (Preetham atmospheric model — future: swap based on skyConfig.type)
  const sky = new Sky()
  sky.scale.setScalar(10000)
  scene.add(sky)

  const elevation = skyConfig.sunElevation ?? 12
  const sunPosition = new THREE.Vector3()
  const phi = THREE.MathUtils.degToRad(90 - elevation)
  const theta = THREE.MathUtils.degToRad(240)
  sunPosition.setFromSphericalCoords(1, phi, theta)

  const skyUniforms = sky.material.uniforms
  skyUniforms['turbidity'].value = skyConfig.turbidity ?? 10
  skyUniforms['rayleigh'].value = skyConfig.rayleigh ?? 1.5
  skyUniforms['mieCoefficient'].value = skyConfig.mieCoefficient ?? 0.008
  skyUniforms['mieDirectionalG'].value = 0.9
  skyUniforms['sunPosition'].value.copy(sunPosition)

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

  return { sky, sunLight, sunPosition, ambientLight: ambient }
}
