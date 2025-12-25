"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
    >
      {/* Main gradient beam */}
      <motion.div
        className="absolute w-[40rem] h-[40rem] rounded-full"
        animate={{
          x: mousePosition.x - 320,
          y: mousePosition.y - 320,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.1) 40%, transparent 70%)",
        }}
      />

      {/* SVG Beams */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59,130,246,0)" />
            <stop offset="50%" stopColor="rgba(59,130,246,0.5)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0)" />
          </linearGradient>
          <linearGradient id="beam-gradient-purple" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(139,92,246,0)" />
            <stop offset="50%" stopColor="rgba(139,92,246,0.3)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0)" />
          </linearGradient>
        </defs>

        {/* Animated beams */}
        {[...Array(5)].map((_, i) => (
          <motion.line
            key={i}
            x1="0"
            y1={`${20 + i * 15}%`}
            x2="100%"
            y2={`${30 + i * 12}%`}
            stroke={i % 2 === 0 ? "url(#beam-gradient)" : "url(#beam-gradient-purple)"}
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0, 0.5, 0.5, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Vertical beams */}
        {[...Array(3)].map((_, i) => (
          <motion.line
            key={`v-${i}`}
            x1={`${25 + i * 25}%`}
            y1="0"
            x2={`${30 + i * 20}%`}
            y2="100%"
            stroke="url(#beam-gradient-purple)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0, 0.3, 0.3, 0],
            }}
            transition={{
              duration: 5 + i * 0.5,
              repeat: Infinity,
              delay: i * 1.2 + 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      {/* Floating orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute w-32 h-32 rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              i % 2 === 0
                ? "rgba(59,130,246,0.2)"
                : "rgba(139,92,246,0.2)"
            } 0%, transparent 70%)`,
            left: `${20 + i * 30}%`,
            top: `${30 + i * 20}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
