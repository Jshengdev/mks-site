// PortalDoor.js — Rectangular frame geometry with glowing FBM noise interior
// 5-8 doors on floating platforms, each a portal to somewhere impossible
// Stolen from: ektogamat/fake-glow-material-threejs (glow approach),
// VoXelo/Procedural Portal (FBM swirl noise), stemkoski glow shader (rim),
// metzlr/portals (frame + aperture concept, simplified to glow-only)
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import portalVertexShader from './shaders/portal.vert.glsl?raw'
import portalFragmentShader from './shaders/portal-interior.frag.glsl?raw'

export default class PortalDoor {
  constructor(scene, config = {}, platformPositions = []) {
    const count = config.count ?? 6
    this.meshes = []

    // Portal frame dimensions
    const frameW = config.frameWidth ?? 2.2
    const frameH = config.frameHeight ?? 3.2
    const beamThick = config.beamThickness ?? 0.18

    // Build frame geometry — 4 beams merged into one shape
    const leftBeam = new THREE.BoxGeometry(beamThick, frameH, beamThick)
    leftBeam.translate(-frameW / 2, frameH / 2, 0)
    const rightBeam = new THREE.BoxGeometry(beamThick, frameH, beamThick)
    rightBeam.translate(frameW / 2, frameH / 2, 0)
    const topBeam = new THREE.BoxGeometry(frameW + beamThick, beamThick, beamThick)
    topBeam.translate(0, frameH, 0)
    const bottomBeam = new THREE.BoxGeometry(frameW + beamThick, beamThick, beamThick)
    bottomBeam.translate(0, 0, 0)

    const frameGeo = mergeGeometries([leftBeam, rightBeam, topBeam, bottomBeam])
    leftBeam.dispose()
    rightBeam.dispose()
    topBeam.dispose()
    bottomBeam.dispose()

    // Frame material — dark stone, slightly lighter than platforms
    const frameMaterial = new THREE.MeshLambertMaterial({
      color: new THREE.Color(0.14, 0.14, 0.18),
    })

    // Interior glow plane — slightly inset from frame edges
    const interiorGeo = new THREE.PlaneGeometry(frameW - beamThick * 0.5, frameH - beamThick * 0.5)
    interiorGeo.translate(0, frameH / 2, 0)

    // Portal glow color — cool blue-white matching firefly palette
    const portalColor = config.color
      ? new THREE.Color().setRGB(...config.color)
      : new THREE.Color(0.3, 0.45, 0.8) // cool spectral blue

    // Shared shader material for all portal interiors
    this.glowMaterial = new THREE.ShaderMaterial({
      vertexShader: portalVertexShader,
      fragmentShader: portalFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: portalColor },
        uBrightness: { value: config.brightness ?? 1.0 },
      },
    })

    // Pick platform positions for door placement
    // Prefer platforms at regular intervals along the spiral
    const doorPositions = this._selectDoorPositions(count, platformPositions)

    const dummy = new THREE.Object3D()

    for (let i = 0; i < count; i++) {
      const group = new THREE.Group()

      // Frame mesh
      const frame = new THREE.Mesh(frameGeo, frameMaterial)
      group.add(frame)

      // Interior glow mesh
      const interior = new THREE.Mesh(interiorGeo, this.glowMaterial)
      group.add(interior)

      // Position on platform
      if (doorPositions[i]) {
        group.position.copy(doorPositions[i])
        // Offset up slightly so door stands ON the platform
        group.position.y += 0.2
      } else {
        // Fallback: distribute along path
        const t = i / count
        group.position.set(
          Math.cos(t * Math.PI * 4) * 8,
          t * 18 + 1,
          -t * 150
        )
      }

      // Random yaw rotation — doors face different directions
      group.rotation.y = Math.random() * Math.PI * 2

      // Some doors tilted (10%) for extra impossibility
      if (Math.random() < 0.15) {
        group.rotation.z = (Math.random() - 0.5) * 0.4
      }

      scene.add(group)
      this.meshes.push(group)
    }

    // Store for disposal
    this._frameGeo = frameGeo
    this._interiorGeo = interiorGeo
    this._frameMaterial = frameMaterial
  }

  _selectDoorPositions(count, platformPositions) {
    if (platformPositions.length < count) return platformPositions.slice()

    // Select platforms at regular intervals — spread doors evenly through the spiral
    const positions = []
    const step = Math.floor(platformPositions.length / count)
    for (let i = 0; i < count; i++) {
      const idx = Math.min(i * step + Math.floor(Math.random() * 3), platformPositions.length - 1)
      positions.push(platformPositions[idx].clone())
    }
    return positions
  }

  update(elapsed) {
    this.glowMaterial.uniforms.uTime.value = elapsed
  }

  dispose() {
    for (const group of this.meshes) {
      group.parent?.remove(group)
    }
    this._frameGeo.dispose()
    this._interiorGeo.dispose()
    this._frameMaterial.dispose()
    this.glowMaterial.dispose()
  }
}
