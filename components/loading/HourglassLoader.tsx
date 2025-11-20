"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { cn } from "@/lib/utils";

interface HourglassLoaderProps {
  message?: string;
  subtext?: string;
  className?: string;
  variant?: "light" | "dark";
  animationSrc?: string;
}

export function HourglassLoader({
  message = "Događaji se učitavaju",
  subtext = "Molimo pričekajte nekoliko trenutaka…",
  className,
  variant = "dark",
  animationSrc,
}: HourglassLoaderProps) {
  const [fallback, setFallback] = useState(false);
  const lottieSrc =
    animationSrc ??
    "https://lottie.host/77393eda-6656-4b89-ae46-c755c7f6bc47/rOcJds4vQC.lottie";

  const preset =
    variant === "light"
      ? {
          container:
            "rounded-3xl border border-stone-200/70 bg-white/80 text-stone-800 shadow-2xl backdrop-blur-sm",
          message: "text-stone-900",
          subtext: "text-stone-600",
        }
      : {
          container:
            "rounded-3xl border border-white/30 bg-white/10 text-stone-100 shadow-2xl backdrop-blur-xl",
          message: "text-white",
          subtext: "text-white/80",
        };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-8 py-10 text-center",
        preset.container,
        "sm:px-12 sm:py-12",
        className,
      )}
    >
      <div className="mb-6 flex h-72 w-72 max-w-full items-center justify-center sm:h-80 sm:w-80">
        {!fallback ? (
          <DotLottieReact
            src={lottieSrc}
            loop
            autoplay
            className="h-full w-full"
            onError={() => setFallback(true)}
          />
        ) : (
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <div className="hourglass-shell">
              <div className="hourglass">
                <div className="hourglass__sand hourglass__sand--top" />
                <div className="hourglass__sand hourglass__sand--bottom" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <p className={cn("text-lg font-semibold sm:text-xl", preset.message)}>{message}</p>
      <p className={cn("mt-2 max-w-md", preset.subtext)}>{subtext}</p>
    </div>
  );
}



