"use client";
import { cn } from "../../lib/utils";

export const Meteors = ({
  number = 20,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const meteors = new Array(number).fill(true);

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {meteors.map((_, idx) => {
        const meteorStyle = {
          top: 0,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 1 + 0.2}s`,
          animationDuration: `${Math.random() * 8 + 2}s`,
        };

        return (
          <span
            key={idx}
            className="meteor animate-meteor absolute h-0.5 w-0.5 rotate-[215deg] rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10]"
            style={meteorStyle}
          >
            <span
              className="absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2"
              style={{
                background: "linear-gradient(to right, #3b82f6, transparent)",
              }}
            />
          </span>
        );
      })}

      <style>{`
        @keyframes meteor {
          0% {
            transform: rotate(215deg) translateX(0);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: rotate(215deg) translateX(-800px);
            opacity: 0;
          }
        }

        .animate-meteor {
          animation: meteor linear infinite;
        }
      `}</style>
    </div>
  );
};
