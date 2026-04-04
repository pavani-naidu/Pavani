/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { ChevronLeft, Sparkles, RotateCcw } from 'lucide-react';

interface ButtonStep {
  style: string;
  label: string;
  pickupLine: string;
  className: string;
}

const STEPS: ButtonStep[] = [
  {
    style: "Glassmorphism",
    label: "Glassmorphism",
    pickupLine: "Are you WiFi? Because I’m feeling a strong connection.",
    className: "style-glass"
  },
  {
    style: "Claymorphism",
    label: "Claymorphism",
    pickupLine: "You just turned my normal day into something special.",
    className: "style-clay"
  },
  {
    style: "Minimalism",
    label: "Minimalism",
    pickupLine: "I think my phone smiles when your name pops up.",
    className: "style-minimal"
  },
  {
    style: "Liquid Glass",
    label: "Liquid Glass",
    pickupLine: "Talking to you feels like my favorite part of the day.",
    className: "style-liquid"
  },
  {
    style: "Skeuomorphism",
    label: "Skeuomorphism",
    pickupLine: "I don’t know why… but you make everything feel lighter.",
    className: "style-skeuo"
  }
];

const SparkleEffect = () => {
  const particles = Array.from({ length: 12 });
  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((_, i) => (
        <div
          key={i}
          className="sparkle-particle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
};

const LiquidParticles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/20 blur-[2px]"
          initial={{ 
            x: Math.random() * 300 - 150, 
            y: Math.random() * 100 - 50,
            scale: Math.random() * 0.5 + 0.5,
            opacity: 0
          }}
          animate={{ 
            x: [null, Math.random() * 300 - 150],
            y: [null, Math.random() * 100 - 50],
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
          style={{
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
          }}
        />
      ))}
    </div>
  );
};

const Tooltip = ({ text, children }: { text: string; children: React.ReactNode; key?: string | number }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex flex-col items-center" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-2 px-3 py-1.5 bg-white text-[#080a10] text-[10px] font-bold uppercase tracking-wider rounded-md whitespace-nowrap z-50 shadow-xl pointer-events-none"
          >
            {text}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  // Initialize state from localStorage
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem('button-showcase-step');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [isRevealed, setIsRevealed] = useState(() => {
    return localStorage.getItem('button-showcase-revealed') === 'true';
  });

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const shadowX = useTransform(mouseXSpring, [-0.5, 0.5], [20, -20]);
  const shadowY = useTransform(mouseYSpring, [-0.5, 0.5], [20, -20]);
  const shadow = useTransform(
    [shadowX, shadowY],
    ([x, y]) => `${x}px ${y}px 40px rgba(0,0,0,0.5)`
  );

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glare = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.15) 0%, transparent 60%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('button-showcase-step', currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem('button-showcase-revealed', isRevealed.toString());
  }, [isRevealed]);

  const handlePrev = useCallback(() => {
    setIsRevealed(false);
    setCurrentStep((prev) => (prev - 1 + STEPS.length) % STEPS.length);
  }, []);

  const handleNext = useCallback(() => {
    setIsRevealed(false);
    setCurrentStep((prev) => (prev + 1) % STEPS.length);
  }, []);

  const lastClickTime = useRef<number>(0);
  const handleMainButtonClick = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastClickTime.current < DOUBLE_TAP_DELAY) {
      handleNext();
    } else {
      setIsRevealed(true);
    }
    lastClickTime.current = now;
  };

  const handleReset = useCallback(() => {
    setIsRevealed(false);
    setCurrentStep(0);
  }, []);

  const current = STEPS[currentStep];
  const isHighContrast = true; // Midnight theme is high-contrast by default

  return (
    <div className={`h-screen w-screen flex flex-col items-center justify-center px-6 transition-colors duration-500`}>
      
      {/* Top Controls */}
      <div className="absolute top-8 right-8 flex flex-col items-end gap-3">
        <div className="flex gap-3">
          <Tooltip text="Reset Progress">
            <button
              onClick={handleReset}
              aria-label="Reset progression"
              className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              <RotateCcw className="w-5 h-5 text-white/60" />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="flex flex-col items-center gap-12 w-full max-w-md">
        
        {/* Main Button Area */}
        <div className="h-64 w-full flex items-center justify-center relative" style={{ perspective: '1000px' }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -20, filter: 'blur(8px)' }}
              transition={{ 
                duration: 0.8, 
                ease: [0.65, 0, 0.35, 1] // Smooth ease-in-out (Expo-like)
              }}
              className="w-full flex justify-center"
            >
              <motion.button
                style={{
                  rotateX,
                  rotateY,
                  boxShadow: shadow,
                  transformStyle: 'preserve-3d',
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.98, y: 0 }}
                onClick={handleMainButtonClick}
                aria-label={isRevealed ? `Pickup line: ${current.pickupLine}` : `Reveal pickup line for ${current.style} style. Double tap to skip.`}
                aria-live="polite"
                className={`relative w-full max-w-[320px] min-h-[120px] p-8 flex items-center justify-center text-center transition-all duration-300 ${current.className} rounded-2xl overflow-hidden group`}
              >
                <motion.div 
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                  style={{ background: glare }}
                />
                {current.style === "Liquid Glass" && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ transform: 'translateZ(20px)' }}>
                    <LiquidParticles />
                  </div>
                )}
                <AnimatePresence>
                  {isRevealed && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="bright-burst"
                        style={{ transform: 'translateZ(30px)' }}
                      />
                      <SparkleEffect />
                    </>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {!isRevealed ? (
                    <motion.span
                      key="tap"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`font-medium tracking-wide uppercase text-sm ${isHighContrast ? 'high-contrast-text' : 'opacity-60'} relative z-20`}
                      style={{ transform: 'translateZ(40px)' }}
                    >
                      Tap to reveal
                    </motion.span>
                  ) : (
                    <motion.span
                      key="line"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`text-lg font-medium leading-tight relative z-30 ${isHighContrast ? 'high-contrast-text' : ''}`}
                      style={{ transform: 'translateZ(50px)' }}
                    >
                      {current.pickupLine}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation and Label */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            <motion.button
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              disabled={currentStep === 0}
              aria-label="Go to previous button style"
              className={`flex items-center gap-2 transition-colors text-sm font-medium focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg px-4 py-2 ${
                currentStep === 0 ? 'opacity-20 cursor-not-allowed' : 'text-white/60 hover:text-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </motion.button>
          </div>

          <span 
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20"
            aria-hidden="true"
          >
            {current.label}
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-white/10 mt-1">
            Double tap to skip style
          </span>
        </div>

      </div>
    </div>
  );
}
