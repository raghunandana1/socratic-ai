import React, { useEffect, useState, useRef } from 'react';

/**
 * Authentic 16x16 Retro Pixel Art Cursor
 * Features:
 * - True integer pixel arrow pointer with 1px black border and white body
 * - 8-bit pointing hand on hoverable elements
 * - Stepped pixel sparks that trail behind the cursor
 */

const DEFAULT_ARROW_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' shape-rendering='crispEdges'%3E%3Cpath d='M0,0 L0,14 L3,11 L6,16 L8,15 L5,10 L10,10 Z' fill='%23000000'/%3E%3Cpath d='M1,2 L1,11 L3,9 L5,13 L6,12.5 L4,8.5 L8,8.5 Z' fill='%23FFFFFF'/%3E%3C/svg%3E`;

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [trail, setTrail] = useState([]);
  const lastTrailTime = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const now = performance.now();
      const newPos = { x: e.clientX, y: e.clientY };
      setPosition(newPos);

      // Spawn pixel spark every ~45ms
      if (now - lastTrailTime.current > 45) {
        lastTrailTime.current = now;
        setTrail((prev) => [
          ...prev.slice(-6),
          {
            id: now,
            x: newPos.x + (Math.random() > 0.5 ? 4 : -2),
            y: newPos.y + (Math.random() > 0.5 ? 6 : 2),
            color: Math.random() > 0.5 ? '#F59E0B' : '#EF4444',
            size: Math.random() > 0.5 ? 3 : 2,
          }
        ]);
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.getAttribute('role') === 'button' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.cursor-pointer')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    // Periodic cleanup of trail
    const trailInterval = setInterval(() => {
      const now = performance.now();
      setTrail((prev) => prev.filter((p) => now - p.id < 300));
    }, 60);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      clearInterval(trailInterval);
    };
  }, []);

  if (position.x === -100) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block select-none">
      {/* Trailing 8-bit Pixel Sparks */}
      {trail.map((p) => {
        const age = (performance.now() - p.id) / 300;
        const opacity = Math.max(0, 1 - age);
        return (
          <div
            key={p.id}
            className="absolute border border-black"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              opacity,
              transform: `translate(-50%, -50%) scale(${1 - age * 0.4})`,
            }}
          />
        );
      })}

      {/* Main 16x16 Pixel Cursor Container */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: isHovered ? 'translate(-2px, -2px)' : 'translate(0px, 0px)',
          imageRendering: 'pixelated',
        }}
      >
        {isHovered ? (
          /* 8-bit Arcade Pointing Hand / Target Pointer */
          <svg
            width="22"
            height="22"
            viewBox="0 0 16 16"
            shapeRendering="crispEdges"
            className="drop-shadow-[2px_2px_0px_#000000]"
          >
            {/* Black Outline */}
            <rect x="5" y="0" width="3" height="7" fill="#000000" />
            <rect x="8" y="3" width="3" height="5" fill="#000000" />
            <rect x="11" y="5" width="2" height="4" fill="#000000" />
            <rect x="2" y="5" width="3" height="4" fill="#000000" />
            <rect x="2" y="7" width="11" height="7" fill="#000000" />
            <rect x="4" y="14" width="8" height="2" fill="#000000" />
            
            {/* White Interior Glove */}
            <rect x="6" y="1" width="1" height="7" fill="#FFFFFF" />
            <rect x="9" y="4" width="1" height="5" fill="#FFFFFF" />
            <rect x="3" y="6" width="1" height="3" fill="#FFFFFF" />
            <rect x="3" y="8" width="9" height="5" fill="#FFFFFF" />
            
            {/* Red Arcade Cuff Accent */}
            <rect x="5" y="13" width="6" height="2" fill="#EF4444" />
          </svg>
        ) : (
          /* Classic 8-bit Pixel Arrow Cursor */
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            shapeRendering="crispEdges"
            className="drop-shadow-[2px_2px_0px_#000000]"
          >
            {/* Black Outline */}
            <polygon points="0,0 0,13 3,10 5,14 7,13 5,9 9,9" fill="#000000" />
            {/* White Inner Arrow */}
            <polygon points="1,1 1,10 3,8 5,12 6,11.5 4,8 8,8" fill="#FFFFFF" />
          </svg>
        )}
      </div>
    </div>
  );
}
