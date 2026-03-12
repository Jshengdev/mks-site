// src/meadow/MeadowScene.js
import * as THREE from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js'

// Color constants from spacejack/terra world.ts
const FOG_COLOR = new THREE.Color(0.74, 0.77, 0.91)
const LIGHT_COLOR = new THREE.Color(1.0, 1.0, 0.99)

export function setupScene(scene) {
  // Fog (3-zone handled by shaders, this is base fog)
  scene.fog = new THREE.FogExp2(FOG_COLOR, 0.008)
  // Do NOT set scene.background — Sky dome handles it

  // Sky dome (Preetham atmospheric model)
  const sky = new Sky()
  sky.scale.setScalar(10000)
  scene.add(sky)

  const sunPosition = new THREE.Vector3()
  const phi = THREE.MathUtils.degToRad(90 - 12) // 12° elevation = golden hour
  const theta = THREE.MathUtils.degToRad(180)
  sunPosition.setFromSphericalCoords(1, phi, theta)

  const skyUniforms = sky.material.uniforms
  skyUniforms['turbidity'].value = 8
  skyUniforms['rayleigh'].value = 2.5
  skyUniforms['mieCoefficient'].value = 0.005
  skyUniforms['mieDirectionalG'].value = 0.8
  skyUniforms['sunPosition'].value.copy(sunPosition)

  // Directional light (golden hour angle)
  const sunLight = new THREE.DirectionalLight(LIGHT_COLOR, 1.5)
  sunLight.position.copy(sunPosition).multiplyScalar(100)
  scene.add(sunLight)

  // Ambient light (subtle fill)
  const ambient = new THREE.AmbientLight(0xffffff, 0.3)
  scene.add(ambient)

  return { sky, sunLight, sunPosition }
}
