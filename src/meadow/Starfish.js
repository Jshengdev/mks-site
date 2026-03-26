// Starfish — continental-scale flat stars on the pool floor
// 5-pointed star geometry via THREE.Shape + ExtrudeGeometry.
// Glacial creeping movement barely perceptible over the scroll arc.
//
// Adapted from:
//   Three.js examples/webgl_geometry_extrude_shapes.html — star shape geometry
//   FlowerInstances.js — InstancedMesh placement pattern
//
// Key creative decision: starfish are HUGE relative to camera (3-6 world units).
// They're "continents" on the pool floor. The macro scale inversion is the key.
import * as THREE from 'three'
import vertexShader from './shaders/starfish.vert.glsl?raw'
import fragmentShader from './shaders/starfish.frag.glsl?raw'

const _dummy = new THREE.Object3D()

// Organic star shape with bezier curves between points
// Source: Three.js examples/webgl_geometry_extrude_shapes
function createStarShape(outerR, innerR, numArms) {
  const shape = new THREE.Shape()
  for (let i = 0; i < numArms; i++) {
    const angle = (i / numArms) * Math.PI * 2 - Math.PI / 2
    const nextAngle = ((i + 0.5) / numArms) * Math.PI * 2 - Math.PI / 2
    const tipX = Math.cos(angle) * outerR
    const tipY = Math.sin(angle) * outerR
    const valleyX = Math.cos(nextAngle) * innerR
    const valleyY = Math.sin(nextAngle) * innerR
    // Control points for organic curves (not sharp points)
    const cp1x = Math.cos(angle + 0.15) * outerR * 0.65
    const cp1y = Math.sin(angle + 0.15) * outerR * 0.65
    const cp2x = Math.cos(nextAngle - 0.1) * innerR * 1.4
    const cp2y = Math.sin(nextAngle - 0.1) * innerR * 1.4
    if (i === 0) shape.moveTo(tipX, tipY)
    else shape.lineTo(tipX, tipY)
    shape.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, valleyX, valleyY)
  }
  shape.closePath()
  return shape
}

export default class Starfish {
  constructor(scene, config, getTerrainHeight) {
    const cfg = config.starfish ?? {}
    const count = cfg.count ?? 25
    const sizeRange = cfg.size ?? [3.0, 6.0]
    const color = cfg.color ?? [0.65, 0.25, 0.12]
    const textureFreq = cfg.textureFrequency ?? 8.0
    const moveSpeed = cfg.moveSpeed ?? 0.001

    // Create organic star shape (5 arms, 2:1 outer/inner ratio)
    const shape = createStarShape(1.0, 0.45, 5)

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.15,             // flat — starfish aren't thick
      bevelEnabled: true,
      bevelThickness: 0.08,   // rounded edges for organic feel
      bevelSize: 0.12,
      bevelSegments: 2,
    })
    // Rotate to lay flat on XZ plane (ExtrudeGeometry extrudes along Z)
    geo.rotateX(-Math.PI / 2)

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMoveSpeed: { value: moveSpeed },
        uColor: { value: new THREE.Color(...color) },
        uSunDirection: { value: new THREE.Vector3(0.1, -0.95, 0.05).normalize() },
        uSunColor: { value: new THREE.Color(0.45, 0.65, 0.80) },
        uBrightness: { value: 1.0 },
        uTextureFreq: { value: textureFreq },
      },
      side: THREE.DoubleSide,
    })

    this.mesh = new THREE.InstancedMesh(geo, this.material, count)

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 140
      const z = (Math.random() - 0.5) * 140
      const y = getTerrainHeight ? getTerrainHeight(x, z) + 0.02 : 0.02
      const size = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0])

      _dummy.position.set(x, y, z)
      _dummy.rotation.set(0, Math.random() * Math.PI * 2, 0)
      _dummy.scale.setScalar(size)
      _dummy.updateMatrix()
      this.mesh.setMatrixAt(i, _dummy.matrix)
    }
    this.mesh.instanceMatrix.needsUpdate = true

    this.scene = scene
    scene.add(this.mesh)
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed
  }

  dispose() {
    if (this.mesh) this.scene.remove(this.mesh)
    this.mesh.geometry.dispose()
    this.material.dispose()
  }
}
