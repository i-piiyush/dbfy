"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";

type StickerColor = "acid" | "sky" | "violet" | "coral" | "pink" | "lemon" | "paper";

export default function StickerIcon({
  icon: Icon,
  label,
  color = "acid",
  rotation = 0,
  size = 64,
  iconSize,
  border = 3,
  shadow = 5,
  className = "",
  float = false,
}: {
  icon: LucideIcon;
  label: string;
  color?: StickerColor;
  rotation?: number;
  size?: number;
  iconSize?: number;
  border?: number;
  shadow?: number;
  className?: string;
  float?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const style: CSSProperties = {
    width: size,
    height: size,
    borderWidth: border,
    backgroundColor: `var(--palette-${color})`,
    boxShadow: `${shadow}px ${shadow}px 0 var(--palette-ink)`,
    rotate: `${rotation}deg`,
  };

  return (
    <motion.span
      aria-label={label}
      role="img"
      className={`inline-grid shrink-0 place-items-center border-ink text-ink ${className}`}
      style={style}
      animate={float && !reduceMotion ? { y: [0, -7, 0], rotate: [rotation, rotation + 2, rotation] } : undefined}
      transition={float && !reduceMotion ? { duration: 3.4, repeat: Infinity, ease: "easeInOut" } : undefined}
      whileHover={reduceMotion ? undefined : { y: -3, rotate: rotation - 3 }}
      whileTap={reduceMotion ? undefined : { scale: 0.94 }}
    >
      <Icon aria-hidden="true" size={iconSize ?? Math.round(size * 0.48)} strokeWidth={3} />
    </motion.span>
  );
}
