"use client";
import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";

type GlobeConfig = Parameters<typeof createGlobe>[1];

const GLOBE_CONFIG: GlobeConfig = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 1,
  diffuse: 1.2,
  mapSamples: 16000,
  mapBrightness: 6,
  baseColor: [0.15, 0.15, 0.15],      // Dark gray base
  markerColor: [1, 1, 1],              // White markers
  glowColor: [0.1, 0.1, 0.1],          // Subtle glow
  markers: [
    { location: [40.7128, -74.006], size: 0.06 },   // New York
    { location: [51.5074, -0.1278], size: 0.05 },   // London
    { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo
    { location: [48.8566, 2.3522], size: 0.04 },   // Paris
    { location: [37.7749, -122.4194], size: 0.04 }, // San Francisco
    { location: [1.3521, 103.8198], size: 0.05 },  // Singapore
    { location: [-33.8688, 151.2093], size: 0.04 }, // Sydney
    { location: [22.3193, 114.1694], size: 0.05 }, // Hong Kong
  ],
};

export function Globe({
  className = "",
  config = GLOBE_CONFIG,
}: {
  className?: string;
  config?: GlobeConfig;
}) {
  let phi = 0;
  let width = 0;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [r, setR] = useState(0);

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      setR(delta / 200);
    }
  };

  const onRender = (state: Record<string, number>) => {
    if (!pointerInteracting.current) phi += 0.003;
    state.phi = phi + r;
    state.width = width * 2;
    state.height = width * 2;
  };

  const onResize = () => {
    if (canvasRef.current) {
      width = canvasRef.current.offsetWidth;
    }
  };

  useEffect(() => {
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: width * 2,
      height: width * 2,
      onRender,
    });

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    }, 0);

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className={`relative aspect-square w-full max-w-[600px] ${className}`}>
      <canvas
        className="h-full w-full opacity-0 transition-opacity duration-1000 [contain:layout_paint_size]"
        ref={canvasRef}
        onPointerDown={(e) =>
          updatePointerInteraction(e.clientX - pointerInteractionMovement.current)
        }
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) => e.touches[0] && updateMovement(e.touches[0].clientX)}
      />
    </div>
  );
}
