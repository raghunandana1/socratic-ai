import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * MathCanvasBackground: Interactive 3D WebGL Mathematical Universe
 * Built with Three.js:
 * - Floating 3D Mathematical Core (Torus Knot + Geodesic Polytope Wireframes)
 * - Dynamic 3D Wave Surface (Calculus / Harmonic Manifold)
 * - Volumetric 3D Quantum Particle Cloud
 * - Fluid Parallax Camera tracking cursor movement with smooth damping
 */

export default function MathCanvasBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera & Renderer Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a1945, 0.0075);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 70);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent so deep blue background shines through
    container.appendChild(renderer.domElement);

    // 2. Interactive 3D Mathematical Structure (Torus Knot & Icosahedron Wireframe)
    const mathGroup = new THREE.Group();
    scene.add(mathGroup);

    // Torus Knot Geometry
    const torusKnotGeo = new THREE.TorusKnotGeometry(13, 3.2, 120, 20, 2, 3);
    const torusKnotMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.24
    });
    const torusKnot = new THREE.Mesh(torusKnotGeo, torusKnotMat);
    mathGroup.add(torusKnot);

    // Surrounding Geodesic Icosahedron Shield
    const icosahedronGeo = new THREE.IcosahedronGeometry(22, 1);
    const icosahedronMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.14
    });
    const icosahedron = new THREE.Mesh(icosahedronGeo, icosahedronMat);
    mathGroup.add(icosahedron);

    // Inner Core Octahedron
    const octahedronGeo = new THREE.OctahedronGeometry(6, 0);
    const octahedronMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const octahedron = new THREE.Mesh(octahedronGeo, octahedronMat);
    mathGroup.add(octahedron);

    // Position math group slightly to the right for heroic layout balance
    mathGroup.position.set(22, 6, 0);

    // 3. Dynamic 3D Harmonic Wave Surface (Calculus / Topology Grid)
    const waveGeo = new THREE.PlaneGeometry(160, 160, 48, 48);
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    waveMesh.rotation.x = -Math.PI / 2.2;
    waveMesh.position.set(0, -28, -20);
    scene.add(waveMesh);

    // Store original position coordinates for wave displacement
    const posAttribute = waveGeo.attributes.position;
    const originalPositions = posAttribute.array.slice();

    // 4. Volumetric 3D Particle Cloud (Quantum Math Coordinates)
    const particleCount = 650;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color(0x38bdf8);
    const whiteColor = new THREE.Color(0xffffff);
    const purpleColor = new THREE.Color(0xa78bfa);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 160;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 110;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 120;

      const choice = Math.random();
      const col = choice > 0.6 ? cyanColor : choice > 0.3 ? whiteColor : purpleColor;
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Particle texture canvas (soft glowing circle)
    const canvasTexture = document.createElement('canvas');
    canvasTexture.width = 16;
    canvasTexture.height = 16;
    const tCtx = canvasTexture.getContext('2d');
    const grad = tCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.6)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    tCtx.fillStyle = grad;
    tCtx.fillRect(0, 0, 16, 16);
    const pointTexture = new THREE.CanvasTexture(canvasTexture);

    const particleMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      map: pointTexture,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Mouse Parallax & Dynamic Tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 6. Responsive Resize Handler
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      // Adjust math group position on smaller screens
      if (w < 1024) {
        mathGroup.position.set(0, 10, -10);
      } else {
        mathGroup.position.set(22, 6, 0);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // 7. Render Loop with High-Fidelity Physics & Geometry Animation
    let clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth cursor parallax lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // Rotate 3D mathematical core
      torusKnot.rotation.x = elapsedTime * 0.35 + mouse.y * 0.5;
      torusKnot.rotation.y = elapsedTime * 0.45 + mouse.x * 0.5;
      icosahedron.rotation.x = -elapsedTime * 0.18 + mouse.y * 0.3;
      icosahedron.rotation.y = elapsedTime * 0.22 - mouse.x * 0.3;
      octahedron.rotation.x = elapsedTime * 0.6;
      octahedron.rotation.z = elapsedTime * 0.5;

      // Gentle floating bobbing effect
      mathGroup.position.y = 6 + Math.sin(elapsedTime * 0.8) * 2.5 + mouse.y * 5;
      mathGroup.position.x = (window.innerWidth < 1024 ? 0 : 22) + mouse.x * 6;

      // 3D Harmonic Wave Deformation (Calculus Manifold Surface)
      const currentPos = waveGeo.attributes.position;
      for (let i = 0; i < currentPos.count; i++) {
        const u = originalPositions[i * 3];
        const v = originalPositions[i * 3 + 1];
        // Calculate dynamic z displacement using multi-harmonic sine waves
        const waveZ =
          Math.sin(u * 0.08 + elapsedTime * 1.4) * 2.8 +
          Math.cos(v * 0.08 + elapsedTime * 1.1) * 2.8 +
          Math.sin((u + v) * 0.05 + elapsedTime * 0.7) * 1.5;

        currentPos.setZ(i, waveZ);
      }
      currentPos.needsUpdate = true;

      // Slow 3D particle drift & subtle rotation
      particles.rotation.y = elapsedTime * 0.03 + mouse.x * 0.1;
      particles.rotation.x = elapsedTime * 0.015 - mouse.y * 0.1;

      // Camera parallax tilt
      camera.position.x += (mouse.x * 8 - camera.position.x) * 0.03;
      camera.position.y += (5 + mouse.y * 5 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 8. Cleanup & WebGL Context Disposal
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      torusKnotGeo.dispose();
      torusKnotMat.dispose();
      icosahedronGeo.dispose();
      icosahedronMat.dispose();
      octahedronGeo.dispose();
      octahedronMat.dispose();
      waveGeo.dispose();
      waveMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      pointTexture.dispose();
      renderer.dispose();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      style={{
        width: '100vw',
        height: '100vh',
      }}
    />
  );
}
