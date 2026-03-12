// src/meadow/GrassChunkManager.js
import * as THREE from 'three'
import { createBladeGeometry, generateInstanceMatrices } from './GrassGeometry.js'
import { getTerrainHeight } from './TerrainPlane.js'
import grassVertexShader from './shaders/grass.vert.glsl?raw'
import grassFragmentShader from './shaders/grass.frag.glsl?raw'

const CHUNK_SIZE = 20        // world units per chunk side
const BLADES_PER_CHUNK = 20000
const ACTIVATE_DIST = CHUNK_SIZE * 3
const DISPOSE_DIST = CHUNK_SIZE * 1.5
const FADE_DURATION = 0.5    // seconds

// Colors from spacejack/terra
const BASE_COLOR = new THREE.Color(0.45, 0.46, 0.19)
const TIP_COLOR = new THREE.Color(0.77, 0.76, 0.59)
const SUN_COLOR = new THREE.Color(1.0, 1.0, 0.99)
const SUN_DIR = new THREE.Vector3(0.0, 0.21, -1.0).normalize() // ~12° elevation

export default class GrassChunkManager {
  constructor(scene, config, cloudTexture) {
    this.scene = scene
    this.maxChunks = config.grassChunks
    this.bladesPerChunk = Math.floor(config.grassCount / this.maxChunks)

    // Shared geometries (LOD)
    this.highGeo = createBladeGeometry(7)
    this.lowGeo = createBladeGeometry(1)

    // Shared material
    this.material = new THREE.ShaderMaterial({
      vertexShader: grassVertexShader,
      fragmentShader: grassFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: 1.5 },
        uHalfWidth: { value: 0.06 },
        uChunkFade: { value: 1.0 },
        uBaseColor: { value: BASE_COLOR },
        uTipColor: { value: TIP_COLOR },
        uSunDirection: { value: SUN_DIR },
        uSunColor: { value: SUN_COLOR },
        uAmbientStrength: { value: 0.7 },
        uTranslucencyStrength: { value: 1.5 },
        uFogFade: { value: 0.005 },
        uCloudTexture: { value: cloudTexture },
      },
      side: THREE.DoubleSide,
    })

    // Chunk pool
    this.chunks = new Map() // key: chunkIndex → { mesh, fadeStart, material }
    this.LOD_THRESHOLD = 15
  }

  update(cameraPos, elapsed, splineT) {
    // Update time uniform
    this.material.uniforms.uTime.value = elapsed

    // Determine which chunk indices should be active
    const camChunkZ = Math.floor(-cameraPos.z / CHUNK_SIZE)
    const activeRange = new Set()
    for (let i = camChunkZ - 1; i <= camChunkZ + 3; i++) {
      activeRange.add(i)
    }

    // Activate new chunks
    for (const idx of activeRange) {
      if (!this.chunks.has(idx) && this.chunks.size < this.maxChunks + 2) {
        this._createChunk(idx, elapsed)
      }
    }

    // Dispose old chunks
    for (const [idx, chunk] of this.chunks) {
      if (!activeRange.has(idx)) {
        this._disposeChunk(idx)
      }
    }

    // Update fade-in for new chunks
    for (const [idx, chunk] of this.chunks) {
      const age = elapsed - chunk.fadeStart
      const fade = Math.min(1.0, age / FADE_DURATION)
      chunk.material.uniforms.uChunkFade.value = fade
    }
  }

  _createChunk(idx, elapsed) {
    const offsetZ = -idx * CHUNK_SIZE
    const offsetX = 0

    // Generate instance matrices
    const matrices = generateInstanceMatrices(
      this.bladesPerChunk, CHUNK_SIZE, offsetX, offsetZ, getTerrainHeight
    )

    // Clone material for per-chunk uChunkFade
    const mat = this.material.clone()
    mat.uniforms.uChunkFade = { value: 0.0 }

    // Create InstancedMesh (high detail for now, LOD later)
    const mesh = new THREE.InstancedMesh(this.highGeo, mat, this.bladesPerChunk)
    mesh.instanceMatrix = new THREE.InstancedBufferAttribute(matrices, 16)
    mesh.frustumCulled = true

    this.scene.add(mesh)
    this.chunks.set(idx, { mesh, material: mat, fadeStart: elapsed })
  }

  _disposeChunk(idx) {
    const chunk = this.chunks.get(idx)
    if (!chunk) return
    this.scene.remove(chunk.mesh)
    chunk.mesh.dispose()
    chunk.material.dispose()
    this.chunks.delete(idx)
  }

  dispose() {
    for (const [idx] of this.chunks) {
      this._disposeChunk(idx)
    }
    this.highGeo.dispose()
    this.lowGeo.dispose()
    this.material.dispose()
  }
}
