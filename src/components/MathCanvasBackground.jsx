import React, { useEffect, useRef } from 'react';

/**
 * Business-Class Executive Ambient Background
 * - Clean, sleek, distraction-free luxury tech aesthetic (Linear / Stripe / Vercel style)
 * - Precision technical blueprint micro-grid with radial vignette
 * - Soft, diffused cursor-following ambient luminescence (smooth lerp spotlight)
 * - Subtle, calm floating neural data nodes with delicate low-opacity connections
 * - Absolutely zero tacky 3D wireframe shapes or chaotic visual noise
 */

export default function MathCanvasBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates with smooth damping lerp
    const mouse = {
      x: width / 2,
      y: height * 0.3,
      targetX: width / 2,
      targetY: height * 0.3,
      radius: 180,
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Subtle, sparse neural data nodes (clean & refined, not chaotic)
    const nodeCount = Math.min(Math.floor((width * height) / 28000), 55);
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 1,
        baseAlpha: Math.random() * 0.18 + 0.08,
      });
    }

    const render = () => {
      // Smooth cursor lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // 1. Soft, diffused ambient spotlight following the cursor (Luxury executive aura)
      const spotGrad = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        340
      );
      spotGrad.addColorStop(0, 'rgba(59, 130, 246, 0.09)');
      spotGrad.addColorStop(0.5, 'rgba(30, 58, 138, 0.04)');
      spotGrad.addColorStop(1, 'rgba(7, 10, 18, 0)');

      ctx.fillStyle = spotGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Delicate, low-opacity connections between nearby nodes (Intelligent network)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.08;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(147, 197, 253, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // 3. Render and update subtle data nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Gentle drift
        n.x += n.vx;
        n.y += n.vy;

        // Boundary wrap
        if (n.x < -10) n.x = width + 10;
        if (n.x > width + 10) n.x = -10;
        if (n.y < -10) n.y = height + 10;
        if (n.y > height + 10) n.y = -10;

        // Subtle interactive mouse repulsion
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 0) {
          const force = (1 - dist / mouse.radius) * 0.6;
          n.x += (dx / dist) * force;
          n.y += (dy / dist) * force;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 242, 254, ${n.baseAlpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* Precision Technical Micro-Grid with Radial Vignette Mask */}
      <div
        className="absolute inset-0 opacity-[0.14] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 25%, #000 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 25%, #000 20%, transparent 80%)',
        }}
      />

      {/* Top Subtle Ambient Indigo Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(59, 130, 246, 0.16) 0%, rgba(30, 58, 138, 0.06) 50%, transparent 80%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Smooth Canvas Rendering Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
