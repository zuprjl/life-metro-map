"use client";

import { motion } from "framer-motion";
import { IntersectionLayout } from "@/lib/types";
import { CATEGORY_CONFIG } from "@/lib/constants";

interface Props {
  intersection: IntersectionLayout;
  delay: number;
}

export function IntersectionMarker({ intersection, delay }: Props) {
  const { position: p, categories } = intersection;
  const n = Math.min(categories.length, 4);
  const isMinor = n < 3;   // 2-line crossings are rendered subtly
  const isMulti = n >= 3;
  const outerR = isMulti ? 16 : 9;
  const innerR = outerR - (isMinor ? 3 : 4.5);

  // Build pie slices
  const slices = categories.slice(0, n).map((cat, i) => {
    const startAngle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const endAngle   = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
    const x1 = p.x + innerR * Math.cos(startAngle);
    const y1 = p.y + innerR * Math.sin(startAngle);
    const x2 = p.x + innerR * Math.cos(endAngle);
    const y2 = p.y + innerR * Math.sin(endAngle);
    const large = (endAngle - startAngle) > Math.PI ? 1 : 0;
    const d = n === 1
      ? `M ${p.x} ${p.y - innerR} A ${innerR} ${innerR} 0 1 1 ${p.x - 0.01} ${p.y - innerR} Z`
      : `M ${p.x} ${p.y} L ${x1} ${y1} A ${innerR} ${innerR} 0 ${large} 1 ${x2} ${y2} Z`;
    return <path key={cat} d={d} fill={CATEGORY_CONFIG[cat].color} />;
  });

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 20, delay }}
      style={{ transformOrigin: `${p.x}px ${p.y}px`, pointerEvents: "none" }}
    >
      {/* White knockout */}
      <circle cx={p.x} cy={p.y} r={outerR + (isMinor ? 2 : 3)} fill="#FDFAF7" />
      {/* Outer ring */}
      <circle cx={p.x} cy={p.y} r={outerR + (isMinor ? 2 : 3)} fill="none"
        stroke={isMulti ? "#D97706" : "#C8BCA8"}
        strokeWidth={isMulti ? 2 : 1}
        opacity={isMinor ? 0.35 : isMulti ? 0.9 : 0.6}
      />
      {/* Pie fill */}
      <g opacity={isMinor ? 0.4 : 1}>{slices}</g>
      {/* White centre dot */}
      <circle cx={p.x} cy={p.y} r={innerR * 0.32} fill="#FDFAF7" />
    </motion.g>
  );
}
