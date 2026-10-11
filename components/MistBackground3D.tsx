"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface MistBackground3DProps {
  pixelSize?: number;
  objectCount?: number;
  speed?: number;
  parallax?: number;
  repulsion?: number;
  scrollDepth?: number;
  accentRed?: boolean;
  selector?: string;
  className?: string;
}

// 4-step discrete gradient map generator for MeshToonMaterial
function createToonGradientTexture(hexColors: number[]): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = hexColors.length;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    hexColors.forEach((color, i) => {
      ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
      ctx.fillRect(i, 0, 1, 1);
    });
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  return texture;
}

// Voxel bit patterns for mathematical / scientific glyphs
// Each entry is a 2D array of rows, rendered with depth (2-3 voxels)
const VOXEL_GLYPH_PATTERNS: { name: string; grid: number[][]; depth: number }[] = [
  // x²: x on left, superscript 2 on right
  {
    name: 'x_squared',
    grid: [
      [1, 0, 1, 0, 1, 1],
      [0, 1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 1],
      [0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 1]
    ],
    depth: 2
  },
  // √: square root sign
  {
    name: 'sqrt',
    grid: [
      [0, 0, 0, 1, 1, 1, 1],
      [0, 0, 1, 0, 0, 0, 0],
      [1, 0, 1, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0]
    ],
    depth: 2
  },
  // π: pi
  {
    name: 'pi',
    grid: [
      [1, 1, 1, 1, 1],
      [0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0],
      [1, 1, 0, 1, 1]
    ],
    depth: 2
  },
  // ∫: integral
  {
    name: 'integral',
    grid: [
      [0, 0, 1, 1],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [1, 1, 0, 0]
    ],
    depth: 2
  },
  // Σ: sigma
  {
    name: 'sigma',
    grid: [
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1]
    ],
    depth: 2
  },
  // +: plus
  {
    name: 'plus',
    grid: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0]
    ],
    depth: 3
  },
  // =: equals
  {
    name: 'equals',
    grid: [
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [1, 1, 1, 1]
    ],
    depth: 2
  },
  // Δ: delta
  {
    name: 'delta',
    grid: [
      [0, 0, 1, 0, 0],
      [0, 1, 0, 1, 0],
      [1, 1, 1, 1, 1]
    ],
    depth: 2
  },
  // ∞: infinity
  {
    name: 'infinity',
    grid: [
      [1, 1, 0, 1, 1],
      [1, 0, 1, 0, 1],
      [1, 1, 0, 1, 1]
    ],
    depth: 2
  },
  // 8: numeral eight
  {
    name: 'num_8',
    grid: [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1]
    ],
    depth: 2
  },
  // 1: numeral one
  {
    name: 'num_1',
    grid: [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 1]
    ],
    depth: 2
  },
  // 0: numeral zero
  {
    name: 'num_0',
    grid: [
      [1, 1, 1],
      [1, 0, 1],
      [1, 0, 1],
      [1, 0, 1],
      [1, 1, 1]
    ],
    depth: 2
  }
];

// Screen post-processing shader with 4x4 Bayer dither & strict palette quantization
const PostShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    uniform float uVignette;
    varying vec2 vUv;

    // 4x4 Bayer Matrix
    float bayer4(vec2 coord) {
      int x = int(mod(coord.x, 4.0));
      int y = int(mod(coord.y, 4.0));
      int idx = x + y * 4;
      float m[16];
      m[0]  =  0.0 / 16.0; m[1]  =  8.0 / 16.0; m[2]  =  2.0 / 16.0; m[3]  = 10.0 / 16.0;
      m[4]  = 12.0 / 16.0; m[5]  =  4.0 / 16.0; m[6]  = 14.0 / 16.0; m[7]  =  6.0 / 16.0;
      m[8]  =  3.0 / 16.0; m[9]  = 11.0 / 16.0; m[10] =  1.0 / 16.0; m[11] =  9.0 / 16.0;
      m[12] = 15.0 / 16.0; m[13] =  7.0 / 16.0; m[14] = 13.0 / 16.0; m[15] =  5.0 / 16.0;
      for (int i = 0; i < 16; i++) {
        if (i == idx) return m[i];
      }
      return 0.0;
    }

    void main() {
      vec4 texColor = texture2D(tDiffuse, vUv);
      vec3 col = texColor.rgb;

      // Soft vignette (darkens screen periphery subtly)
      vec2 uvC = vUv - 0.5;
      float vig = clamp(1.0 - dot(uvC, uvC) * uVignette, 0.0, 1.0);
      col *= vig;

      // Vertical void background gradient: #060809 (top) to #091410 (bottom) - Emerald Matrix
      vec3 bgVoid = mix(vec3(0.024, 0.031, 0.035), vec3(0.035, 0.078, 0.063), clamp(1.0 - vUv.y, 0.0, 1.0));

      // Bayer dither offset: -0.06 to +0.06 to create authentic 8-bit crosshatch transitions
      float dither = (bayer4(gl_FragCoord.xy) - 0.5) * 0.12;

      // Detect accent objects vs cool teal/mint objects
      bool isAccent = (col.r > col.b * 1.25 && col.r > 0.10) || (col.g > 0.4 && col.b < 0.3);

      vec3 outCol;
      if (isAccent) {
        // Emerald Matrix accent ramp (vivid jade to electric mint)
        float lum = dot(col, vec3(0.3, 0.5, 0.2)) + dither * 0.5;
        if (lum < 0.052) {
          outCol = bgVoid;
        } else if (lum < 0.18) {
          outCol = vec3(0.016, 0.149, 0.122);    // #04261f dark pine
        } else if (lum < 0.34) {
          outCol = vec3(0.020, 0.588, 0.412);    // #059669 vibrant jade
        } else {
          outCol = vec3(0.204, 0.827, 0.600);    // #34d399 electric mint
        }
      } else {
        // Emerald Matrix mathematical voxels ramp (deep forest teal to luminous mint)
        float lum = dot(col, vec3(0.2126, 0.7152, 0.0722)) + dither * 0.5;
        if (lum < 0.052) {
          outCol = bgVoid;                         // #060809 obsidian void
        } else if (lum < 0.15) {
          outCol = vec3(0.024, 0.169, 0.137);    // #062b23 deep forest teal
        } else if (lum < 0.28) {
          outCol = vec3(0.051, 0.329, 0.259);    // #0d5442 emerald depth
        } else if (lum < 0.42) {
          outCol = vec3(0.063, 0.725, 0.506);    // #10b981 vivid emerald
        } else {
          outCol = vec3(0.431, 0.906, 0.718);    // #6ee7b7 luminous mint highlight
        }
      }

      gl_FragColor = vec4(outCol, 1.0);
    }
  `
};

interface FloatingObjectItem {
  group: THREE.Group;
  anchor: THREE.Vector3;
  velocity: THREE.Vector3;
  angularVelocity: THREE.Vector3;
  baseRotation: THREE.Euler;
  driftSpeed: number;
  driftPhase: number;
  isRed: boolean;
  isVoxel: boolean;
  // Second-order physics expansion state
  expansion: number;
  expansionVel: number;
  instancedMesh?: THREE.InstancedMesh;
  localVoxelPositions?: THREE.Vector3[];
  randomOffsets?: THREE.Vector3[];
  radialOffsets?: THREE.Vector3[];
  hitCooldown: number;
}

export default function MistBackground3D({
  pixelSize = 4,
  objectCount = 30,
  speed = 0.7,
  parallax = 1,
  repulsion = 1,
  scrollDepth = 12,
  accentRed = true,
  selector = '[data-mist-source]',
  className = ''
}: MistBackground3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  // Dynamic props ref so animation loop picks them up without tearing down scene
  const propsRef = useRef({
    pixelSize,
    objectCount,
    speed,
    parallax,
    repulsion,
    scrollDepth,
    accentRed,
    selector
  });

  useEffect(() => {
    propsRef.current = {
      pixelSize,
      objectCount,
      speed,
      parallax,
      repulsion,
      scrollDepth,
      accentRed,
      selector
    };
  }, [pixelSize, objectCount, speed, parallax, repulsion, scrollDepth, accentRed, selector]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Cap DPR at 1 for authentic pixelation and performance
    const dpr = 1;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    const fogColor = 0x070b16;
    scene.fog = new THREE.FogExp2(fogColor, 0.013);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    // Acquire and guard WebGL context
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');

    if (!gl) {
      setWebglSupported(false);
      return;
    }

    // Guard against headless/software GL returning null for getShaderPrecisionFormat
    if (typeof (gl as any).getShaderPrecisionFormat === 'function') {
      const origPrecision = (gl as any).getShaderPrecisionFormat.bind(gl);
      (gl as any).getShaderPrecisionFormat = (shaderType: number, precisionType: number) => {
        const res = origPrecision(shaderType, precisionType);
        return res || { rangeMin: 1, rangeMax: 1, precision: 23 };
      };
    }

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        context: gl as WebGLRenderingContext,
        antialias: false,
        powerPreference: 'high-performance',
        alpha: false
      });
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height);
      renderer.setClearColor(fogColor, 1);
    } catch (err) {
      console.error('WEBGL INIT ERROR:', err);
      setWebglSupported(false);
      return;
    }

    // 2. Low-Res Render Target & Post-Processing Screen Quad
    let currentPixelSize = propsRef.current.pixelSize;
    let rtW = Math.max(64, Math.floor(width / currentPixelSize));
    let rtH = Math.max(64, Math.floor(height / currentPixelSize));

    let renderTarget = new THREE.WebGLRenderTarget(rtW, rtH, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false
    });

    const postScene = new THREE.Scene();
    const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const postMaterial = new THREE.ShaderMaterial({
      vertexShader: PostShader.vertexShader,
      fragmentShader: PostShader.fragmentShader,
      uniforms: {
        tDiffuse: { value: renderTarget.texture },
        uResolution: { value: new THREE.Vector2(rtW, rtH) },
        uVignette: { value: 0.55 }
      },
      depthWrite: false,
      depthTest: false
    });
    const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMaterial);
    postScene.add(postQuad);

    // 3. Shading & Materials (4-step MeshToonMaterial gradient maps) - Emerald Matrix
    const coolToonTex = createToonGradientTexture([0x062b23, 0x0d5442, 0x10b981, 0x6ee7b7]);
    const redToonTex = createToonGradientTexture([0x04261f, 0x059669, 0x10b981, 0x34d399]);

    const coolMaterial = new THREE.MeshToonMaterial({
      color: 0xffffff,
      gradientMap: coolToonTex
    });

    const redMaterial = new THREE.MeshToonMaterial({
      color: 0xffffff,
      gradientMap: redToonTex
    });

    const cyanEdgeMaterial = new THREE.LineBasicMaterial({
      color: 0x6ee7b7,
      transparent: true,
      opacity: 0.65
    });

    // 4. Lighting Environment - Emerald Matrix
    // Neon mint key light from upper right
    const keyLight = new THREE.DirectionalLight(0x34d399, 3.4);
    keyLight.position.set(18, 22, 14);
    scene.add(keyLight);

    // Deep jade fill light from lower left
    const fillLight = new THREE.DirectionalLight(0x0d5442, 2.0);
    fillLight.position.set(-16, -14, -8);
    scene.add(fillLight);

    // Ambient dark emerald void light
    const ambientLight = new THREE.AmbientLight(0x08201a, 1.6);
    scene.add(ambientLight);

    // Warm jade point light near projected hero cards
    const redPointLight = new THREE.PointLight(0x10b981, 2.5, 32);
    redPointLight.position.set(6, 2, -4);
    scene.add(redPointLight);

    // Dynamic cursor spotlight: casts electric mint glow (#5eead4) as mouse approaches shapes
    const cursorLight = new THREE.PointLight(0x5eead4, 3.8, 22);
    cursorLight.position.set(0, 0, 5);
    scene.add(cursorLight);

    // 5. Shared Geometries
    const voxelBoxGeom = new THREE.BoxGeometry(0.42, 0.42, 0.42);
    const lowPolyGeometries = [
      new THREE.IcosahedronGeometry(1.3, 0),
      new THREE.OctahedronGeometry(1.4, 0),
      new THREE.TorusKnotGeometry(0.9, 0.28, 16, 6),
      new THREE.DodecahedronGeometry(1.2, 0)
    ];

    // 6. Spawn Floating 3D Objects (25-35 total, z from -2 to -40)
    const objects: FloatingObjectItem[] = [];
    const targetCount = Math.max(20, Math.min(40, propsRef.current.objectCount));
    const raycastTargets: THREE.Object3D[] = [];

    // Helper: test if position is inside the center-left exclusion zone
    // Behind headline & body text at hero depth (z > -12)
    function isInExclusionZone(x: number, y: number, z: number): boolean {
      if (z > -12) {
        // Hero headline and subtext region in world coordinates
        if (x >= -8.5 && x <= 0.8 && y >= -3.5 && y <= 3.8) {
          return true;
        }
      }
      return false;
    }

    let redObjectsCount = 0;
    const maxRedObjects = 5;

    for (let i = 0; i < targetCount; i++) {
      const group = new THREE.Group();
      let isVoxel = i % 3 !== 0; // ~66% voxel glyphs, ~33% low-poly solids
      const isRed = propsRef.current.accentRed && redObjectsCount < maxRedObjects && (i % 6 === 2);
      if (isRed) redObjectsCount++;

      const mat = isRed ? redMaterial : coolMaterial;

      let instancedMesh: THREE.InstancedMesh | undefined;
      const localVoxelPositions: THREE.Vector3[] = [];
      const randomOffsets: THREE.Vector3[] = [];

      const radialOffsets: THREE.Vector3[] = [];

      if (isVoxel) {
        // Pick a voxel math glyph
        const glyphDef = VOXEL_GLYPH_PATTERNS[i % VOXEL_GLYPH_PATTERNS.length];
        const grid = glyphDef.grid;
        const rows = grid.length;
        const cols = grid[0].length;
        const depth = glyphDef.depth;
        const voxelSize = 0.46;

        // Collect occupied voxel cells
        const tempPositions: THREE.Vector3[] = [];
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 1) {
              for (let d = 0; d < depth; d++) {
                const vx = (c - cols / 2 + 0.5) * voxelSize;
                const vy = -(r - rows / 2 + 0.5) * voxelSize;
                const vz = (d - depth / 2 + 0.5) * voxelSize;
                tempPositions.push(new THREE.Vector3(vx, vy, vz));
              }
            }
          }
        }

        const count = tempPositions.length;
        instancedMesh = new THREE.InstancedMesh(voxelBoxGeom, mat, count);
        const matrix = new THREE.Matrix4();

        tempPositions.forEach((pos, idx) => {
          matrix.setPosition(pos);
          instancedMesh!.setMatrixAt(idx, matrix);
          localVoxelPositions.push(pos.clone());
          // Normalized radial direction away from glyph center for physical expansion
          const rad = pos.length() > 0.05 ? pos.clone().normalize() : new THREE.Vector3(0, 1, 0);
          radialOffsets.push(rad);
          randomOffsets.push(
            new THREE.Vector3(
              (Math.random() - 0.5) * 1.5,
              (Math.random() - 0.5) * 1.5,
              (Math.random() - 0.5) * 1.5
            )
          );
        });

        instancedMesh.instanceMatrix.needsUpdate = true;
        group.add(instancedMesh);

        // Invisible raycast bounding sphere
        const raySphere = new THREE.Mesh(
          new THREE.SphereGeometry(1.4, 8, 8),
          new THREE.MeshBasicMaterial({ visible: false })
        );
        raySphere.userData = { parentIndex: i };
        group.add(raySphere);
        raycastTargets.push(raySphere);
      } else {
        // Low-poly shape
        const geomIdx = (i / 3) % lowPolyGeometries.length;
        const geom = lowPolyGeometries[Math.floor(geomIdx)];
        const mesh = new THREE.Mesh(geom, mat);
        group.add(mesh);

        // Crisp cyan EdgesGeometry highlights on low-poly shapes
        const edgesGeom = new THREE.EdgesGeometry(geom);
        const edgeLine = new THREE.LineSegments(edgesGeom, cyanEdgeMaterial);
        group.add(edgeLine);

        mesh.userData = { parentIndex: i };
        raycastTargets.push(mesh);
      }

      // Wireframe cube special entry
      if (i === 1) {
        const wireGeom = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.8, 1.8, 1.8));
        const wireCube = new THREE.LineSegments(wireGeom, cyanEdgeMaterial);
        group.add(wireCube);
      }

      // Determine initial depth and coordinates with exclusion zone enforcement
      // Spread depth evenly from -2 to -40
      const depthRatio = i / (targetCount - 1);
      const z = -2 - depthRatio * 38;

      // Calculate safe spread at this depth (FOV projection width expands with depth)
      const visibleHeightAtZ = 2 * Math.tan((45 * Math.PI) / 360) * (10 - z);
      const visibleWidthAtZ = visibleHeightAtZ * (width / height);

      let x = 0;
      let y = 0;
      let attempts = 0;

      do {
        x = (Math.random() - 0.5) * (visibleWidthAtZ * 0.9);
        y = (Math.random() - 0.5) * (visibleHeightAtZ * 0.85);
        attempts++;
      } while (isInExclusionZone(x, y, z) && attempts < 20);

      // If still in exclusion zone, push to right side or bottom
      if (isInExclusionZone(x, y, z)) {
        x = 2.0 + Math.random() * 8.0;
      }

      const anchor = new THREE.Vector3(x, y, z);
      group.position.copy(anchor);

      const baseRotation = new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      group.rotation.copy(baseRotation);

      scene.add(group);

      objects.push({
        group,
        anchor: anchor.clone(),
        velocity: new THREE.Vector3(0, 0, 0),
        angularVelocity: new THREE.Vector3(0, 0, 0),
        baseRotation,
        driftSpeed: 0.2 + Math.random() * 0.4,
        driftPhase: Math.random() * Math.PI * 2,
        isRed,
        isVoxel,
        expansion: 0,
        expansionVel: 0,
        instancedMesh,
        localVoxelPositions,
        randomOffsets,
        radialOffsets,
        hitCooldown: 0
      });
    }

    // 7. Dust Motes (150-250 points, dim cyan/white drifting up, twinkling)
    const moteCount = 200;
    const motePositions = new Float32Array(moteCount * 3);
    const motePhases = new Float32Array(moteCount);
    const moteDriftSpeeds = new Float32Array(moteCount);

    for (let m = 0; m < moteCount; m++) {
      motePositions[m * 3 + 0] = (Math.random() - 0.5) * 45;
      motePositions[m * 3 + 1] = (Math.random() - 0.5) * 30;
      motePositions[m * 3 + 2] = -2 - Math.random() * 38;
      motePhases[m] = Math.random() * Math.PI * 2;
      moteDriftSpeeds[m] = 0.3 + Math.random() * 0.5;
    }

    const motesGeometry = new THREE.BufferGeometry();
    motesGeometry.setAttribute('position', new THREE.BufferAttribute(motePositions, 3));

    const motesMaterial = new THREE.PointsMaterial({
      color: 0x3a8fb0,
      size: 1.5,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: false
    });

    const motesPoints = new THREE.Points(motesGeometry, motesMaterial);
    scene.add(motesPoints);

    // 8. Mist Sources Rising Instanced Points
    // Elements with data-mist-source emit rising haze from their top edges
    interface MistEmitter {
      worldX: number;
      worldY: number;
      worldWidth: number;
      worldZ: number;
    }
    let mistEmitters: MistEmitter[] = [];

    const hazeParticleCount = 180;
    const hazePositions = new Float32Array(hazeParticleCount * 3);
    const hazeLifetimes = new Float32Array(hazeParticleCount);
    const hazeMaxLifetimes = new Float32Array(hazeParticleCount);
    const hazeEmitterIndex = new Int32Array(hazeParticleCount);

    for (let h = 0; h < hazeParticleCount; h++) {
      hazeLifetimes[h] = Math.random() * 3.0;
      hazeMaxLifetimes[h] = 2.5 + Math.random() * 2.0;
      hazeEmitterIndex[h] = 0;
      hazePositions[h * 3 + 0] = 0;
      hazePositions[h * 3 + 1] = -999;
      hazePositions[h * 3 + 2] = -5;
    }

    const hazeGeometry = new THREE.BufferGeometry();
    hazeGeometry.setAttribute('position', new THREE.BufferAttribute(hazePositions, 3));

    const hazeMaterial = new THREE.PointsMaterial({
      color: 0x2f6f93,
      size: 1.8,
      transparent: true,
      opacity: 0.32,
      sizeAttenuation: false
    });

    const hazePoints = new THREE.Points(hazeGeometry, hazeMaterial);
    scene.add(hazePoints);

    // Measure [data-mist-source] elements and project top edges to 3D space
    const updateMistEmitters = () => {
      if (typeof document === 'undefined') return;
      const elements = document.querySelectorAll(propsRef.current.selector);
      const newEmitters: MistEmitter[] = [];

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Skip invisible or offscreen elements
        if (rect.width <= 0 || rect.height <= 0) return;
        if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;

        // Project top-left and top-right screen coordinates to 3D world space at z = -5
        const targetZ = -5.0;
        const distFromCam = camera.position.z - targetZ;

        // Normalized Device Coordinates
        const ndcLeft = (rect.left / window.innerWidth) * 2 - 1;
        const ndcRight = (rect.right / window.innerWidth) * 2 - 1;
        const ndcTop = -(rect.top / window.innerHeight) * 2 + 1;

        const fovRad = (camera.fov * Math.PI) / 180;
        const visibleHeightAtDist = 2 * Math.tan(fovRad / 2) * distFromCam;
        const visibleWidthAtDist = visibleHeightAtDist * (window.innerWidth / window.innerHeight);

        const worldXLeft = camera.position.x + (ndcLeft * visibleWidthAtDist) / 2;
        const worldXRight = camera.position.x + (ndcRight * visibleWidthAtDist) / 2;
        const worldYTop = camera.position.y + (ndcTop * visibleHeightAtDist) / 2;

        newEmitters.push({
          worldX: (worldXLeft + worldXRight) / 2,
          worldY: worldYTop,
          worldWidth: Math.max(1.0, worldXRight - worldXLeft),
          worldZ: targetZ
        });
      });

      mistEmitters = newEmitters;
    };

    updateMistEmitters();

    // 9. Interaction States: Cursor, Parallax, Repulsion, Shockwave
    const cursor = { x: 0, y: 0, rawX: width / 2, rawY: height / 2 };
    const prevCursor = { x: 0, y: 0 };
    let cursorVelocity = 0;
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2(0, 0);

    // Shockwave state
    const shockwave = {
      active: false,
      origin: new THREE.Vector3(0, 0, -8),
      radius: 0,
      maxRadius: 36,
      speed: 26,
      lastTrigger: 0
    };

    // Scroll state
    let targetCameraZ = 10;
    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollRatio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      targetCameraZ = 10 - scrollRatio * propsRef.current.scrollDepth;
    };
    handleScroll();

    // Event Listeners
    let prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
    };
    motionQuery.addEventListener('change', handleMotionChange);

    const onPointerMove = (e: PointerEvent) => {
      cursor.rawX = e.clientX;
      cursor.rawY = e.clientY;
      // Normalized coordinates (-1 to 1)
      cursor.x = (e.clientX / window.innerWidth) * 2 - 1;
      cursor.y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseNDC.set(cursor.x, cursor.y);
    };

    const onPointerDown = (e: PointerEvent) => {
      const now = performance.now();
      // Cooldown 400ms
      if (now - shockwave.lastTrigger < 400) return;
      shockwave.lastTrigger = now;

      // Project click point into world space at z = -8
      const clickNDC = new THREE.Vector3(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
        0.5
      );
      clickNDC.unproject(camera);
      const dir = clickNDC.sub(camera.position).normalize();
      const dist = (-8 - camera.position.z) / dir.z;
      const worldClick = camera.position.clone().add(dir.multiplyScalar(dist));

      shockwave.active = true;
      shockwave.origin.copy(worldClick);
      shockwave.radius = 0.2;

      // Reset object shock cooldowns
      objects.forEach((obj) => {
        obj.hitCooldown = 0;
      });
    };

    let resizeObserver: ResizeObserver | null = null;
    let scrollRafId = 0;
    const onScrollThrottled = () => {
      handleScroll();
      if (!scrollRafId) {
        scrollRafId = requestAnimationFrame(() => {
          updateMistEmitters();
          scrollRafId = 0;
        });
      }
    };

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      if (renderer) {
        renderer.setSize(width, height);
      }

      currentPixelSize = propsRef.current.pixelSize;
      rtW = Math.max(64, Math.floor(width / currentPixelSize));
      rtH = Math.max(64, Math.floor(height / currentPixelSize));

      renderTarget.dispose();
      renderTarget = new THREE.WebGLRenderTarget(rtW, rtH, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        stencilBuffer: false
      });
      postMaterial.uniforms.tDiffuse.value = renderTarget.texture;
      postMaterial.uniforms.uResolution.value.set(rtW, rtH);

      updateMistEmitters();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('scroll', onScrollThrottled, { passive: true });
    window.addEventListener('resize', onResize);

    if (typeof ResizeObserver !== 'undefined' && document.body) {
      resizeObserver = new ResizeObserver(() => {
        updateMistEmitters();
      });
      resizeObserver.observe(document.body);
    }

    // 10. Animation Loop & Performance Guard
    let animId = 0;
    let isTabVisible = !document.hidden;
    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    let lastTime = performance.now();
    let slowFrameCounter = 0;
    const matrixTemp = new THREE.Matrix4();
    const posTemp = new THREE.Vector3();

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);

      if (!isTabVisible) return;

      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      // Cap delta time to prevent jumps
      const dt = Math.min(rawDt, 0.05);

      // Performance auto-throttling: if frame takes > 20ms consistently for 2 seconds (100 frames)
      if (rawDt > 0.02) {
        slowFrameCounter++;
        if (slowFrameCounter > 100) {
          if (currentPixelSize < 6) {
            currentPixelSize += 1;
            onResize();
          }
          slowFrameCounter = 0;
        }
      } else {
        slowFrameCounter = Math.max(0, slowFrameCounter - 1);
      }

      const simSpeed = propsRef.current.speed;

      // Cursor velocity tracking
      const cursorDx = cursor.x - prevCursor.x;
      const cursorDy = cursor.y - prevCursor.y;
      cursorVelocity = Math.sqrt(cursorDx * cursorDx + cursorDy * cursorDy) / Math.max(dt, 0.001);
      prevCursor.x = cursor.x;
      prevCursor.y = cursor.y;

      // 1. Camera Parallax & Dolly
      if (!prefersReducedMotion) {
        const targetCamX = cursor.x * 2.8 * propsRef.current.parallax;
        const targetCamY = cursor.y * 1.6 * propsRef.current.parallax;
        camera.position.x += (targetCamX - camera.position.x) * 0.05;
        camera.position.y += (targetCamY - camera.position.y) * 0.05;
        // Rotation ±4 degrees (0.07 rad)
        camera.rotation.y = -targetCamX * 0.02 * propsRef.current.parallax;
        camera.rotation.x = targetCamY * 0.02 * propsRef.current.parallax;
      } else {
        camera.position.x += (0 - camera.position.x) * 0.05;
        camera.position.y += (0 - camera.position.y) * 0.05;
        camera.rotation.set(0, 0, 0);
      }

      // Smooth scroll dolly
      camera.position.z += (targetCameraZ - camera.position.z) * 0.06;

      // 2. Cursor 3D Raycasting & Dynamic Spotlight Tracking
      raycaster.setFromCamera(mouseNDC, camera);
      const cursorRay = raycaster.ray;

      // Position the dynamic cyan spotlight near cursor's focal depth in the void
      const cursor3DFocus = cursorRay.origin.clone().add(cursorRay.direction.clone().multiplyScalar(15.0));
      cursorLight.position.lerp(cursor3DFocus, 0.20);

      // 3. Shockwave Expansion
      if (shockwave.active) {
        shockwave.radius += shockwave.speed * dt;
        if (shockwave.radius > shockwave.maxRadius) {
          shockwave.active = false;
        }
      }

      // 4. Update Floating 3D Objects with Realistic Spring Physics & Proximity Expansion
      const activeObjects = Math.min(objects.length, propsRef.current.objectCount);
      const tempClosest = new THREE.Vector3();

      for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        if (i >= activeObjects) {
          obj.group.visible = false;
          continue;
        }
        obj.group.visible = true;

        // Gentle sinusoidal ambient drift
        const driftOffset = Math.sin(now * 0.001 * obj.driftSpeed * simSpeed + obj.driftPhase) * 0.35;
        const currentTargetPos = obj.anchor.clone();
        currentTargetPos.y += driftOffset;

        // Calculate exact 3D distance between cursor ray and object center
        cursorRay.closestPointToPoint(obj.group.position, tempClosest);
        const distToRay = obj.group.position.distanceTo(tempClosest);

        // Interaction sphere around each object (R = 5.8 units)
        const R_INTERACT = 5.8;
        let proximity = 0;
        if (distToRay < R_INTERACT) {
          proximity = 1.0 - (distToRay / R_INTERACT);
        }
        // Smooth Hermite interpolation (0 at perimeter, 1 at center)
        const smoothProximity = proximity * proximity * (3.0 - 2.0 * proximity);

        // SECOND-ORDER DAMPED HARMONIC OSCILLATOR FOR EXPANSION:
        // As you move near a shape, target expansion swells up to 1.35
        const targetExpansion = smoothProximity * 1.35;
        const springK_exp = 28.0; // Responsive spring tension
        const damping_exp = 6.4;  // Damping ratio for natural elastic overshoot
        const forceExp = (targetExpansion - obj.expansion) * springK_exp - obj.expansionVel * damping_exp;
        obj.expansionVel += forceExp * dt;
        obj.expansion += obj.expansionVel * dt;
        if (obj.expansion < 0) {
          obj.expansion = 0;
          obj.expansionVel = 0;
        }

        // PHYSICAL EXPANSION ON GEOMETRY:
        if (obj.isVoxel) {
          // Voxel glyph: constituent cubes bloom outward radially from glyph center
          if (obj.instancedMesh && obj.localVoxelPositions && obj.randomOffsets && obj.radialOffsets) {
            if (obj.expansion > 0.002 || obj.expansionVel > 0.002) {
              const count = obj.localVoxelPositions.length;
              for (let v = 0; v < count; v++) {
                const base = obj.localVoxelPositions[v];
                const radial = obj.radialOffsets[v];
                const rnd = obj.randomOffsets[v];
                // Radial blossom + subtle chaos offset
                posTemp.copy(base)
                  .addScaledVector(radial, obj.expansion * 1.10)
                  .addScaledVector(rnd, obj.expansion * 0.30);
                matrixTemp.setPosition(posTemp);
                obj.instancedMesh.setMatrixAt(v, matrixTemp);
              }
              obj.instancedMesh.instanceMatrix.needsUpdate = true;
            } else if (obj.expansion === 0) {
              const count = obj.localVoxelPositions.length;
              for (let v = 0; v < count; v++) {
                matrixTemp.setPosition(obj.localVoxelPositions[v]);
                obj.instancedMesh.setMatrixAt(v, matrixTemp);
              }
              obj.instancedMesh.instanceMatrix.needsUpdate = true;
            }
          }
        } else {
          // Low-poly solid shapes: scale up elastically with breathing spring
          const s = 1.0 + obj.expansion * 0.45;
          obj.group.scale.set(s, s, s);
        }

        // PHYSICAL REPULSION & MOMENTUM TRANSFER:
        if (!prefersReducedMotion && propsRef.current.repulsion > 0 && proximity > 0.001) {
          const repelDir = obj.group.position.clone().sub(tempClosest).normalize();
          const repelForce =
            smoothProximity *
            (4.0 + Math.min(cursorVelocity * 1.5, 7.5)) *
            6.5 *
            propsRef.current.repulsion;

          obj.velocity.add(repelDir.multiplyScalar(repelForce * dt));
          // Apply realistic torque spin proportional to proximity and push force
          obj.angularVelocity.x += (Math.random() - 0.5) * repelForce * dt * 0.6;
          obj.angularVelocity.y += (Math.random() - 0.5) * repelForce * dt * 0.6;
        }

        // SHOCKWAVE PHYSICAL IMPULSE:
        if (shockwave.active && obj.hitCooldown <= 0) {
          const distToShock = obj.group.position.distanceTo(shockwave.origin);
          if (Math.abs(distToShock - shockwave.radius) < 2.8) {
            const shockDir = obj.group.position.clone().sub(shockwave.origin).normalize();
            obj.velocity.add(shockDir.multiplyScalar(11.0));
            // Explosive expansion burst from shockwave
            obj.expansionVel += 9.0;
            // 360 degree tumble spin
            obj.angularVelocity.set(
              (Math.random() - 0.5) * 10.0,
              (Math.random() - 0.5) * 10.0,
              (Math.random() - 0.5) * 10.0
            );
            obj.hitCooldown = 1.0;
          }
        }
        if (obj.hitCooldown > 0) {
          obj.hitCooldown -= dt;
        }

        // POSITION SPRING: Elastic restoration returning object to its anchor orbit
        const displacement = currentTargetPos.clone().sub(obj.group.position);
        const springK_pos = 5.2;
        const damping_pos = 3.6;
        obj.velocity.add(displacement.multiplyScalar(springK_pos * dt));
        obj.velocity.multiplyScalar(Math.exp(-damping_pos * dt));
        obj.group.position.add(obj.velocity.clone().multiplyScalar(dt));

        // ROTATION SPRING: Returning to ambient rotational drift
        const ambientRotSpeed = 0.16 * simSpeed;
        obj.group.rotation.x += (ambientRotSpeed * 0.6 + obj.angularVelocity.x) * dt;
        obj.group.rotation.y += (ambientRotSpeed + obj.angularVelocity.y) * dt;
        obj.angularVelocity.multiplyScalar(Math.exp(-4.2 * dt));
      }

      // 5. Update Dust Motes (drifting upward, twinkling)
      const motePosAttr = motesGeometry.attributes.position as THREE.BufferAttribute;
      const mPositions = motePosAttr.array as Float32Array;

      for (let m = 0; m < moteCount; m++) {
        // Drift up
        mPositions[m * 3 + 1] += moteDriftSpeeds[m] * simSpeed * dt;
        if (mPositions[m * 3 + 1] > 18) {
          mPositions[m * 3 + 1] = -18;
          mPositions[m * 3 + 0] = (Math.random() - 0.5) * 45;
        }
      }
      motePosAttr.needsUpdate = true;
      // Twinkle opacity
      motesMaterial.opacity = 0.28 + Math.sin(now * 0.002) * 0.08;

      // 6. Update Rising Mist Source Haze
      if (mistEmitters.length > 0) {
        const hazePosAttr = hazeGeometry.attributes.position as THREE.BufferAttribute;
        const hPositions = hazePosAttr.array as Float32Array;

        for (let h = 0; h < hazeParticleCount; h++) {
          hazeLifetimes[h] += dt;
          if (hazeLifetimes[h] >= hazeMaxLifetimes[h]) {
            // Respawn at a random emitter top edge
            const emitterIdx = Math.floor(Math.random() * mistEmitters.length);
            const emitter = mistEmitters[emitterIdx];
            hazeEmitterIndex[h] = emitterIdx;
            hazeLifetimes[h] = 0;
            hazeMaxLifetimes[h] = 2.5 + Math.random() * 2.0;

            const spreadX = (Math.random() - 0.5) * emitter.worldWidth;
            hPositions[h * 3 + 0] = emitter.worldX + spreadX;
            hPositions[h * 3 + 1] = emitter.worldY + 0.1;
            hPositions[h * 3 + 2] = emitter.worldZ + (Math.random() - 0.5) * 0.5;
          } else {
            // Rise upward with subtle sine wave wobble
            hPositions[h * 3 + 1] += 0.65 * simSpeed * dt;
            hPositions[h * 3 + 0] += Math.sin(now * 0.002 + h) * 0.15 * dt;
          }
        }
        hazePosAttr.needsUpdate = true;
      }

      // 7. Two-Pass Render Pipeline: Scene -> Low-Res Target -> Post-Processing Screen
      if (renderer) {
        renderer.setRenderTarget(renderTarget);
        renderer.render(scene, camera);

        renderer.setRenderTarget(null);
        renderer.render(postScene, postCamera);
      }
    };

    animId = requestAnimationFrame(animate);

    // 11. Complete Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animId);
      if (scrollRafId) cancelAnimationFrame(scrollRafId);

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('scroll', onScrollThrottled);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      motionQuery.removeEventListener('change', handleMotionChange);

      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      // Dispose Three.js objects
      renderTarget.dispose();
      postMaterial.dispose();
      postQuad.geometry.dispose();

      coolMaterial.dispose();
      redMaterial.dispose();
      coolToonTex.dispose();
      redToonTex.dispose();
      cyanEdgeMaterial.dispose();

      voxelBoxGeom.dispose();
      lowPolyGeometries.forEach((g) => g.dispose());
      motesGeometry.dispose();
      motesMaterial.dispose();
      hazeGeometry.dispose();
      hazeMaterial.dispose();

      objects.forEach((obj) => {
        scene.remove(obj.group);
      });

      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  if (!webglSupported) {
    // Graceful fallback to static dark background
    return (
      <div
        className={`fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#070b16] to-[#0a1226] ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          imageRendering: 'pixelated',
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
