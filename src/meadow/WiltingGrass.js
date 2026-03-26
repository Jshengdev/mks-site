// WiltingGrass — standalone drooping golden-brown grass system
// For worlds where grass is dying/wilting (memory-garden, autumn scenes)
// Heavy droop physics: gravity pulls blade tips down quadratically
// Wind from Nitash-Biswas, translucent lighting from al-ro
import * as THREE from 'three'
import vertexShader from './shaders/wilting-grass.vert.glsl?raw'
import fogUtils from './shaders/_fog-utils.glsl?raw'
import fragmentShaderSrc from './shaders/wilting-grass.frag.glsl?raw'
const fragmentShader = fogUtils + '\n' + fragmentShaderSrc

const SUN_DIR = new THREE.Vector3(0.0, 0.21, -1.0).normalize()
const SUN_COLOR = new THREE.Color(1.0, 1.0, 0.99)

export default class WiltingGrass {
  constructor(scene, count = 8000, getTerrainHeight, config = {}) {
    this._getTerrainHeight = getTerrainHeight

    const baseColor = config.baseColor
      ? new THREE.Color().setRGB(...config.baseColor)
      : new THREE.Color(0.12, 0.09, 0.03) // dark warm brown
    const tipColor = config.tipColor
      ? new THREE.Color().setRGB(...config.tipColor)
      : new THREE.Color(0.30, 0.22, 0.08) // golden amber tips
    const fogColor = config.fogColor
      ? new THREE.Color().setRGB(...config.fogColor)
      : new THREE.Color(0.18, 0.14, 0.06)

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uWindSpeed: { value: config.windSpeed ?? 0.3 },
        uDroopStrength: { value: config.droopStrength ?? 0.6 },
        uBaseColor: { value: baseColor },
        uTipColor: { value: tipColor },
        uSunDirection: { value: SUN_DIR },
        uSunColor: { value: SUN_COLOR },
        uTranslucency: { value: config.translucency ?? 1.5 },
        uFogDensity: { value: config.fogDensity ?? 0.025 },
        uFogColor: { value: fogColor },
      },
    })

    // Blade geometry: thin triangle strip (3 segments for visible droop)
    const bladeGeo = this._createBlade()

    const mesh = new THREE.InstancedMesh(bladeGeo, this.material, count)
    const dummy = new THREE.Object3D()
    const phases = new Float32Array(count)
    const scales = new Float32Array(count)
    let placed = 0

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 180
      const z = (Math.random() - 0.5) * 180
      const y = getTerrainHeight ? getTerrainHeight(x, z) : 0

      dummy.position.set(x, y, z)
      dummy.rotation.y = Math.random() * Math.PI * 2
      const s = 0.6 + Math.random() * 0.8 // height variation
      dummy.scale.set(1, s, 1)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      phases[i] = Math.random() * Math.PI * 2
      scales[i] = s
      placed++
    }

    mesh.count = placed
    mesh.instanceMatrix.needsUpdate = true

    // Per-instance attributes
    mesh.geometry.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1))
    mesh.geometry.setAttribute('aScale', new THREE.InstancedBufferAttribute(scales, 1))

    this.mesh = mesh
    this.scene = scene
    scene.add(mesh)
  }

  _createBlade() {
    // 3-segment grass blade (enough geometry to show visible droop curve)
    // Stolen geometry approach from Nitash-Biswas grass-shader-glsl
    const vertices = new Float32Array([
      // Bottom (y=0)
      -0.04, 0.0, 0.0,
       0.04, 0.0, 0.0,
      // Low-mid (y=0.3)
      -0.035, 0.3, 0.0,
       0.035, 0.3, 0.0,
      // High-mid (y=0.6)
      -0.02, 0.6, 0.0,
       0.02, 0.6, 0.0,
      // Tip (y=1.0)
       0.0, 1.0, 0.0,
    ])

    const indices = new Uint16Array([
      0, 1, 2,  2, 1, 3,  // bottom quad
      2, 3, 4,  4, 3, 5,  // mid quad
      4, 5, 6,            // tip triangle
    ])

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    geo.setIndex(new THREE.BufferAttribute(indices, 1))
    geo.computeVertexNormals()
    return geo
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
