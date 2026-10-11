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

// Extrusion settings for crisp, beveled mathematical arcade glyphs
const GLYPH_EXTRUDE_CONFIG = {
  depth: 0.32,
  bevelEnabled: true,
  bevelThickness: 0.08,
  bevelSize: 0.06,
  bevelSegments: 2
};

// 1. Delta (Δ): Isometric hollow triangle with inner cutout
function buildDeltaGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 1.25);
  shape.lineTo(1.15, -0.9);
  shape.lineTo(-1.15, -0.9);
  shape.closePath();

  const hole = new THREE.Path();
  hole.moveTo(0, 0.55);
  hole.lineTo(-0.52, -0.52);
  hole.lineTo(0.52, -0.52);
  hole.closePath();
  shape.holes.push(hole);

  const geom = new THREE.ExtrudeGeometry(shape, GLYPH_EXTRUDE_CONFIG);
  geom.center();
  return geom;
}

// 2. Pi (π): Classical Greek Pi with top bar serifs and distinct pillars
function buildPiGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-1.05, 1.05);
  shape.lineTo(1.05, 1.05);
  shape.lineTo(1.05, 0.72);
  shape.lineTo(0.68, 0.72);
  shape.lineTo(0.68, -0.78);
  shape.lineTo(0.88, -0.85);
  shape.lineTo(0.88, -1.05);
  shape.lineTo(0.32, -1.05);
  shape.lineTo(0.32, 0.72);
  shape.lineTo(-0.25, 0.72);
  shape.lineTo(-0.25, -1.05);
  shape.lineTo(-0.68, -1.05);
  shape.lineTo(-0.68, 0.72);
  shape.lineTo(-1.05, 0.72);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, GLYPH_EXTRUDE_CONFIG);
  geom.center();
  return geom;
}

// 3. Sigma (Σ): Classical summation sign with sharp 45-degree angle vertices
function buildSigmaGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-0.95, 1.05);
  shape.lineTo(0.95, 1.05);
  shape.lineTo(0.95, 0.7);
  shape.lineTo(-0.12, 0.7);
  shape.lineTo(0.52, 0.0);
  shape.lineTo(-0.12, -0.7);
  shape.lineTo(0.95, -0.7);
  shape.lineTo(0.95, -1.05);
  shape.lineTo(-0.95, -1.05);
  shape.lineTo(-0.1, 0.0);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, GLYPH_EXTRUDE_CONFIG);
  geom.center();
  return geom;
}

// 4. Integral (∫): Fluid calculus integral ribbon with terminal hooks
function buildIntegralGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0.12, 1.25);
  shape.quadraticCurveTo(0.68, 1.25, 0.68, 0.85);
  shape.lineTo(0.36, 0.85);
  shape.quadraticCurveTo(0.36, 1.0, 0.12, 1.0);
  shape.lineTo(0.12, -0.7);
  shape.quadraticCurveTo(0.12, -1.0, -0.2, -1.0);
  shape.lineTo(-0.48, -1.0);
  shape.lineTo(-0.48, -1.25);
  shape.quadraticCurveTo(0.2, -1.25, 0.36, -0.7);
  shape.lineTo(0.36, 0.95);
  shape.quadraticCurveTo(0.36, 1.25, 0.12, 1.25);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, GLYPH_EXTRUDE_CONFIG);
  geom.center();
  return geom;
}

// 5. Square Root (√): Sharp radical checkmark with extended top roof
function buildSqrtGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-1.25, 0.05);
  shape.lineTo(-0.95, -0.28);
  shape.lineTo(-0.72, -0.28);
  shape.lineTo(-0.35, -1.15);
  shape.lineTo(-0.06, -1.15);
  shape.lineTo(0.42, 1.15);
  shape.lineTo(1.25, 1.15);
  shape.lineTo(1.25, 0.88);
  shape.lineTo(0.56, 0.88);
  shape.lineTo(0.16, -0.72);
  shape.lineTo(-0.25, -0.72);
  shape.lineTo(-0.55, 0.05);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, GLYPH_EXTRUDE_CONFIG);
  geom.center();
  return geom;
}

// 6. Plus (+): Clean arcade cross with beveled arms
function buildPlusGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const w = 0.34;
  const l = 0.95;
  shape.moveTo(-w, l);
  shape.lineTo(w, l);
  shape.lineTo(w, w);
  shape.lineTo(l, w);
  shape.lineTo(l, -w);
  shape.lineTo(w, -w);
  shape.lineTo(w, -l);
  shape.lineTo(-w, -l);
  shape.lineTo(-w, -w);
  shape.lineTo(-l, -w);
  shape.lineTo(-l, w);
  shape.lineTo(-w, w);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, GLYPH_EXTRUDE_CONFIG);
  geom.center();
  return geom;
}

// 7. Infinity (∞): Mathematical figure-8 lemniscate
function buildInfinityGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const segments = 40;
  const a = 1.05;
  for (let s = 0; s <= segments; s++) {
    const t = (s / segments) * Math.PI * 2;
    const denom = 1 + Math.sin(t) * Math.sin(t);
    const x = ((a * Math.cos(t)) / denom) * 1.45;
    const y = ((a * Math.sin(t) * Math.cos(t)) / denom) * 1.45;
    if (s === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, GLYPH_EXTRUDE_CONFIG);
  geom.center();
  return geom;
}

// 8. Tesseract (4D Hypercube Wireframe): Outer cube with concentric inner cube & 8 corner struts
function buildTesseractGroup(mat: THREE.Material, edgeMat: THREE.Material): { group: THREE.Group; innerGroup: THREE.Group } {
  const group = new THREE.Group();
  const innerGroup = new THREE.Group();

  const outerGeom = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const outerMesh = new THREE.Mesh(outerGeom, mat);
  const outerEdges = new THREE.LineSegments(new THREE.EdgesGeometry(outerGeom), edgeMat);
  group.add(outerMesh, outerEdges);

  const innerGeom = new THREE.BoxGeometry(0.75, 0.75, 0.75);
  const innerMesh = new THREE.Mesh(innerGeom, mat);
  const innerEdges = new THREE.LineSegments(new THREE.EdgesGeometry(innerGeom), edgeMat);
  innerGroup.add(innerMesh, innerEdges);
  group.add(innerGroup);

  const strutGeom = new THREE.BufferGeometry();
  const strutPositions = new Float32Array([
    -0.75, -0.75, -0.75,  -0.375, -0.375, -0.375,
     0.75, -0.75, -0.75,   0.375, -0.375, -0.375,
    -0.75,  0.75, -0.75,  -0.375,  0.375, -0.375,
     0.75,  0.75, -0.75,   0.375,  0.375, -0.375,
    -0.75, -0.75,  0.75,  -0.375, -0.375,  0.375,
     0.75, -0.75,  0.75,   0.375, -0.375,  0.375,
    -0.75,  0.75,  0.75,  -0.375,  0.375,  0.375,
     0.75,  0.75,  0.75,   0.375,  0.375,  0.375
  ]);
  strutGeom.setAttribute('position', new THREE.BufferAttribute(strutPositions, 3));
  const struts = new THREE.LineSegments(strutGeom, edgeMat);
  group.add(struts);

  return { group, innerGroup };
}

// 9. Gyroscope / Orbital Kinematics: Dual concentric gimbal rings with central diamond
function buildGyroscopeGroup(mat: THREE.Material, edgeMat: THREE.Material): { group: THREE.Group; innerGroup: THREE.Group } {
  const group = new THREE.Group();
  const innerGroup = new THREE.Group();

  const outerGeom = new THREE.TorusGeometry(1.2, 0.08, 12, 32);
  const outerMesh = new THREE.Mesh(outerGeom, mat);
  const outerEdges = new THREE.LineSegments(new THREE.EdgesGeometry(outerGeom, 35), edgeMat);
  group.add(outerMesh, outerEdges);

  const innerGeom = new THREE.TorusGeometry(0.85, 0.07, 12, 32);
  const innerMesh = new THREE.Mesh(innerGeom, mat);
  const innerEdges = new THREE.LineSegments(new THREE.EdgesGeometry(innerGeom, 35), edgeMat);
  innerGroup.add(innerMesh, innerEdges);
  innerGroup.rotation.x = Math.PI / 2;
  group.add(innerGroup);

  const coreGeom = new THREE.OctahedronGeometry(0.35, 0);
  const coreMesh = new THREE.Mesh(coreGeom, mat);
  const coreEdges = new THREE.LineSegments(new THREE.EdgesGeometry(coreGeom), edgeMat);
  innerGroup.add(coreMesh, coreEdges);

  return { group, innerGroup };
}

// 10. Atomic / Kepler Orbitals: 3 intersecting orbital rings around an icosahedron nucleus
function buildAtomOrbitGroup(mat: THREE.Material, edgeMat: THREE.Material): { group: THREE.Group; innerGroup: THREE.Group } {
  const group = new THREE.Group();
  const innerGroup = new THREE.Group();

  for (let a = 0; a < 3; a++) {
    const ringGeom = new THREE.TorusGeometry(1.15, 0.06, 8, 36);
    const ringMesh = new THREE.Mesh(ringGeom, mat);
    const ringEdges = new THREE.LineSegments(new THREE.EdgesGeometry(ringGeom, 35), edgeMat);
    const ringSub = new THREE.Group();
    ringSub.add(ringMesh, ringEdges);
    ringSub.rotation.x = Math.PI / 3;
    ringSub.rotation.z = (a * Math.PI) / 3;
    group.add(ringSub);
  }

  const nucleusGeom = new THREE.IcosahedronGeometry(0.35, 0);
  const nucleus = new THREE.Mesh(nucleusGeom, mat);
  const nucleusEdges = new THREE.LineSegments(new THREE.EdgesGeometry(nucleusGeom), edgeMat);
  innerGroup.add(nucleus, nucleusEdges);
  group.add(innerGroup);

  return { group, innerGroup };
}

// 11. Nested Icosahedron Gem: Faceted icosahedron with inner counter-rotating octahedron
function buildNestedIcosahedronGroup(mat: THREE.Material, edgeMat: THREE.Material): { group: THREE.Group; innerGroup: THREE.Group } {
  const group = new THREE.Group();
  const innerGroup = new THREE.Group();

  const outerGeom = new THREE.IcosahedronGeometry(1.15, 0);
  const outerMesh = new THREE.Mesh(outerGeom, mat);
  const outerEdges = new THREE.LineSegments(new THREE.EdgesGeometry(outerGeom), edgeMat);
  group.add(outerMesh, outerEdges);

  const innerGeom = new THREE.OctahedronGeometry(0.52, 0);
  const innerMesh = new THREE.Mesh(innerGeom, mat);
  const innerEdges = new THREE.LineSegments(new THREE.EdgesGeometry(innerGeom), edgeMat);
  innerGroup.add(innerMesh, innerEdges);
  group.add(innerGroup);

  return { group, innerGroup };
}

// 12. Dodecahedron Polyhedron: 12-sided pentagonal gem
function buildDodecahedronGroup(mat: THREE.Material, edgeMat: THREE.Material): { group: THREE.Group; innerGroup?: THREE.Group } {
  const group = new THREE.Group();
  const geom = new THREE.DodecahedronGeometry(1.1, 0);
  const mesh = new THREE.Mesh(geom, mat);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geom), edgeMat);
  group.add(mesh, edges);
  return { group };
}

// 13. Trefoil Knot: Smooth topological curve with neon contour
function buildTrefoilKnotGroup(mat: THREE.Material, edgeMat: THREE.Material): { group: THREE.Group; innerGroup?: THREE.Group } {
  const group = new THREE.Group();
  const geom = new THREE.TorusKnotGeometry(0.8, 0.22, 64, 12, 2, 3);
  const mesh = new THREE.Mesh(geom, mat);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geom, 25), edgeMat);
  group.add(mesh, edges);
  return { group };
}

// Screen post-processing shader: Clean, crisp cel-shaded arcade quantization with subtle CRT scanlines
// ZERO muddy Bayer dither noise
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

    void main() {
      vec4 texColor = texture2D(tDiffuse, vUv);
      vec3 col = texColor.rgb;

      // Soft vignette
      vec2 uvC = vUv - 0.5;
      float vig = clamp(1.0 - dot(uvC, uvC) * uVignette, 0.0, 1.0);
      col *= vig;

      // Vertical void background gradient: #060809 (top) to #08120e (bottom)
      vec3 bgVoid = mix(vec3(0.024, 0.031, 0.035), vec3(0.031, 0.071, 0.055), clamp(1.0 - vUv.y, 0.0, 1.0));

      // Subtle high-end arcade CRT scanline sheen (clean, no static noise)
      float scanline = 0.96 + 0.04 * sin(gl_FragCoord.y * 1.5);

      // Detect red/rose accent power-up objects vs emerald/mint math objects
      bool isAccent = (col.r > col.b * 1.25 && col.r > 0.12) || (col.r > col.g * 1.25 && col.r > 0.12);

      vec3 outCol;
      if (isAccent) {
        // Neon Ruby / Power-Up Arcade Ramp (clean, non-dithered cel steps)
        float lum = dot(col, vec3(0.3, 0.5, 0.2));
        if (lum < 0.04) {
          outCol = bgVoid;
        } else if (lum < 0.20) {
          outCol = vec3(0.20, 0.02, 0.05);   // #33050d deep crimson
        } else if (lum < 0.45) {
          outCol = vec3(0.88, 0.11, 0.28);   // #e11d48 electric ruby
        } else {
          outCol = vec3(0.98, 0.44, 0.52);   // #fb7185 luminous rose highlight
        }
      } else {
        // Emerald & Mint Vector Arcade Ramp (sharp, clean geometric facets)
        float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
        if (lum < 0.04) {
          outCol = bgVoid;                     // #060809 obsidian void
        } else if (lum < 0.16) {
          outCol = vec3(0.016, 0.15, 0.11);   // #04261c deep forest jade
        } else if (lum < 0.32) {
          outCol = vec3(0.02, 0.59, 0.41);    // #059669 vivid emerald
        } else if (lum < 0.55) {
          outCol = vec3(0.06, 0.73, 0.51);    // #10b981 brilliant jade
        } else {
          outCol = vec3(0.43, 0.91, 0.72);    // #6ee7b7 electric mint highlight
        }
      }

      outCol *= scanline;
      gl_FragColor = vec4(outCol, 1.0);
    }
  `
};

interface FloatingObjectItem {
  group: THREE.Group;
  innerGroup?: THREE.Group;
  anchor: THREE.Vector3;
  velocity: THREE.Vector3;
  angularVelocity: THREE.Vector3;
  baseRotation: THREE.Euler;
  driftSpeed: number;
  driftPhase: number;
  isRed: boolean;
  expansion: number;
  expansionVel: number;
  hitCooldown: number;
}

export default function MistBackground3D({
  pixelSize = 2,
  objectCount = 28,
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
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    const fogColor = 0x060809;
    scene.fog = new THREE.FogExp2(fogColor, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');

    if (!gl) {
      setWebglSupported(false);
      return;
    }

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
        antialias: true,
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

    // 2. High-Precision Render Target & Post-Processing Screen Quad
    let currentPixelSize = Math.max(1, propsRef.current.pixelSize);
    let rtW = Math.max(128, Math.floor(width / currentPixelSize));
    let rtH = Math.max(128, Math.floor(height / currentPixelSize));

    let renderTarget = new THREE.WebGLRenderTarget(rtW, rtH, {
      minFilter: THREE.LinearFilter,
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
        uVignette: { value: 0.50 }
      },
      depthWrite: false,
      depthTest: false
    });
    const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMaterial);
    postScene.add(postQuad);

    // 3. Shading & Materials (Rich Arcade Cell Palettes)
    const coolToonTex = createToonGradientTexture([0x04261c, 0x059669, 0x10b981, 0x6ee7b7]);
    const redToonTex = createToonGradientTexture([0x33050d, 0x9f1239, 0xe11d48, 0xfb7185]);

    const coolMaterial = new THREE.MeshToonMaterial({
      color: 0xffffff,
      gradientMap: coolToonTex
    });

    const redMaterial = new THREE.MeshToonMaterial({
      color: 0xffffff,
      gradientMap: redToonTex
    });

    // Crisp Neon Outlines for Edge Highlighting
    const mintEdgeMaterial = new THREE.LineBasicMaterial({
      color: 0x6ee7b7,
      transparent: true,
      opacity: 0.85
    });

    const rubyEdgeMaterial = new THREE.LineBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.85
    });

    // 4. Lighting Environment - Vibrant Arcade Vectors
    const keyLight = new THREE.DirectionalLight(0x34d399, 3.2);
    keyLight.position.set(16, 20, 14);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x064e3b, 2.2);
    fillLight.position.set(-14, -14, -8);
    scene.add(fillLight);

    const ambientLight = new THREE.AmbientLight(0x081e18, 1.8);
    scene.add(ambientLight);

    const accentPointLight = new THREE.PointLight(0x10b981, 2.8, 36);
    accentPointLight.position.set(6, 2, -4);
    scene.add(accentPointLight);

    // Dynamic cursor spotlight: casts electric mint glow as mouse moves across shapes
    const cursorLight = new THREE.PointLight(0x6ee7b7, 3.5, 24);
    cursorLight.position.set(0, 0, 5);
    scene.add(cursorLight);

    // 5. Shared Geometry Cache for Extruded Glyphs
    const sharedGeometries: THREE.BufferGeometry[] = [
      buildPiGeometry(),
      buildSigmaGeometry(),
      buildIntegralGeometry(),
      buildDeltaGeometry(),
      buildSqrtGeometry(),
      buildPlusGeometry(),
      buildInfinityGeometry()
    ];

    // 6. Spawn Floating 3D Objects (25-32 total, z from -2 to -38)
    const objects: FloatingObjectItem[] = [];
    const targetCount = Math.max(18, Math.min(36, propsRef.current.objectCount));
    const raycastTargets: THREE.Object3D[] = [];

    function isInExclusionZone(x: number, y: number, z: number): boolean {
      if (z > -12) {
        if (x >= -8.5 && x <= 0.8 && y >= -3.5 && y <= 3.8) {
          return true;
        }
      }
      return false;
    }

    let redObjectsCount = 0;
    const maxRedObjects = 5;

    for (let i = 0; i < targetCount; i++) {
      const isRed = propsRef.current.accentRed && redObjectsCount < maxRedObjects && (i % 6 === 2);
      if (isRed) redObjectsCount++;

      const mat = isRed ? redMaterial : coolMaterial;
      const edgeMat = isRed ? rubyEdgeMaterial : mintEdgeMaterial;

      let group: THREE.Group;
      let innerGroup: THREE.Group | undefined;

      // Type 0-6: Extruded mathematical glyphs
      // Type 7: Tesseract (4D Hypercube)
      // Type 8: Gyroscope (Concentric Rotational Rings)
      // Type 9: Kepler Atomic Orbitals
      // Type 10: Nested Icosahedron Gem
      // Type 11: Chamfered Dodecahedron
      // Type 12: Trefoil Knot
      const typeChoice = i % 13;

      if (typeChoice < 7) {
        const geom = sharedGeometries[typeChoice];
        group = new THREE.Group();
        const mesh = new THREE.Mesh(geom, mat);
        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geom, 35), edgeMat);
        group.add(mesh, edges);
      } else if (typeChoice === 7) {
        const res = buildTesseractGroup(mat, edgeMat);
        group = res.group;
        innerGroup = res.innerGroup;
      } else if (typeChoice === 8) {
        const res = buildGyroscopeGroup(mat, edgeMat);
        group = res.group;
        innerGroup = res.innerGroup;
      } else if (typeChoice === 9) {
        const res = buildAtomOrbitGroup(mat, edgeMat);
        group = res.group;
        innerGroup = res.innerGroup;
      } else if (typeChoice === 10) {
        const res = buildNestedIcosahedronGroup(mat, edgeMat);
        group = res.group;
        innerGroup = res.innerGroup;
      } else if (typeChoice === 11) {
        const res = buildDodecahedronGroup(mat, edgeMat);
        group = res.group;
      } else {
        const res = buildTrefoilKnotGroup(mat, edgeMat);
        group = res.group;
      }

      // Invisible raycasting sphere for smooth mouse interaction
      const raySphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.6, 8, 8),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      raySphere.userData = { parentIndex: i };
      group.add(raySphere);
      raycastTargets.push(raySphere);

      // Determine depth & spread
      const depthRatio = i / (targetCount - 1);
      const z = -2 - depthRatio * 36;
      const visibleHeightAtZ = 2 * Math.tan((45 * Math.PI) / 360) * (10 - z);
      const visibleWidthAtZ = visibleHeightAtZ * (width / height);

      let x = 0;
      let y = 0;
      let attempts = 0;

      do {
        x = (Math.random() - 0.5) * (visibleWidthAtZ * 0.92);
        y = (Math.random() - 0.5) * (visibleHeightAtZ * 0.85);
        attempts++;
      } while (isInExclusionZone(x, y, z) && attempts < 20);

      if (isInExclusionZone(x, y, z)) {
        x = 2.2 + Math.random() * 7.5;
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
        innerGroup,
        anchor: anchor.clone(),
        velocity: new THREE.Vector3(0, 0, 0),
        angularVelocity: new THREE.Vector3(0, 0, 0),
        baseRotation,
        driftSpeed: 0.25 + Math.random() * 0.45,
        driftPhase: Math.random() * Math.PI * 2,
        isRed,
        expansion: 0,
        expansionVel: 0,
        hitCooldown: 0
      });
    }

    // 7. Ambient Dust Motes (Crisp glowing particle constellation)
    const moteCount = 180;
    const motePositions = new Float32Array(moteCount * 3);
    for (let m = 0; m < moteCount; m++) {
      motePositions[m * 3 + 0] = (Math.random() - 0.5) * 44;
      motePositions[m * 3 + 1] = (Math.random() - 0.5) * 32;
      motePositions[m * 3 + 2] = -2 - Math.random() * 36;
    }

    const motesGeometry = new THREE.BufferGeometry();
    motesGeometry.setAttribute('position', new THREE.BufferAttribute(motePositions, 3));
    const motesMaterial = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 1.8,
      transparent: true,
      opacity: 0.40,
      sizeAttenuation: false
    });
    const motesPoints = new THREE.Points(motesGeometry, motesMaterial);
    scene.add(motesPoints);

    // 8. Interaction States: Cursor, Parallax, Repulsion, Shockwave
    const cursor = { x: 0, y: 0 };
    const prevCursor = { x: 0, y: 0 };
    let cursorVelocity = 0;
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2(0, 0);

    const shockwave = {
      active: false,
      origin: new THREE.Vector3(0, 0, -8),
      radius: 0,
      maxRadius: 36,
      speed: 18.0
    };

    let targetCameraZ = 10;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll));
      targetCameraZ = 10 - scrollProgress * propsRef.current.scrollDepth;
    };

    const onPointerMove = (e: PointerEvent) => {
      cursor.x = (e.clientX / window.innerWidth) * 2 - 1;
      cursor.y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseNDC.set(cursor.x, cursor.y);
    };

    const onPointerDown = (e: PointerEvent) => {
      mouseNDC.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
      raycaster.setFromCamera(mouseNDC, camera);
      const intersects = raycaster.intersectObjects(raycastTargets, true);

      if (intersects.length > 0) {
        shockwave.origin.copy(intersects[0].point);
      } else {
        const point3D = raycaster.ray.origin
          .clone()
          .add(raycaster.ray.direction.clone().multiplyScalar(14.0));
        shockwave.origin.copy(point3D);
      }

      shockwave.active = true;
      shockwave.radius = 0.2;

      objects.forEach((obj) => {
        obj.hitCooldown = 0;
      });
    };

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      if (renderer) {
        renderer.setSize(width, height);
      }

      currentPixelSize = Math.max(1, propsRef.current.pixelSize);
      rtW = Math.max(128, Math.floor(width / currentPixelSize));
      rtH = Math.max(128, Math.floor(height / currentPixelSize));

      renderTarget.dispose();
      renderTarget = new THREE.WebGLRenderTarget(rtW, rtH, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        stencilBuffer: false
      });
      postMaterial.uniforms.tDiffuse.value = renderTarget.texture;
      postMaterial.uniforms.uResolution.value.set(rtW, rtH);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // 9. Animation Loop
    let animId = 0;
    let isTabVisible = !document.hidden;
    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    let lastTime = performance.now();
    const tempClosest = new THREE.Vector3();

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);
      if (!isTabVisible) return;

      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(rawDt, 0.05);
      const simSpeed = propsRef.current.speed;

      // Cursor velocity
      const cursorDx = cursor.x - prevCursor.x;
      const cursorDy = cursor.y - prevCursor.y;
      cursorVelocity = Math.sqrt(cursorDx * cursorDx + cursorDy * cursorDy) / Math.max(dt, 0.001);
      prevCursor.x = cursor.x;
      prevCursor.y = cursor.y;

      // Camera Parallax
      if (!prefersReducedMotion) {
        const targetCamX = cursor.x * 2.5 * propsRef.current.parallax;
        const targetCamY = cursor.y * 1.5 * propsRef.current.parallax;
        camera.position.x += (targetCamX - camera.position.x) * 0.05;
        camera.position.y += (targetCamY - camera.position.y) * 0.05;
        camera.rotation.y = -targetCamX * 0.018 * propsRef.current.parallax;
        camera.rotation.x = targetCamY * 0.018 * propsRef.current.parallax;
      }

      camera.position.z += (targetCameraZ - camera.position.z) * 0.06;

      // Cursor Spotlight Tracking
      raycaster.setFromCamera(mouseNDC, camera);
      const cursorRay = raycaster.ray;
      const cursor3DFocus = cursorRay.origin.clone().add(cursorRay.direction.clone().multiplyScalar(14.0));
      cursorLight.position.lerp(cursor3DFocus, 0.20);

      // Shockwave
      if (shockwave.active) {
        shockwave.radius += shockwave.speed * dt;
        if (shockwave.radius > shockwave.maxRadius) {
          shockwave.active = false;
        }
      }

      // Update 3D Floating Artifacts with Spring Physics & Dynamic Reaction
      const activeObjects = Math.min(objects.length, propsRef.current.objectCount);

      for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        if (i >= activeObjects) {
          obj.group.visible = false;
          continue;
        }
        obj.group.visible = true;

        // Ambient idle drift
        const driftOffset = Math.sin(now * 0.001 * obj.driftSpeed * simSpeed + obj.driftPhase) * 0.32;
        const currentTargetPos = obj.anchor.clone();
        currentTargetPos.y += driftOffset;

        // Proximity calculation
        cursorRay.closestPointToPoint(obj.group.position, tempClosest);
        const distToRay = obj.group.position.distanceTo(tempClosest);
        const R_INTERACT = 5.5;
        let proximity = 0;
        if (distToRay < R_INTERACT) {
          proximity = 1.0 - (distToRay / R_INTERACT);
        }
        const smoothProximity = proximity * proximity * (3.0 - 2.0 * proximity);

        // Second-order spring expansion
        const targetExpansion = smoothProximity * 1.25;
        const springK = 26.0;
        const damping = 6.2;
        const forceExp = (targetExpansion - obj.expansion) * springK - obj.expansionVel * damping;
        obj.expansionVel += forceExp * dt;
        obj.expansion += obj.expansionVel * dt;
        if (obj.expansion < 0) {
          obj.expansion = 0;
          obj.expansionVel = 0;
        }

        // Elastic scaling & inner counter-rotation
        const scaleVal = 1.0 + obj.expansion * 0.35;
        obj.group.scale.set(scaleVal, scaleVal, scaleVal);

        if (obj.innerGroup) {
          // Inner core spins counter-clockwise faster when approached
          obj.innerGroup.rotation.y += (0.015 + smoothProximity * 0.06);
          obj.innerGroup.rotation.x += (0.010 + smoothProximity * 0.04);
        }

        // Repulsion physics
        if (!prefersReducedMotion && propsRef.current.repulsion > 0 && proximity > 0.001) {
          const repelDir = obj.group.position.clone().sub(tempClosest).normalize();
          const repelForce =
            smoothProximity *
            (3.8 + Math.min(cursorVelocity * 1.5, 7.0)) *
            6.0 *
            propsRef.current.repulsion;

          obj.velocity.add(repelDir.multiplyScalar(repelForce * dt));
          obj.angularVelocity.x += (Math.random() - 0.5) * repelForce * dt * 0.5;
          obj.angularVelocity.y += (Math.random() - 0.5) * repelForce * dt * 0.5;
        }

        // Shockwave impulse
        if (shockwave.active && obj.hitCooldown <= 0) {
          const distToShock = obj.group.position.distanceTo(shockwave.origin);
          if (Math.abs(distToShock - shockwave.radius) < 2.5) {
            const shockDir = obj.group.position.clone().sub(shockwave.origin).normalize();
            obj.velocity.add(shockDir.multiplyScalar(10.0));
            obj.expansionVel += 8.0;
            obj.angularVelocity.set(
              (Math.random() - 0.5) * 8.0,
              (Math.random() - 0.5) * 8.0,
              (Math.random() - 0.5) * 8.0
            );
            obj.hitCooldown = 1.0;
          }
        }
        if (obj.hitCooldown > 0) {
          obj.hitCooldown -= dt;
        }

        // Integrate Velocity
        const springAnchorK = 5.2;
        const drag = 3.6;
        const anchorForce = currentTargetPos.sub(obj.group.position).multiplyScalar(springAnchorK);
        obj.velocity.add(anchorForce.multiplyScalar(dt));
        obj.velocity.multiplyScalar(Math.max(0, 1 - drag * dt));
        obj.group.position.addScaledVector(obj.velocity, dt);

        // Integrate Rotation
        const rotDrag = 2.4;
        const rotRestoringK = 1.5;
        const targetRot = new THREE.Vector3(
          obj.baseRotation.x + now * 0.0003 * obj.driftSpeed * simSpeed,
          obj.baseRotation.y + now * 0.0005 * obj.driftSpeed * simSpeed,
          obj.baseRotation.z
        );

        obj.angularVelocity.x += (targetRot.x - obj.group.rotation.x) * rotRestoringK * dt;
        obj.angularVelocity.y += (targetRot.y - obj.group.rotation.y) * rotRestoringK * dt;
        obj.angularVelocity.multiplyScalar(Math.max(0, 1 - rotDrag * dt));

        obj.group.rotation.x += obj.angularVelocity.x * dt;
        obj.group.rotation.y += obj.angularVelocity.y * dt;
        obj.group.rotation.z += obj.angularVelocity.z * dt;
      }

      // Twinkle ambient dust motes
      motesPoints.rotation.y += 0.0003 * simSpeed;
      motesPoints.rotation.x += 0.00015 * simSpeed;

      // Render Scene to Low-Res Render Target, then Pass to Post Screen Quad
      if (renderer) {
        renderer.setRenderTarget(renderTarget);
        renderer.render(scene, camera);
        renderer.setRenderTarget(null);
        renderer.render(postScene, postCamera);
      }
    };

    animId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', onResize);

      renderTarget.dispose();
      postMaterial.dispose();
      postQuad.geometry.dispose();
      coolMaterial.dispose();
      redMaterial.dispose();
      mintEdgeMaterial.dispose();
      rubyEdgeMaterial.dispose();
      coolToonTex.dispose();
      redToonTex.dispose();
      sharedGeometries.forEach((g) => g.dispose());
      motesGeometry.dispose();
      motesMaterial.dispose();

      objects.forEach((obj) => {
        scene.remove(obj.group);
      });

      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  if (!webglSupported) {
    return (
      <div
        className={`fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#060809] to-[#08120e] ${className}`}
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
