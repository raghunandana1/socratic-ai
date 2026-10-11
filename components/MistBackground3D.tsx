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

// Extrusion settings for smooth, beveled mathematical 3D solids
const GLYPH_EXTRUDE_CONFIG = {
  depth: 0.36,
  bevelEnabled: true,
  bevelThickness: 0.09,
  bevelSize: 0.07,
  bevelSegments: 4,
  curveSegments: 24
};

// 1. Delta (Δ): Isometric hollow triangle with inner cutout
function buildDeltaGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 1.3);
  shape.lineTo(1.18, -0.9);
  shape.lineTo(-1.18, -0.9);
  shape.closePath();

  const hole = new THREE.Path();
  hole.moveTo(0, 0.58);
  hole.lineTo(-0.54, -0.52);
  hole.lineTo(0.54, -0.52);
  hole.closePath();
  shape.holes.push(hole);

  const geom = new THREE.ExtrudeGeometry(shape, GLYPH_EXTRUDE_CONFIG);
  geom.center();
  return geom;
}

// 2. Pi (π): Classical Greek Pi with top bar serifs and distinct pillars
function buildPiGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-1.08, 1.05);
  shape.lineTo(1.08, 1.05);
  shape.lineTo(1.08, 0.72);
  shape.lineTo(0.7, 0.72);
  shape.lineTo(0.7, -0.78);
  shape.lineTo(0.9, -0.85);
  shape.lineTo(0.9, -1.05);
  shape.lineTo(0.32, -1.05);
  shape.lineTo(0.32, 0.72);
  shape.lineTo(-0.25, 0.72);
  shape.lineTo(-0.25, -1.05);
  shape.lineTo(-0.7, -1.05);
  shape.lineTo(-0.7, 0.72);
  shape.lineTo(-1.08, 0.72);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, GLYPH_EXTRUDE_CONFIG);
  geom.center();
  return geom;
}

// 3. Sigma (Σ): Classical summation sign with sharp angle vertices
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
  shape.lineTo(-0.05, 0.0);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, GLYPH_EXTRUDE_CONFIG);
  geom.center();
  return geom;
}

// 4. Integral (∫): Flowing calculus integral symbol
function buildIntegralGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-0.35, 1.25);
  shape.bezierCurveTo(-0.05, 1.35, 0.55, 1.35, 0.55, 0.95);
  shape.bezierCurveTo(0.55, 0.65, 0.25, 0.55, 0.1, 0.4);
  shape.lineTo(-0.1, -0.4);
  shape.bezierCurveTo(-0.25, -0.55, -0.55, -0.65, -0.55, -0.95);
  shape.bezierCurveTo(-0.55, -1.35, 0.05, -1.35, 0.35, -1.25);
  shape.lineTo(0.28, -0.95);
  shape.bezierCurveTo(0.08, -1.05, -0.25, -1.05, -0.25, -0.85);
  shape.bezierCurveTo(-0.25, -0.65, -0.05, -0.5, 0.15, -0.3);
  shape.lineTo(0.35, 0.5);
  shape.bezierCurveTo(0.55, 0.7, 0.25, 1.05, -0.28, 0.95);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, GLYPH_EXTRUDE_CONFIG);
  geom.center();
  return geom;
}

// 5. Square Root Radical (√x)
function buildSqrtGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-1.15, -0.15);
  shape.lineTo(-0.85, -0.15);
  shape.lineTo(-0.62, -0.85);
  shape.lineTo(-0.22, 1.05);
  shape.lineTo(1.15, 1.05);
  shape.lineTo(1.15, 0.75);
  shape.lineTo(0.05, 0.75);
  shape.lineTo(-0.48, -0.95);
  shape.lineTo(-0.75, -0.95);
  shape.lineTo(-0.95, -0.45);
  shape.lineTo(-1.15, -0.45);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, GLYPH_EXTRUDE_CONFIG);
  geom.center();
  return geom;
}

// 6. Infinity (∞): Lemniscate
function buildInfinityGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const a = 1.05;
  const numPts = 64;

  const pts: THREE.Vector2[] = [];
  for (let i = 0; i < numPts; i++) {
    const t = (i / numPts) * Math.PI * 2;
    const denom = 1 + Math.sin(t) * Math.sin(t);
    const x = (a * Math.cos(t)) / denom;
    const y = (a * Math.sin(t) * Math.cos(t)) / denom;
    pts.push(new THREE.Vector2(x, y));
  }

  shape.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    shape.lineTo(pts[i].x, pts[i].y);
  }
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.32,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.06,
    bevelSegments: 3
  });
  geom.center();
  return geom;
}

// 7. 4D Hypercube / Tesseract
function buildTesseractGroup(
  outerMat: THREE.Material,
  innerMat: THREE.Material,
  edgeMat: THREE.Material
): { group: THREE.Group; innerGroup: THREE.Group } {
  const group = new THREE.Group();

  const outerGeom = new THREE.BoxGeometry(1.9, 1.9, 1.9);
  const outerMesh = new THREE.Mesh(outerGeom, outerMat);
  const outerWire = new THREE.LineSegments(new THREE.EdgesGeometry(outerGeom), edgeMat);
  outerMesh.add(outerWire);
  group.add(outerMesh);

  const innerGroup = new THREE.Group();
  const innerGeom = new THREE.BoxGeometry(0.95, 0.95, 0.95);
  const innerMesh = new THREE.Mesh(innerGeom, innerMat);
  const innerWire = new THREE.LineSegments(new THREE.EdgesGeometry(innerGeom), edgeMat);
  innerMesh.add(innerWire);
  innerGroup.add(innerMesh);
  group.add(innerGroup);

  const strutGeom = new THREE.BufferGeometry();
  const vOuter = [
    [-0.95, -0.95, -0.95], [0.95, -0.95, -0.95], [0.95, 0.95, -0.95], [-0.95, 0.95, -0.95],
    [-0.95, -0.95,  0.95], [0.95, -0.95,  0.95], [0.95, 0.95,  0.95], [-0.95, 0.95,  0.95]
  ];
  const vInner = vOuter.map(([x, y, z]) => [x * 0.5, y * 0.5, z * 0.5]);
  const strutPos: number[] = [];
  for (let i = 0; i < 8; i++) {
    strutPos.push(...vOuter[i], ...vInner[i]);
  }
  strutGeom.setAttribute('position', new THREE.Float32BufferAttribute(strutPos, 3));
  const struts = new THREE.LineSegments(strutGeom, edgeMat);
  group.add(struts);

  return { group, innerGroup };
}

// 8. Quantum Atomic Orbital System
function buildQuantumOrbitalGroup(
  ringMat: THREE.Material,
  coreMat: THREE.Material,
  edgeMat: THREE.Material
): { group: THREE.Group; innerGroup: THREE.Group } {
  const group = new THREE.Group();

  // Nucleus: Floating glowing core
  const nucleusGeom = new THREE.SphereGeometry(0.42, 24, 24);
  const nucleus = new THREE.Mesh(nucleusGeom, coreMat);
  group.add(nucleus);

  const innerGroup = new THREE.Group();
  const angles = [
    { x: 0, y: 0, z: 0 },
    { x: Math.PI / 3, y: Math.PI / 4, z: 0 },
    { x: -Math.PI / 3, y: -Math.PI / 4, z: Math.PI / 6 }
  ];

  angles.forEach(({ x, y, z }, idx) => {
    const radius = 1.15 + idx * 0.22;
    const ringGeom = new THREE.TorusGeometry(radius, 0.05, 16, 64);
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.rotation.set(x, y, z);
    const ringWire = new THREE.LineSegments(new THREE.EdgesGeometry(ringGeom), edgeMat);
    ring.add(ringWire);
    innerGroup.add(ring);
  });

  group.add(innerGroup);
  return { group, innerGroup };
}

// 9. Geodesic Icosahedron with floating glowing energy nucleus
function buildIcosahedronGem(
  gemMat: THREE.Material,
  coreMat: THREE.Material,
  edgeMat: THREE.Material
): { group: THREE.Group; innerGroup: THREE.Group } {
  const group = new THREE.Group();

  const geom = new THREE.IcosahedronGeometry(1.25, 0);
  const mesh = new THREE.Mesh(geom, gemMat);
  const wire = new THREE.LineSegments(new THREE.EdgesGeometry(geom), edgeMat);
  mesh.add(wire);
  group.add(mesh);

  const innerGroup = new THREE.Group();
  const coreGeom = new THREE.OctahedronGeometry(0.5, 0);
  const coreMesh = new THREE.Mesh(coreGeom, coreMat);
  innerGroup.add(coreMesh);
  group.add(innerGroup);

  return { group, innerGroup };
}

// 10. Chamfered Dodecahedron
function buildDodecahedronGem(
  gemMat: THREE.Material,
  edgeMat: THREE.Material
): { group: THREE.Group } {
  const group = new THREE.Group();
  const geom = new THREE.DodecahedronGeometry(1.2, 0);
  const mesh = new THREE.Mesh(geom, gemMat);
  const wire = new THREE.LineSegments(new THREE.EdgesGeometry(geom), edgeMat);
  mesh.add(wire);
  group.add(mesh);
  return { group };
}

// 11. Torus Knot: 3D Topological Soliton
function buildTorusKnotGem(
  mat: THREE.Material,
  edgeMat: THREE.Material
): { group: THREE.Group } {
  const group = new THREE.Group();
  const geom = new THREE.TorusKnotGeometry(1.05, 0.32, 128, 32, 2, 3);
  const mesh = new THREE.Mesh(geom, mat);
  const wire = new THREE.LineSegments(new THREE.EdgesGeometry(geom, 35), edgeMat);
  mesh.add(wire);
  group.add(mesh);
  return { group };
}

// 12. Trefoil Knot: Twisted 3D Loop
function buildTrefoilGem(
  mat: THREE.Material,
  edgeMat: THREE.Material
): { group: THREE.Group } {
  const group = new THREE.Group();
  const geom = new THREE.TorusKnotGeometry(1.15, 0.28, 128, 32, 3, 2);
  const mesh = new THREE.Mesh(geom, mat);
  const wire = new THREE.LineSegments(new THREE.EdgesGeometry(geom, 35), edgeMat);
  mesh.add(wire);
  group.add(mesh);
  return { group };
}

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
  objectCount = 26,
  speed = 0.7,
  parallax = 1,
  repulsion = 1,
  scrollDepth = 14,
  accentRed = true,
  className = ''
}: MistBackground3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  const propsRef = useRef({
    objectCount,
    speed,
    parallax,
    repulsion,
    scrollDepth,
    accentRed
  });

  useEffect(() => {
    propsRef.current = {
      objectCount,
      speed,
      parallax,
      repulsion,
      scrollDepth,
      accentRed
    };
  }, [objectCount, speed, parallax, repulsion, scrollDepth, accentRed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Detect WebGL capability
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    if (!gl) {
      setWebglSupported(false);
      return;
    }

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Renderer Setup (Pure high-end 3D rendering pipeline)
    const scene = new THREE.Scene();
    const fogColor = 0x060913;
    scene.fog = new THREE.FogExp2(fogColor, 0.012);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // 2. High-Fidelity 3D Materials (Glass, Sapphire, Platinum Chrome & Glowing Cores)
    const cyanGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0369a1,
      emissiveIntensity: 0.35,
      roughness: 0.14,
      metalness: 0.12,
      transmission: 0.82,
      thickness: 1.4,
      ior: 1.52,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.95
    });

    const sapphireMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1d4ed8,
      emissive: 0x1e40af,
      emissiveIntensity: 0.4,
      roughness: 0.12,
      metalness: 0.18,
      transmission: 0.78,
      thickness: 1.8,
      ior: 1.58,
      clearcoat: 0.9,
      transparent: true,
      opacity: 0.92
    });

    const platinumChromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      emissive: 0x1e293b,
      emissiveIntensity: 0.2,
      roughness: 0.15,
      metalness: 0.92
    });

    const redRubyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf43f5e,
      emissive: 0xbe123c,
      emissiveIntensity: 0.4,
      roughness: 0.16,
      metalness: 0.15,
      transmission: 0.8,
      thickness: 1.5,
      ior: 1.54,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.94
    });

    // Inner Glowing Core Material
    const luminousCoreMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.9
    });

    const luminousRedCoreMaterial = new THREE.MeshBasicMaterial({
      color: 0xfb7185,
      transparent: true,
      opacity: 0.9
    });

    // Subtle Luminous Edge Wireframe
    const cyanEdgeMaterial = new THREE.LineBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.45
    });

    const rubyEdgeMaterial = new THREE.LineBasicMaterial({
      color: 0xfb7185,
      transparent: true,
      opacity: 0.5
    });

    // 3. Cinematic 3D Lighting Environment
    const keyLight = new THREE.DirectionalLight(0x38bdf8, 3.2);
    keyLight.position.set(16, 20, 14);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x1d4ed8, 2.4);
    fillLight.position.set(-16, -14, -8);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x93c5fd, 2.5);
    rimLight.position.set(0, -10, -18);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0x071228, 1.8);
    scene.add(ambientLight);

    const accentPointLight = new THREE.PointLight(0x2563eb, 3.0, 36);
    accentPointLight.position.set(6, 2, -4);
    scene.add(accentPointLight);

    // Interactive 3D Cursor Spotlight: dynamically casts specular reflections
    const cursorLight = new THREE.PointLight(0x38bdf8, 4.0, 26);
    cursorLight.position.set(0, 0, 5);
    scene.add(cursorLight);

    // 4. Generate 3D Mathematical & Physical Solitary Objects
    const floatingObjects: FloatingObjectItem[] = [];
    const baseCount = propsRef.current.objectCount;
    let redObjectsCount = 0;

    const geometryGenerators = [
      () => {
        const geom = buildDeltaGeometry();
        const mesh = new THREE.Mesh(geom, cyanGlassMaterial);
        const wire = new THREE.LineSegments(new THREE.EdgesGeometry(geom, 25), cyanEdgeMaterial);
        mesh.add(wire);
        const grp = new THREE.Group();
        grp.add(mesh);
        return { group: grp };
      },
      () => {
        const geom = buildPiGeometry();
        const mesh = new THREE.Mesh(geom, sapphireMaterial);
        const wire = new THREE.LineSegments(new THREE.EdgesGeometry(geom, 25), cyanEdgeMaterial);
        mesh.add(wire);
        const grp = new THREE.Group();
        grp.add(mesh);
        return { group: grp };
      },
      () => {
        const geom = buildSigmaGeometry();
        const mesh = new THREE.Mesh(geom, platinumChromeMaterial);
        const wire = new THREE.LineSegments(new THREE.EdgesGeometry(geom, 25), cyanEdgeMaterial);
        mesh.add(wire);
        const grp = new THREE.Group();
        grp.add(mesh);
        return { group: grp };
      },
      () => {
        const geom = buildIntegralGeometry();
        const mesh = new THREE.Mesh(geom, cyanGlassMaterial);
        const wire = new THREE.LineSegments(new THREE.EdgesGeometry(geom, 25), cyanEdgeMaterial);
        mesh.add(wire);
        const grp = new THREE.Group();
        grp.add(mesh);
        return { group: grp };
      },
      () => {
        const geom = buildSqrtGeometry();
        const mesh = new THREE.Mesh(geom, sapphireMaterial);
        const wire = new THREE.LineSegments(new THREE.EdgesGeometry(geom, 25), cyanEdgeMaterial);
        mesh.add(wire);
        const grp = new THREE.Group();
        grp.add(mesh);
        return { group: grp };
      },
      () => {
        const geom = buildInfinityGeometry();
        const mesh = new THREE.Mesh(geom, cyanGlassMaterial);
        const wire = new THREE.LineSegments(new THREE.EdgesGeometry(geom, 25), cyanEdgeMaterial);
        mesh.add(wire);
        const grp = new THREE.Group();
        grp.add(mesh);
        return { group: grp };
      },
      () => buildTesseractGroup(cyanGlassMaterial, luminousCoreMaterial, cyanEdgeMaterial),
      () => buildQuantumOrbitalGroup(cyanGlassMaterial, luminousCoreMaterial, cyanEdgeMaterial),
      () => buildIcosahedronGem(cyanGlassMaterial, luminousCoreMaterial, cyanEdgeMaterial),
      () => buildDodecahedronGem(sapphireMaterial, cyanEdgeMaterial),
      () => buildTorusKnotGem(cyanGlassMaterial, cyanEdgeMaterial),
      () => buildTrefoilGem(platinumChromeMaterial, cyanEdgeMaterial)
    ];

    for (let i = 0; i < baseCount; i++) {
      const isRed = propsRef.current.accentRed && (redObjectsCount < 4) && (i % 7 === 0);
      if (isRed) redObjectsCount++;

      const genIndex = i % geometryGenerators.length;
      let objResult: { group: THREE.Group; innerGroup?: THREE.Group };

      if (isRed) {
        // Build red ruby accent solid
        if (genIndex === 6) {
          objResult = buildTesseractGroup(redRubyMaterial, luminousRedCoreMaterial, rubyEdgeMaterial);
        } else if (genIndex === 8) {
          objResult = buildIcosahedronGem(redRubyMaterial, luminousRedCoreMaterial, rubyEdgeMaterial);
        } else {
          const geom = buildDeltaGeometry();
          const mesh = new THREE.Mesh(geom, redRubyMaterial);
          const wire = new THREE.LineSegments(new THREE.EdgesGeometry(geom, 25), rubyEdgeMaterial);
          mesh.add(wire);
          const grp = new THREE.Group();
          grp.add(mesh);
          objResult = { group: grp };
        }
      } else {
        objResult = geometryGenerators[genIndex]();
      }

      const { group, innerGroup } = objResult;

      // Distribute in a 3D spherical volume around viewport
      const angle = (i / baseCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const radius = 6.0 + Math.random() * 8.5;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * (radius * 0.65) + (Math.random() - 0.5) * 4;
      const z = (Math.random() - 0.5) * 16 - 2;

      group.position.set(x, y, z);
      const scale = 0.55 + Math.random() * 0.45;
      group.scale.setScalar(scale);

      group.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      scene.add(group);

      floatingObjects.push({
        group,
        innerGroup,
        anchor: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(0, 0, 0),
        angularVelocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.018,
          (Math.random() - 0.5) * 0.012
        ),
        baseRotation: group.rotation.clone(),
        driftSpeed: 0.3 + Math.random() * 0.6,
        driftPhase: Math.random() * Math.PI * 2,
        isRed,
        expansion: 1,
        expansionVel: 0,
        hitCooldown: 0
      });
    }

    // 5. Volumetric 3D Cosmic Dust (Knowledge Motes)
    const motesCount = 280;
    const motePositions = new Float32Array(motesCount * 3);
    for (let i = 0; i < motesCount; i++) {
      motePositions[i * 3 + 0] = (Math.random() - 0.5) * 36;
      motePositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      motePositions[i * 3 + 2] = (Math.random() - 0.5) * 26 - 4;
    }
    const motesGeometry = new THREE.BufferGeometry();
    motesGeometry.setAttribute('position', new THREE.BufferAttribute(motePositions, 3));
    const motesMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.12,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    const motesPoints = new THREE.Points(motesGeometry, motesMaterial);
    scene.add(motesPoints);

    // 6. Interaction State (Mouse & Scroll)
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, worldPos: new THREE.Vector3(0, 0, 0) };
    let scrollY = window.scrollY || 0;
    let targetScrollY = scrollY;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = nx;
      mouse.targetY = ny;

      // Project mouse into 3D world space at z = 0
      const vec = new THREE.Vector3(nx, ny, 0.5);
      vec.unproject(camera);
      vec.sub(camera.position).normalize();
      const distance = -camera.position.z / vec.z;
      mouse.worldPos.copy(camera.position).add(vec.multiplyScalar(distance));
    };

    const onScroll = () => {
      targetScrollY = window.scrollY || 0;
    };

    const onResize = () => {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // 7. High-Performance Animation Loop
    let animationId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      animationId = requestAnimationFrame(animate);

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Smooth lerp mouse & scroll
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
      scrollY += (targetScrollY - scrollY) * 0.08;

      // Camera parallax & scroll depth travel
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const scrollRatio = scrollY / maxScroll;
      const scrollZ = scrollRatio * propsRef.current.scrollDepth;

      camera.position.x = mouse.x * 2.0 * propsRef.current.parallax;
      camera.position.y = mouse.y * 1.5 * propsRef.current.parallax - scrollRatio * 6;
      camera.position.z = 18 - scrollZ * 0.6;
      camera.lookAt(0, -scrollRatio * 6, 0);

      // Move 3D cursor light
      cursorLight.position.x = mouse.worldPos.x;
      cursorLight.position.y = mouse.worldPos.y;
      cursorLight.position.z = 4.5;

      // Slowly rotate cosmic knowledge dust motes
      motesPoints.rotation.y += 0.0008;
      motesPoints.rotation.x += 0.0004;

      // Animate each floating 3D object
      floatingObjects.forEach((obj, idx) => {
        // Idle floating drift
        const timeVal = currentTime * 0.001 * propsRef.current.speed * obj.driftSpeed + obj.driftPhase;
        const driftOffsetX = Math.sin(timeVal) * 0.45;
        const driftOffsetY = Math.cos(timeVal * 0.8) * 0.45;
        const driftOffsetZ = Math.sin(timeVal * 0.5) * 0.6;

        const targetPos = new THREE.Vector3(
          obj.anchor.x + driftOffsetX,
          obj.anchor.y + driftOffsetY,
          obj.anchor.z + driftOffsetZ
        );

        // Interactive 3D Cursor Proximity Physics
        const diff = new THREE.Vector3().subVectors(obj.group.position, mouse.worldPos);
        diff.z = 0; // Focus on 2D plane distance
        const dist = diff.length();
        const proxRadius = 4.5;

        if (dist < proxRadius && dist > 0.001) {
          const force = (1.0 - dist / proxRadius) * 2.5 * propsRef.current.repulsion;
          diff.normalize().multiplyScalar(force * delta * 6.0);
          obj.velocity.add(diff);

          // Spring expansion & spin impulse
          obj.expansionVel += force * 0.4;
          obj.angularVelocity.x += (Math.random() - 0.5) * 0.02 * force;
          obj.angularVelocity.y += (Math.random() - 0.5) * 0.02 * force;
        }

        // Spring return to anchor
        const returnForce = new THREE.Vector3().subVectors(targetPos, obj.group.position).multiplyScalar(0.08);
        obj.velocity.add(returnForce);
        obj.velocity.multiplyScalar(0.90); // Damping
        obj.group.position.add(obj.velocity);

        // Rotation integration
        obj.group.rotation.x += obj.angularVelocity.x;
        obj.group.rotation.y += obj.angularVelocity.y;
        obj.group.rotation.z += obj.angularVelocity.z;

        // Inner nested 4D/gimbal rotation
        if (obj.innerGroup) {
          obj.innerGroup.rotation.x += obj.angularVelocity.x * 2.2;
          obj.innerGroup.rotation.y += obj.angularVelocity.y * 2.6;
          obj.innerGroup.rotation.z += obj.angularVelocity.z * 1.8;
        }

        // Spring scale dynamics on hover
        const targetExpansion = 1.0;
        const scaleSpring = (targetExpansion - obj.expansion) * 0.12;
        obj.expansionVel += scaleSpring;
        obj.expansionVel *= 0.82;
        obj.expansion += obj.expansionVel;
      });

      // Direct, crisp WebGL render
      renderer.render(scene, camera);
    };

    animationId = requestAnimationFrame(animate);

    // 8. Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);

      floatingObjects.forEach((obj) => {
        scene.remove(obj.group);
      });

      scene.remove(motesPoints);
      motesGeometry.dispose();
      motesMaterial.dispose();

      cyanGlassMaterial.dispose();
      sapphireMaterial.dispose();
      platinumChromeMaterial.dispose();
      redRubyMaterial.dispose();
      luminousCoreMaterial.dispose();
      luminousRedCoreMaterial.dispose();
      cyanEdgeMaterial.dispose();
      rubyEdgeMaterial.dispose();

      renderer.dispose();
    };
  }, []);

  if (!webglSupported) {
    return (
      <div
        className={`fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#060813] to-[#0A132C] ${className}`}
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
      />
    </div>
  );
}
