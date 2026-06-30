'use client';

import React, { useState, useEffect, useRef } from 'react';

const CHARS = '!<>-_\\\\/[]{}—=+*^?#';

export function TextRotator({ words, className = "" }) {
  const [displayText, setDisplayText] = useState(words[0]);
  const currentWordIndex = useRef(0);
  
  useEffect(() => {
    let frameId;
    let timeoutId;

    const animateScramble = (oldWord, newWord) => {
      const maxLength = Math.max(oldWord.length, newWord.length);
      const queue = [];
      
      for (let i = 0; i < maxLength; i++) {
        const from = oldWord[i] || '';
        const to = newWord[i] || '';
        const start = Math.floor(Math.random() * 30); 
        const end = start + Math.floor(Math.random() * 30) + 15;
        queue.push({ from, to, start, end, char: '' });
      }

      let frame = 0;
      
      const update = () => {
        let output = '';
        let complete = 0;

        for (let i = 0; i < queue.length; i++) {
          let { from, to, start, end, char } = queue[i];

          if (frame >= end) {
            complete++;
            output += to;
          } else if (frame >= start) {
            if (!char || Math.random() < 0.28) {
              char = CHARS[Math.floor(Math.random() * CHARS.length)];
              queue[i].char = char;
            }
            output += char;
          } else {
            output += from;
          }
        }

        setDisplayText(output);

        if (complete === queue.length) {
          timeoutId = setTimeout(nextWord, 3000);
        } else {
          frameId = requestAnimationFrame(update);
          frame++;
        }
      };

      update();
    };

    const nextWord = () => {
      const oldWord = words[currentWordIndex.current];
      currentWordIndex.current = (currentWordIndex.current + 1) % words.length;
      const newWord = words[currentWordIndex.current];
      animateScramble(oldWord, newWord);
    };

    timeoutId = setTimeout(nextWord, 3000);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timeoutId);
    };
  }, [words]);

  return (
    <span className={`inline-flex ml-2 transition-all duration-300 ease-in-out ${className}`}>
      <span className="font-mono tracking-tighter" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {displayText}
      </span>
    </span>
  );
}
