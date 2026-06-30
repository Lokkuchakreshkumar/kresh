'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export function TextRotator({ words, className = "" }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [words]);

  return (
    <span className={`inline-grid ml-2 ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          exit={{ opacity: 0, filter: 'blur(10px)', y: -10 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="font-mono tracking-tighter col-start-1 row-start-1"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
