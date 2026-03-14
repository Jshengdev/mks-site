// src/meadow/GrassChunkManager.js
import * as THREE from 'three'
import { createBladeGeometry, generateInstanceMatrices } from './GrassGeometry.js'
import { getTerrainHeight } from './TerrainPlane.js'
import grassVertexShader from './shaders/grass.vert.glsl?raw'
import grassFragmentShader from './shaders/grass.frag.glsl?raw'

const CHUNK_SIZE = 20        // world units per chunk side
const FADE_DURATION = 0.5    // seconds
const LOD_HYSTERESIS = 2     // dead-zone to prevent flip-flopping at boundary

// BotW/Ghibli-inspired meadow greens (richer than spacejack/terra defaults)
// BotW Hyrule Field greens — deep emerald base, vivid spring green tips
const BASE_COLOR = new THREE.Color(0.05, 0.18, 0.02)
const TIP_COLOR = new THREE.Color(0.22, 0.50, 0.10)
const SUN_COLOR = new THREE.Color(1.0, 0.92, 0.75)
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
        uHalfWidth: { value: 0.035 },
        uChunkFade: { value: 1.0 },
        uBaseColor: { value: BASE_COLOR },
        uTipColor: { value: TIP_COLOR },
        uSunDirection: { value: SUN_DIR },
        uSunColor: { value: SUN_COLOR },
        uAmbientStrength: { value: 0.35 },
        uTranslucencyStrength: { value: 2.0 },
        uFogFade: { value: 0.0015 },
        uCloudTexture: { value: cloudTexture },
        // Cursor wind push
        uCursorPos: { value: new THREE.Vector3(0, -100, 0) },
        uCursorRadius: { value: 4.0 },
        uCursorStrength: { value: 1.2 },
        uCursorVelocity: { value: new THREE.Vector2(0, 0) },
      },
      side: THREE.DoubleSide,
    })

    // Chunk pool
    this.chunks = new Map() // key: chunkIndex → { mesh, fadeStart, material }
    this.LOD_THRESHOLD = 15
  }

  update(cameraPos, elapsed) {
    // Determine which chunk indices should be active
    const camChunkZ = Math.floor(-cameraPos.z / CHUNK_SIZE)
    const activeRange = new Set()
    for (let i = camChunkZ - 1; i <= camChunkZ + 3; i++) {
      activeRange.add(i)
    }

    // Activate new chunks
    for (const idx of activeRange) {
      if (!this.chunks.has(idx) && this.chunks.size < this.maxChunks + 2) {
        this._createChunk(idx, elapsed, cameraPos)
      }
    }

    // Dispose chunks outside active range (collect keys first to avoid mutating during iteration)
    for (const idx of [...this.chunks.keys()]) {
      if (!activeRange.has(idx)) {
        this._disposeChunk(idx)
      }
    }

    // Per-chunk updates: time, LOD switching, fade-in
    for (const [idx, chunk] of this.chunks) {
      chunk.material.uniforms.uTime.value = elapsed

      // LOD switching with hysteresis
      const chunkCenterZ = -idx * CHUNK_SIZE - CHUNK_SIZE / 2
      const dist = Math.abs(cameraPos.z - chunkCenterZ)
      if (dist < this.LOD_THRESHOLD && chunk.lod === 'low') {
        this._swapLOD(idx, 'high')
      } else if (dist > this.LOD_THRESHOLD + LOD_HYSTERESIS && chunk.lod === 'high') {
        this._swapLOD(idx, 'low')
      }

      // Fade-in
      const fade = Math.min(1.0, (elapsed - chunk.fadeStart) / FADE_DURATION)
      chunk.material.uniforms.uChunkFade.value = fade
    }
  }

  _createChunk(idx, elapsed, cameraPos) {
    const offsetZ = -idx * CHUNK_SIZE

    // Generate instance matrices (stored for LOD swap reuse)
    const matrices = generateInstanceMatrices(
      this.bladesPerChunk, CHUNK_SIZE, 0, offsetZ, getTerrainHeight
    )

    // Determine initial LOD based on camera distance
    const chunkCenterZ = offsetZ - CHUNK_SIZE / 2
    const dist = Math.abs(cameraPos.z - chunkCenterZ)
    const lod = dist < this.LOD_THRESHOLD ? 'high' : 'low'
    const geo = lod === 'high' ? this.highGeo : this.lowGeo

    // Clone material for per-chunk uChunkFade
    const mat = this.material.clone()
    mat.uniforms.uChunkFade = { value: 0.0 }

    const mesh = new THREE.InstancedMesh(geo, mat, this.bladesPerChunk)
    mesh.instanceMatrix.array.set(matrices)
    mesh.instanceMatrix.needsUpdate = true
    mesh.frustumCulled = true

    this.scene.add(mesh)
    this.chunks.set(idx, { mesh, material: mat, fadeStart: elapsed, lod, matrices })
  }

  _swapLOD(idx, targetLOD) {
    const chunk = this.chunks.get(idx)
    if (!chunk) return

    const geo = targetLOD === 'high' ? this.highGeo : this.lowGeo

    // Remove old mesh
    this.scene.remove(chunk.mesh)
    chunk.mesh.dispose()

    // Create new mesh, reuse stored instance matrices
    const newMesh = new THREE.InstancedMesh(geo, chunk.material, this.bladesPerChunk)
    newMesh.instanceMatrix.array.set(chunk.matrices)
    newMesh.instanceMatrix.needsUpdate = true
    newMesh.frustumCulled = true

    this.scene.add(newMesh)
    chunk.mesh = newMesh
    chunk.lod = targetLOD
  }

  _disposeChunk(idx) {
    const chunk = this.chunks.get(idx)
    if (!chunk) return
    this.scene.remove(chunk.mesh)
    chunk.mesh.dispose()
    chunk.material.dispose()
    this.chunks.delete(idx)
  }

  // Set a uniform on the base material + all active chunk clones
  setUniform(key, value) {
    const baseU = this.material.uniforms[key]
    if (!baseU) return
    if (value && typeof value === 'object' && value.copy) {
      baseU.value.copy(value)
      for (const [, chunk] of this.chunks) chunk.material.uniforms[key].value.copy(value)
    } else {
      baseU.value = value
      for (const [, chunk] of this.chunks) chunk.material.uniforms[key].value = value
    }
  }

  // Update cursor position + velocity for grass wind brush effect
  updateCursor(worldPos, strength, velocity) {
    for (const [, chunk] of this.chunks) {
      chunk.material.uniforms.uCursorPos.value.copy(worldPos)
      chunk.material.uniforms.uCursorStrength.value = strength
      chunk.material.uniforms.uCursorVelocity.value.copy(velocity)
    }
  }

  dispose() {
    for (const idx of [...this.chunks.keys()]) {
      this._disposeChunk(idx)
    }
    this.highGeo.dispose()
    this.lowGeo.dispose()
    this.material.dispose()
  }
}
