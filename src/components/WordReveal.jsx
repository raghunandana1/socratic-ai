import React from 'react';

/**
 * WordReveal
 * 
 * Splits headline string into individual words that independently translate upward while fading in.
 * Uses 38ms stagger between words:
 * Initial: opacity: 0; transform: translateY(.42em)
 * Final: opacity: 1; transform: translateY(0)
 */
export default function WordReveal({ text, className = '', startIndex = 0 }) {
  if (!text || typeof text !== 'string') return text;

  const words = text.split(' ');

  return (
    <span className={`inline ${className}`}>
      {words.map((word, idx) => {
        const wordIndex = startIndex + idx;
        return (
          <span key={idx} className="word-wrap">
            <span
              className="word-reveal"
              style={{
                '--w-idx': wordIndex,
                transitionDelay: `${wordIndex * 38}ms`,
              }}
            >
              {word}
            </span>
            {idx < words.length - 1 && '\u00A0'}
          </span>
        );
      })}
    </span>
  );
}
