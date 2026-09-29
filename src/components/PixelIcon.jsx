import React from 'react';

/**
 * PixelIcon: 16x16 Authentic 8-bit/16-bit Pixel-Art SVG Icons
 * Rendered strictly with shapeRendering="crispEdges" and integer pixel coordinates
 * for razor-sharp rendering on any display without vector smoothing.
 */

export function PixelArrowRight({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" fill={color}>
      {/* 8-bit chunky arrow */}
      <rect x="2" y="7" width="8" height="2" />
      <rect x="8" y="5" width="2" height="2" />
      <rect x="8" y="9" width="2" height="2" />
      <rect x="10" y="6" width="2" height="4" />
      <rect x="12" y="7" width="2" height="2" />
    </svg>
  );
}

export function PixelArrowLeft({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" fill={color}>
      <rect x="6" y="7" width="8" height="2" />
      <rect x="6" y="5" width="2" height="2" />
      <rect x="6" y="9" width="2" height="2" />
      <rect x="4" y="6" width="2" height="4" />
      <rect x="2" y="7" width="2" height="2" />
    </svg>
  );
}

export function PixelChevronDown({ className = "w-3 h-3", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 12 12" className={className} shapeRendering="crispEdges" fill={color}>
      <rect x="1" y="4" width="2" height="2" />
      <rect x="3" y="6" width="2" height="2" />
      <rect x="5" y="8" width="2" height="2" />
      <rect x="7" y="6" width="2" height="2" />
      <rect x="9" y="4" width="2" height="2" />
    </svg>
  );
}

export function PixelCheck({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" fill={color}>
      <rect x="3" y="8" width="2" height="2" />
      <rect x="5" y="10" width="2" height="2" />
      <rect x="7" y="12" width="2" height="2" />
      <rect x="9" y="10" width="2" height="2" />
      <rect x="11" y="8" width="2" height="2" />
      <rect x="13" y="6" width="2" height="2" />
      {/* 2px thickness */}
      <rect x="3" y="9" width="2" height="2" />
      <rect x="5" y="11" width="2" height="2" />
      <rect x="7" y="13" width="2" height="2" />
      <rect x="9" y="11" width="2" height="2" />
      <rect x="11" y="9" width="2" height="2" />
      <rect x="13" y="7" width="2" height="2" />
    </svg>
  );
}

export function PixelRefresh({ className = "w-3.5 h-3.5", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" fill={color}>
      {/* Top arc */}
      <rect x="5" y="2" width="6" height="2" />
      <rect x="11" y="3" width="2" height="2" />
      <rect x="13" y="5" width="2" height="3" />
      {/* Bottom arc */}
      <rect x="5" y="12" width="6" height="2" />
      <rect x="3" y="11" width="2" height="2" />
      <rect x="1" y="8" width="2" height="3" />
      {/* Arrowheads */}
      <rect x="11" y="1" width="2" height="4" />
      <rect x="13" y="1" width="2" height="2" />
      <rect x="3" y="11" width="2" height="4" />
      <rect x="1" y="13" width="2" height="2" />
    </svg>
  );
}

export function PixelCpu({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" fill={color}>
      {/* Outer Chip Body */}
      <rect x="3" y="3" width="10" height="10" />
      {/* Inner Silicon Die Core */}
      <rect x="5" y="5" width="6" height="6" fill="#000000" />
      <rect x="7" y="7" width="2" height="2" fill={color} />
      {/* Pins - Top / Bottom */}
      <rect x="5" y="1" width="2" height="2" />
      <rect x="9" y="1" width="2" height="2" />
      <rect x="5" y="13" width="2" height="2" />
      <rect x="9" y="13" width="2" height="2" />
      {/* Pins - Left / Right */}
      <rect x="1" y="5" width="2" height="2" />
      <rect x="1" y="9" width="2" height="2" />
      <rect x="13" y="5" width="2" height="2" />
      <rect x="13" y="9" width="2" height="2" />
    </svg>
  );
}

export function PixelWarning({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges">
      {/* Stepped Yellow Triangle */}
      <polygon points="7,1 9,1 11,5 13,9 15,13 15,15 1,15 1,13 3,9 5,5" fill="#F59E0B" stroke="#000000" strokeWidth="1" />
      {/* Exclamation point */}
      <rect x="7" y="5" width="2" height="5" fill="#000000" />
      <rect x="7" y="12" width="2" height="2" fill="#000000" />
    </svg>
  );
}

export function PixelDisk({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" fill={color}>
      {/* Floppy body */}
      <rect x="2" y="2" width="12" height="12" />
      {/* Metal shutter */}
      <rect x="5" y="2" width="6" height="5" fill="#000000" />
      <rect x="7" y="3" width="2" height="3" fill={color} />
      {/* Label area */}
      <rect x="4" y="9" width="8" height="5" fill="#FFFFFF" />
      <rect x="5" y="10" width="6" height="1" fill="#000000" />
      <rect x="5" y="12" width="4" height="1" fill="#000000" />
    </svg>
  );
}

export function PixelSpark({ className = "w-3.5 h-3.5", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" fill={color}>
      <rect x="7" y="2" width="2" height="12" />
      <rect x="2" y="7" width="12" height="2" />
      <rect x="6" y="6" width="4" height="4" />
      <rect x="7" y="7" width="2" height="2" fill="#FFFFFF" />
    </svg>
  );
}

export function PixelTerminal({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" fill={color}>
      {/* Monitor frame */}
      <rect x="1" y="2" width="14" height="11" />
      <rect x="2" y="3" width="12" height="9" fill="#1E232A" />
      {/* > prompt */}
      <rect x="4" y="5" width="1" height="1" fill={color} />
      <rect x="5" y="6" width="1" height="1" fill={color} />
      <rect x="6" y="7" width="1" height="1" fill={color} />
      <rect x="5" y="8" width="1" height="1" fill={color} />
      <rect x="4" y="9" width="1" height="1" fill={color} />
      {/* _ cursor */}
      <rect x="8" y="9" width="3" height="1" fill="#F59E0B" />
      {/* Stand */}
      <rect x="6" y="13" width="4" height="1" />
      <rect x="5" y="14" width="6" height="1" />
    </svg>
  );
}

export function PixelTarget({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" fill={color}>
      {/* Outer reticle corners */}
      <rect x="2" y="2" width="4" height="1" />
      <rect x="2" y="2" width="1" height="4" />
      <rect x="10" y="2" width="4" height="1" />
      <rect x="13" y="2" width="1" height="4" />
      <rect x="2" y="13" width="4" height="1" />
      <rect x="2" y="10" width="1" height="4" />
      <rect x="10" y="13" width="4" height="1" />
      <rect x="13" y="10" width="1" height="4" />
      {/* Center cross */}
      <rect x="7" y="5" width="2" height="6" />
      <rect x="5" y="7" width="6" height="2" />
    </svg>
  );
}

export function PixelShield({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" fill={color}>
      <rect x="3" y="2" width="10" height="2" />
      <rect x="2" y="4" width="12" height="6" />
      <rect x="3" y="10" width="10" height="2" />
      <rect x="4" y="12" width="8" height="2" />
      <rect x="6" y="14" width="4" height="1" />
      <rect x="7" y="15" width="2" height="1" />
      {/* Inner emblem */}
      <rect x="7" y="5" width="2" height="5" fill="#000000" />
      <rect x="5" y="7" width="6" height="2" fill="#000000" />
    </svg>
  );
}

export function PixelHeart({ className = "w-4 h-4", color = "#EF4444" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" fill={color}>
      <rect x="3" y="3" width="4" height="2" />
      <rect x="9" y="3" width="4" height="2" />
      <rect x="2" y="5" width="12" height="4" />
      <rect x="3" y="9" width="10" height="2" />
      <rect x="4" y="11" width="8" height="2" />
      <rect x="6" y="13" width="4" height="2" />
      <rect x="7" y="15" width="2" height="1" />
      {/* Highlight */}
      <rect x="4" y="5" width="2" height="2" fill="#FFFFFF" opacity="0.8" />
    </svg>
  );
}

export function PixelMenu({ className = "w-5 h-5", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" fill={color}>
      <rect x="2" y="3" width="12" height="2" />
      <rect x="2" y="7" width="12" height="2" />
      <rect x="2" y="11" width="12" height="2" />
    </svg>
  );
}

export function PixelX({ className = "w-5 h-5", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" fill={color}>
      <rect x="3" y="3" width="2" height="2" />
      <rect x="5" y="5" width="2" height="2" />
      <rect x="7" y="7" width="2" height="2" />
      <rect x="9" y="5" width="2" height="2" />
      <rect x="11" y="3" width="2" height="2" />
      <rect x="5" y="9" width="2" height="2" />
      <rect x="3" y="11" width="2" height="2" />
      <rect x="9" y="9" width="2" height="2" />
      <rect x="11" y="11" width="2" height="2" />
    </svg>
  );
}

export function PixelGithub({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" fill={color}>
      {/* 8-bit octocat head */}
      <rect x="5" y="2" width="6" height="2" />
      <rect x="3" y="4" width="2" height="2" />
      <rect x="11" y="4" width="2" height="2" />
      <rect x="2" y="6" width="12" height="5" />
      <rect x="4" y="11" width="8" height="2" />
      <rect x="5" y="13" width="6" height="1" />
      {/* Eyes & Inner */}
      <rect x="4" y="7" width="2" height="2" fill="#000000" />
      <rect x="10" y="7" width="2" height="2" fill="#000000" />
      <rect x="7" y="9" width="2" height="1" fill="#000000" />
    </svg>
  );
}

export function PixelTwitter({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" fill={color}>
      {/* 8-bit bird */}
      <rect x="11" y="3" width="3" height="2" />
      <rect x="8" y="5" width="5" height="2" />
      <rect x="5" y="7" width="7" height="2" />
      <rect x="3" y="9" width="8" height="2" />
      <rect x="4" y="11" width="6" height="2" />
      <rect x="6" y="13" width="4" height="1" />
    </svg>
  );
}

export function PixelLinkedin({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" fill={color}>
      {/* Outer rounded pixel frame */}
      <rect x="2" y="2" width="12" height="12" />
      <rect x="4" y="4" width="2" height="2" fill="#000000" />
      <rect x="4" y="7" width="2" height="5" fill="#000000" />
      <rect x="8" y="7" width="2" height="5" fill="#000000" />
      <rect x="10" y="7" width="2" height="2" fill="#000000" />
      <rect x="11" y="9" width="1" height="3" fill="#000000" />
    </svg>
  );
}
