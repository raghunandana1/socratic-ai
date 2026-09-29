import React, { useEffect, useRef } from 'react';

/**
 * MathCanvasBackground: Authentic Pixel-Art Retro Educational Computer Background
 * Renders at a 1/2.5 pixel scale with image-rendering: pixelated, generating
 * authentic stepped Bresenham lines, pixel coordinate grids, stepped sine waves,
 * geometric figures, and 8-bit math symbols.
 */

export default function MathCanvasBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Pixel scaling factor (each retro pixel = 3 physical screen pixels)
    const PIXEL_SCALE = 3;
    let width = 0;
    let height = 0;
    let virtualW = 0;
    let virtualH = 0;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width / PIXEL_SCALE);
      canvas.height = Math.floor(height / PIXEL_SCALE);
      virtualW = canvas.width;
      virtualH = canvas.height;
      ctx.imageSmoothingEnabled = false;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e) => {
      mouse.x = Math.floor(e.clientX / PIXEL_SCALE);
      mouse.y = Math.floor(e.clientY / PIXEL_SCALE);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Pixel math symbols definition (bitmaps or procedural 8-bit glyphs)
    const GLYPHS = ['∫', 'Σ', 'π', '∇', 'λ', '√', 'θ', 'E=mc²', 'F=ma', 'Δx·Δp', 'x²+y²=r²'];

    // Create drifting pixel nodes
    const particleCount = Math.min(Math.floor(virtualW / 24), 38);
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * virtualW,
        y: Math.random() * virtualH,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() > 0.6 ? 2 : 1, // in virtual pixels
        glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        opacity: Math.random() * 0.28 + 0.1,
        color: Math.random() > 0.4 ? '#38BDF8' : '#F59E0B',
      });
    }

    // Static educational computer background diagrams (coordinate frames, sine curves)
    let tick = 0;

    // Helper: Draw stepped 8-bit pixel line (Bresenham)
    function drawPixelLine(x0, y0, x1, y1, color, opacity = 1) {
      x0 = Math.round(x0);
      y0 = Math.round(y0);
      x1 = Math.round(x1);
      y1 = Math.round(y1);

      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;

      const dx = Math.abs(x1 - x0);
      const dy = Math.abs(y1 - y0);
      const sx = x0 < x1 ? 1 : -1;
      const sy = y0 < y1 ? 1 : -1;
      let err = dx - dy;

      while (true) {
        ctx.fillRect(x0, y0, 1, 1);
        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          x0 += sx;
        }
        if (e2 < dx) {
          err += dx;
          y0 += sy;
        }
      }
    }

    // Helper: Draw 8-bit stepped coordinate axis with tick marks
    function drawPixelCoordinateGrid(originX, originY, axisLength, time) {
      const col = '#38BDF8';
      const op = 0.12;

      // X-Axis with stepped arrow
      drawPixelLine(originX - 10, originY, originX + axisLength, originY, col, op);
      ctx.fillRect(originX + axisLength - 2, originY - 1, 1, 3);
      ctx.fillRect(originX + axisLength - 1, originY, 1, 1);

      // Y-Axis with stepped arrow
      drawPixelLine(originX, originY + 10, originX, originY - axisLength, col, op);
      ctx.fillRect(originX - 1, originY - axisLength + 2, 3, 1);
      ctx.fillRect(originX, originY - axisLength + 1, 1, 1);

      // Ticks along X & Y
      for (let t = 20; t < axisLength; t += 20) {
        ctx.fillRect(originX + t, originY - 2, 1, 5);
        ctx.fillRect(originX - 2, originY - t, 5, 1);
      }

      // Stepped Sine Wave on the coordinate system
      ctx.fillStyle = '#F59E0B';
      ctx.globalAlpha = 0.16;
      for (let x = 0; x < axisLength - 8; x += 1) {
        const y = Math.round(Math.sin((x + time * 0.4) * 0.08) * 16);
        ctx.fillRect(originX + x, originY - y, 1, 1);
      }
    }

    // Helper: Draw pixel triangle with theta
    function drawPixelTriangle(bx, by) {
      const col = '#FFFFFF';
      const op = 0.08;
      // Base
      drawPixelLine(bx, by, bx + 36, by, col, op);
      // Height
      drawPixelLine(bx + 36, by, bx + 36, by - 24, col, op);
      // Hypotenuse
      drawPixelLine(bx, by, bx + 36, by - 24, col, op);
      // Right angle square indicator
      drawPixelLine(bx + 31, by, bx + 31, by - 5, col, op);
      drawPixelLine(bx + 31, by - 5, bx + 36, by - 5, col, op);
    }

    // Helper: Draw pixel parabola
    function drawPixelParabola(ox, oy) {
      const col = '#EF4444';
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.12;
      for (let x = -25; x <= 25; x += 1) {
        const y = Math.round(0.04 * x * x);
        ctx.fillRect(ox + x, oy - (25 - y), 1, 1);
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, virtualW, virtualH);
      tick++;

      // 1. Draw subtle pixel coordinate grids in corners / background quadrants
      if (virtualW > 200) {
        drawPixelCoordinateGrid(Math.round(virtualW * 0.12), Math.round(virtualH * 0.35), 70, tick);
        drawPixelTriangle(Math.round(virtualW * 0.78), Math.round(virtualH * 0.25));
        drawPixelParabola(Math.round(virtualW * 0.72), Math.round(virtualH * 0.75));
      }

      // 2. Draw stepped orthogonal pixel connections between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 45) {
            const pAlpha = 0.08 * (1 - dist / 45);
            ctx.fillStyle = '#38BDF8';
            ctx.globalAlpha = pAlpha;
            // Stepped Manhattan orthogonal line
            const midX = Math.round(particles[i].x);
            const midY = Math.round(particles[j].y);
            drawPixelLine(particles[i].x, particles[i].y, midX, midY, '#38BDF8', pAlpha);
            drawPixelLine(midX, midY, particles[j].x, particles[j].y, '#38BDF8', pAlpha);
            // 1-pixel node at intersection
            ctx.fillRect(midX, midY, 1, 1);
          }
        }
      }

      // 3. Draw & update particles and 8-bit math glyphs
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = virtualW;
        if (p.x > virtualW) p.x = 0;
        if (p.y < 0) p.y = virtualH;
        if (p.y > virtualH) p.y = 0;

        // Mouse repelling in virtual coordinates
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 40 && mDist > 0) {
          const force = (1 - mDist / 40) * 0.8;
          p.x += (mdx / mDist) * force;
          p.y += (mdy / mDist) * force;
        }

        // Draw chunky square pixel node
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * 1.2;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);

        // Draw 8-bit pixel text glyph beside it
        ctx.font = 'bold 8px "Press Start 2P", monospace';
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillText(p.glyph, Math.round(p.x) + 4, Math.round(p.y) + 3);
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-75 pixelated"
      style={{
        width: '100vw',
        height: '100vh',
        imageRendering: 'pixelated',
      }}
    />
  );
}
