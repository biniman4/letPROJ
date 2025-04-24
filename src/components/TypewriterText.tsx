// src/components/TypewriterText.tsx
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export const TypewriterText = () => {
  const lines = [
    "Letter Management System",
    "Space Science and Geospatial Institute (SSGI)"
  ];
  const [displayedText, setDisplayedText] = useState<string[]>(['', '']);

  useEffect(() => {
    let currentLine = 0;
    let currentChar = 0;
    
    const type = () => {
      if (currentLine < lines.length) {
        if (currentChar < lines[currentLine].length) {
          setDisplayedText(prev => {
            const newText = [...prev];
            newText[currentLine] = lines[currentLine].substring(0, currentChar + 1);
            return newText;
          });
          currentChar++;
          setTimeout(type, 100);
        } else {
          currentLine++;
          currentChar = 0;
          setTimeout(type, 500);
        }
      } else {
        // Reset after completion
        setTimeout(() => {
          setDisplayedText(['', '']);
          currentLine = 0;
          currentChar = 0;
          setTimeout(type, 1000);
        }, 2000);
      }
    };

    type();
  }, []);

  return (
    <motion.h1 
      className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span className="block">
        {displayedText[0]}
        <motion.span 
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block ml-1 w-1 h-8 bg-current align-middle"
        />
      </motion.span>
      <motion.span className="block text-blue-600">
        {displayedText[1]}
        {displayedText[0].length === lines[0].length && (
          <motion.span 
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block ml-1 w-1 h-8 bg-current align-middle"
          />
        )}
      </motion.span>
    </motion.h1>
  );
};