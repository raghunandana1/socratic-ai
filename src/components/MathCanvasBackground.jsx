import React, { useEffect, useRef } from 'react';

/**
 * Business-Class Executive Screen with Spider-Man Multiverse Dimension Tear Trail
 * - Inspired by Spider-Man: Into the Spider-Verse / Across the Spider-Verse
 * - Moving the cursor rips open the dark screen to reveal the glowing Multiverse underneath:
 *   * Chromatic Aberration RGB split: Neon Magenta (#FF0055) and Electric Cyan (#00F0FF)
 *   * Comic-book Ben-Day halftone dot pattern visible through the tear
 *   * Jagged dimensional glitch edges and web-fluid filament tethers
 *   * Floating Spider-Verse glitch blocks that jitter horizontally
 *   * Exactly 1-second lifespan (1000ms): the dimensional rift heals and seals shut over 1s
 * - Background remains an executive, distraction-free obsidian screen until you interact!
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

    // 1-Second Lifespan Multiverse Tear System (1000ms)
    const TRAIL_DURATION = 1000;
    const trailPoints = [];
    const glitchBlocks = [];
    let lastPointTime = 0;

    const handleMouseMove = (e) => {
      const now = performance.now();
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;

      // Sample trail points on movement (~10ms interval)
      if (now - lastPointTime > 10) {
        lastPointTime = now;
        trailPoints.push({
          x: e.clientX,
          y: e.clientY,
          time: now,
          // Subtle dimensional jitter for authentic comic book glitch tear
          jitterX: (Math.random() - 0.5) * 5,
          jitterY: (Math.random() - 0.5) * 5,
        });

        // Spawn Spider-Verse Glitch Blocks (Rectangular chromatic pixels that jitter)
        const blockCount = Math.random() > 0.3 ? 2 : 1;
        for (let k = 0; k < blockCount; k++) {
          const colors = ['#FF0055', '#00F0FF', '#FFE600', '#EF4444', '#FFFFFF'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          glitchBlocks.push({
            x: e.clientX + (Math.random() - 0.5) * 16,
            y: e.clientY + (Math.random() - 0.5) * 16,
            vx: (Math.random() - 0.5) * 2.2,
            vy: (Math.random() - 0.5) * 1.5 - 0.3,
            w: Math.random() * 8 + 3,
            h: Math.random() * 4 + 2,
            time: now,
            color,
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

    // Subtle, sparse neural data nodes for serene resting state
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

      // 1. Soft ambient luminescence following cursor (Multiverse violet & cyan glow)
      const spotGrad = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        340
      );
      spotGrad.addColorStop(0, 'rgba(255, 0, 85, 0.05)');
      spotGrad.addColorStop(0.35, 'rgba(0, 240, 255, 0.04)');
      spotGrad.addColorStop(0.7, 'rgba(30, 58, 138, 0.02)');
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

      // 3. Render and update resting data nodes
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

      // 4. Prune expired trail points and glitch blocks older than 1000ms
      while (trailPoints.length > 0 && now - trailPoints[0].time > TRAIL_DURATION) {
        trailPoints.shift();
      }
      for (let i = glitchBlocks.length - 1; i >= 0; i--) {
        if (now - glitchBlocks[i].time > TRAIL_DURATION) {
          glitchBlocks.splice(i, 1);
        }
      }

      // 5. RENDER SPIDER-MAN MULTIVERSE DIMENSIONAL TEAR (Revealing dimension behind screen)
      if (trailPoints.length > 1) {
        ctx.save();

        // Pass A: Chromatic Aberration - Neon Cyan Channel Offset (-3px)
        for (let i = 1; i < trailPoints.length; i++) {
          const p1 = trailPoints[i - 1];
          const p2 = trailPoints[i];
          const age = (now - p2.time) / TRAIL_DURATION;
          const life = Math.max(0, 1 - age);
          const widthVal = life * 22 + 2;

          ctx.beginPath();
          ctx.moveTo(p1.x - 3.5, p1.y + 1.5);
          ctx.lineTo(p2.x - 3.5, p2.y + 1.5);
          ctx.strokeStyle = `rgba(0, 240, 255, ${life * 0.8})`;
          ctx.lineWidth = widthVal + 4;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.shadowBlur = 14 * life;
          ctx.shadowColor = '#00F0FF';
          ctx.stroke();
        }

        // Pass B: Chromatic Aberration - Neon Magenta/Crimson Channel Offset (+3.5px)
        for (let i = 1; i < trailPoints.length; i++) {
          const p1 = trailPoints[i - 1];
          const p2 = trailPoints[i];
          const age = (now - p2.time) / TRAIL_DURATION;
          const life = Math.max(0, 1 - age);
          const widthVal = life * 22 + 2;

          ctx.beginPath();
          ctx.moveTo(p1.x + 3.5, p1.y - 1.5);
          ctx.lineTo(p2.x + 3.5, p2.y - 1.5);
          ctx.strokeStyle = `rgba(255, 0, 85, ${life * 0.85})`;
          ctx.lineWidth = widthVal + 4;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.shadowBlur = 14 * life;
          ctx.shadowColor = '#FF0055';
          ctx.stroke();
        }

        // Pass C: Main Multiverse Core Tear - Revealing the radiant dimension underneath
        for (let i = 1; i < trailPoints.length; i++) {
          const p1 = trailPoints[i - 1];
          const p2 = trailPoints[i];
          const age = (now - p2.time) / TRAIL_DURATION;
          const life = Math.max(0, 1 - age);
          const coreWidth = life * 14 + 1.5;

          // Electric Spidey Blue/Purple dimension beam
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${life * 0.95})`;
          ctx.lineWidth = coreWidth;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.shadowBlur = 8 * life;
          ctx.shadowColor = '#3B82F6';
          ctx.stroke();

          // Blinding white dimension rupture slit
          if (life > 0.2) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${(life - 0.2) * 1.3})`;
            ctx.lineWidth = Math.max(0.8, coreWidth * 0.35);
            ctx.stroke();
          }
        }

        // Pass D: Comic-Book Ben-Day Halftone Dot Matrix inside the tear
        for (let i = 0; i < trailPoints.length; i += 2) {
          const pt = trailPoints[i];
          const age = (now - pt.time) / TRAIL_DURATION;
          const life = Math.max(0, 1 - age);

          if (life > 0.25) {
            // 3-4 small halftone dots revealed through the rift
            const dotOffsets = [
              { dx: -7, dy: -5, col: '#00F0FF', r: 1.8 },
              { dx: 6, dy: 5, col: '#FF0055', r: 1.8 },
              { dx: 2, dy: -6, col: '#FFE600', r: 1.4 },
              { dx: -4, dy: 6, col: '#FFFFFF', r: 1.5 },
            ];

            for (let d = 0; d < dotOffsets.length; d++) {
              const dot = dotOffsets[d];
              ctx.beginPath();
              ctx.arc(
                pt.x + dot.dx * life,
                pt.y + dot.dy * life,
                dot.r * life,
                0,
                Math.PI * 2
              );
              ctx.fillStyle = dot.col;
              ctx.globalAlpha = life * 0.85;
              ctx.fill();
            }
          }
        }

        // Pass E: Web-Filament Tethers (Spidey silk holding the dimensional rift)
        for (let i = 2; i < trailPoints.length; i += 2) {
          const pPrev = trailPoints[i - 2];
          const pCurr = trailPoints[i];
          const age = (now - pCurr.time) / TRAIL_DURATION;
          const life = Math.max(0, 1 - age);

          if (life > 0.35) {
            ctx.beginPath();
            ctx.moveTo(pPrev.x + pPrev.jitterX, pPrev.y + pPrev.jitterY);
            ctx.lineTo(pCurr.x + pCurr.jitterX, pCurr.y + pCurr.jitterY);
            ctx.strokeStyle = `rgba(255, 255, 255, ${life * 0.4})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }

        ctx.restore();
      }

      // 6. RENDER SPIDER-VERSE GLITCH BLOCKS (Rectangular chromatic fragments jittering)
      if (glitchBlocks.length > 0) {
        ctx.save();
        for (let i = 0; i < glitchBlocks.length; i++) {
          const b = glitchBlocks[i];
          const age = (now - b.time) / TRAIL_DURATION;
          const life = Math.max(0, 1 - age);

          // Authentic Spider-Verse horizontal frame-stutter jitter
          b.x += b.vx + (Math.random() - 0.5) * 3;
          b.y += b.vy;
          b.vx *= 0.96;
          b.vy *= 0.96;

          const blockW = b.w * (0.3 + 0.7 * life);
          const blockH = b.h * (0.3 + 0.7 * life);

          // Draw chromatic glitch block
          ctx.fillStyle = b.color;
          ctx.globalAlpha = life * 0.9;
          ctx.shadowBlur = 8 * life;
          ctx.shadowColor = b.color;
          ctx.fillRect(b.x - blockW / 2, b.y - blockH / 2, blockW, blockH);

          // 1px black outline for authentic comic book ink finish
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
          ctx.lineWidth = 0.8;
          ctx.strokeRect(b.x - blockW / 2, b.y - blockH / 2, blockW, blockH);
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

      {/* Smooth Canvas Rendering Layer with Spider-Verse Multiverse Dimensional Tear */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
