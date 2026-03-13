// src/meadow/MeadowScene.js
import * as THREE from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js'

// Color constants from spacejack/terra world.ts
// Warm golden haze fog (BotW Hyrule Field atmosphere)
const FOG_COLOR = new THREE.Color(0.85, 0.78, 0.55)
// Golden hour sunlight — warm amber with slight green retention
const LIGHT_COLOR = new THREE.Color(1.0, 0.92, 0.75)

export function setupScene(scene) {
  // Fog (3-zone handled by shaders, this is base fog)
  scene.fog = new THREE.FogExp2(FOG_COLOR, 0.003)
  // Do NOT set scene.background — Sky dome handles it

  // Sky dome (Preetham atmospheric model)
  const sky = new Sky()
  sky.scale.setScalar(10000)
  scene.add(sky)

  const sunPosition = new THREE.Vector3()
  const phi = THREE.MathUtils.degToRad(90 - 12) // 12° elevation = golden hour
  const theta = THREE.MathUtils.degToRad(240)    // 240° = right side, off-camera
  sunPosition.setFromSphericalCoords(1, phi, theta)

  const skyUniforms = sky.material.uniforms
  skyUniforms['turbidity'].value = 10
  skyUniforms['rayleigh'].value = 1.5
  skyUniforms['mieCoefficient'].value = 0.008
  skyUniforms['mieDirectionalG'].value = 0.9
  skyUniforms['sunPosition'].value.copy(sunPosition)

  // Directional light (golden hour angle)
  const sunLight = new THREE.DirectionalLight(LIGHT_COLOR, 1.5)
  sunLight.position.copy(sunPosition).multiplyScalar(100)
  scene.add(sunLight)

  // Ambient light (subtle fill)
  const ambient = new THREE.AmbientLight(0xffffff, 0.15)
  scene.add(ambient)

  return { sky, sunLight, sunPosition }
}
