import React, { useEffect, useRef } from 'react';

/**
 * Business-Class Executive Ambient Background with 1s Luminous Cursor Trail
 * - Theme-matched electric cyan & pure white plasma trail that smoothly vanishes after 1 second (1000ms)
 * - Precision technical blueprint micro-grid with radial vignette
 * - Soft, diffused cursor-following ambient luminescence
 * - Subtle, calm floating neural data nodes with delicate connections
 * - High performance 60fps HTML5 Canvas with Bezier curve smoothing
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

    // 1-Second Lifespan Trail System (1000ms)
    const TRAIL_DURATION = 1000;
    const trailPoints = [];
    const trailSparks = [];
    let lastPointTime = 0;

    const handleMouseMove = (e) => {
      const now = performance.now();
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;

      // Sample trail points on movement (throttle to ~12ms for smooth curve fidelity)
      if (now - lastPointTime > 12) {
        lastPointTime = now;
        trailPoints.push({
          x: e.clientX,
          y: e.clientY,
          time: now,
        });

        // Spawn subtle floating quantum micro-spark matching frontend theme
        if (Math.random() > 0.35) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 0.9 + 0.3;
          trailSparks.push({
            x: e.clientX + (Math.random() - 0.5) * 6,
            y: e.clientY + (Math.random() - 0.5) * 6,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.2, // slight upward float
            time: now,
            size: Math.random() > 0.6 ? 2.2 : 1.4,
            isWhite: Math.random() > 0.5,
          });
        }
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Subtle, sparse neural data nodes
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
      const now = performance.now();

      // Smooth cursor lerp for ambient glow
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // 1. Soft, diffused ambient spotlight following the cursor
      const spotGrad = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        340
      );
      spotGrad.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
      spotGrad.addColorStop(0.5, 'rgba(30, 58, 138, 0.03)');
      spotGrad.addColorStop(1, 'rgba(7, 10, 18, 0)');

      ctx.fillStyle = spotGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Delicate, low-opacity connections between nearby nodes
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
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < -10) n.x = width + 10;
        if (n.x > width + 10) n.x = -10;
        if (n.y < -10) n.y = height + 10;
        if (n.y > height + 10) n.y = -10;

        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 0) {
          const force = (1 - dist / mouse.radius) * 0.6;
          n.x += (dx / dist) * force;
          n.y += (dy / dist) * force;
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 242, 254, ${n.baseAlpha})`;
        ctx.fill();
      }

      // 4. Prune expired trail elements older than 1000ms
      while (trailPoints.length > 0 && now - trailPoints[0].time > TRAIL_DURATION) {
        trailPoints.shift();
      }
      for (let i = trailSparks.length - 1; i >= 0; i--) {
        if (now - trailSparks[i].time > TRAIL_DURATION) {
          trailSparks.splice(i, 1);
        }
      }

      // 5. Render Fluid Theme-Matched Cursor Ribbon Trail (Vanishes smoothly over 1s)
      if (trailPoints.length > 1) {
        ctx.save();
        for (let i = 1; i < trailPoints.length; i++) {
          const p1 = trailPoints[i - 1];
          const p2 = trailPoints[i];

          const age = (now - p2.time) / TRAIL_DURATION;
          const life = Math.max(0, 1 - age); // 1.0 (new) -> 0.0 (vanished at 1s)

          const lineWidth = life * 5.5 + 0.6;
          const alpha = life * 0.85;

          // Outer Electric Cyan Glow Stroke
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = lineWidth;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.shadowBlur = 10 * life;
          ctx.shadowColor = 'rgba(56, 189, 248, 0.7)';
          ctx.stroke();

          // Inner Bright White Core Beam (freshest head of the trail)
          if (life > 0.45) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${(life - 0.45) * 1.6})`;
            ctx.lineWidth = Math.max(0.8, lineWidth * 0.35);
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // 6. Render Floating Luminous Micro-Sparks (Disperse & dissolve over 1s)
      if (trailSparks.length > 0) {
        ctx.save();
        for (let i = 0; i < trailSparks.length; i++) {
          const s = trailSparks[i];
          const age = (now - s.time) / TRAIL_DURATION;
          const life = Math.max(0, 1 - age);

          // Physical gentle dispersion
          s.x += s.vx;
          s.y += s.vy;
          s.vx *= 0.98;
          s.vy *= 0.98;

          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * (0.4 + 0.6 * life), 0, Math.PI * 2);
          ctx.fillStyle = s.isWhite
            ? `rgba(255, 255, 255, ${life * 0.95})`
            : `rgba(56, 189, 248, ${life * 0.9})`;
          ctx.shadowBlur = 6 * life;
          ctx.shadowColor = s.isWhite ? '#FFFFFF' : '#38BDF8';
          ctx.fill();
        }
        ctx.restore();
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

      {/* Smooth Canvas Rendering Layer with 1s Luminous Trail */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
