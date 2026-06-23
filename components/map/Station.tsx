"use client";

import { motion } from "framer-motion";
import { StationLayout } from "@/lib/types";
import { CATEGORY_CONFIG } from "@/lib/constants";

interface Props {
  station: StationLayout;
  delay: number;
  isSelected: boolean;
  onClick: () => void;
}

const R_NORMAL = 8;
const R_HUB = 13;
const R_CENTER = 17;       // emotional center — Spain
const GAP_NORMAL = R_NORMAL + 10;
const GAP_HUB = R_HUB + 12;
const GAP_CENTER = R_CENTER + 14;

function labelOffset(side: string, gap: number) {
  return {
    above: { tx: 0,    ty: -gap,      anchor: "middle", baseline: "auto"    },
    below: { tx: 0,    ty:  gap + 4,  anchor: "middle", baseline: "hanging" },
    left:  { tx: -gap, ty:  0,        anchor: "end",    baseline: "middle"  },
    right: { tx:  gap, ty:  0,        anchor: "start",  baseline: "middle"  },
  }[side] ?? { tx: 0, ty: -gap, anchor: "middle", baseline: "auto" };
}

function yearOffset(side: string, gap: number) {
  return {
    above: { tx: 0,    ty: -(gap + 13) },
    below: { tx: 0,    ty:   gap + 17  },
    left:  { tx: -gap, ty:  13          },
    right: { tx:  gap, ty:  13          },
  }[side] ?? { tx: 0, ty: -(gap + 13) };
}

export function Station({ station, delay, isSelected, onClick }: Props) {
  const { position: p, event, labelSide, isHub, isEmotionalCenter } = station;
  const color = CATEGORY_CONFIG[event.category].color;
  const R = isEmotionalCenter ? R_CENTER : isHub ? R_HUB : R_NORMAL;
  const GAP = isEmotionalCenter ? GAP_CENTER : isHub ? GAP_HUB : GAP_NORMAL;
  const lo = labelOffset(labelSide, GAP);
  const yo = yearOffset(labelSide, GAP);

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22, delay }}
      style={{ cursor: "pointer", transformOrigin: `${p.x}px ${p.y}px` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${event.title} · ${event.year}`}
      onKeyDown={e => e.key === "Enter" && onClick()}
    >
      {/* Hit area */}
      <circle cx={p.x} cy={p.y} r={R + 18} fill="transparent" />

      {/* Emotional center: subtle gold halo */}
      {isEmotionalCenter && (
        <motion.circle cx={p.x} cy={p.y} r={R + 10}
          fill="none" stroke="#D97706" strokeWidth={1} opacity={0.18}
          initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 0.18 }}
          transition={{ delay: delay + 0.6, duration: 0.8, ease: "easeOut" }}
        />
      )}

      {/* Hub outer ring (non-center hubs) */}
      {isHub && !isEmotionalCenter && (
        <circle cx={p.x} cy={p.y} r={R + 5}
          fill="none" stroke={color} strokeWidth={1.5} opacity={0.22}
        />
      )}

      {/* Emotional center: stronger colored ring */}
      {isEmotionalCenter && (
        <circle cx={p.x} cy={p.y} r={R + 5}
          fill="none" stroke={color} strokeWidth={2} opacity={0.35}
        />
      )}

      {/* Selection halo */}
      {isSelected && (
        <motion.circle cx={p.x} cy={p.y} r={R + 8}
          fill="none" stroke={color} strokeWidth={2} opacity={0.3}
          initial={{ scale: 0.5 }} animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      )}

      {/* White body */}
      <motion.circle
        cx={p.x} cy={p.y} r={R}
        fill="#FDFAF7"
        stroke={isEmotionalCenter ? "#D97706" : color}
        strokeWidth={isEmotionalCenter ? 4.5 : isHub ? 4 : isSelected ? 4 : 3}
        whileHover={{ scale: 1.3 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      />

      {/* Inner dot */}
      {isEmotionalCenter && !isSelected && (
        <circle cx={p.x} cy={p.y} r={R * 0.28} fill="#D97706" opacity={0.6} />
      )}
      {isHub && !isEmotionalCenter && !isSelected && (
        <circle cx={p.x} cy={p.y} r={R * 0.3} fill={color} opacity={0.5} />
      )}
      {isSelected && <circle cx={p.x} cy={p.y} r={4} fill={isEmotionalCenter ? "#D97706" : color} />}

      {/* Station name */}
      <motion.text
        x={p.x + lo.tx} y={p.y + lo.ty}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        textAnchor={lo.anchor as any} dominantBaseline={lo.baseline as any}
        fill={isEmotionalCenter ? "#1a1a1a" : "#1a1a1a"}
        fontSize={isEmotionalCenter ? 15 : isHub ? 13 : 11}
        fontFamily="'DM Serif Display', Georgia, serif"
        fontWeight={isEmotionalCenter || isHub || isSelected ? "700" : "400"}
        letterSpacing={isEmotionalCenter ? "0.1em" : "0.07em"}
        style={{ pointerEvents: "none", userSelect: "none" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.4 }}
      >
        {event.title.toUpperCase()}
      </motion.text>

      {/* Year */}
      <motion.text
        x={p.x + yo.tx} y={p.y + yo.ty}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        textAnchor={lo.anchor as any} dominantBaseline={lo.baseline as any}
        fill={isEmotionalCenter ? "#D97706" : isHub ? "#999" : "#BBBBBB"}
        fontSize={isEmotionalCenter ? 11 : isHub ? 10 : 8.5}
        fontFamily="'Inter', sans-serif"
        letterSpacing="0.08em"
        style={{ pointerEvents: "none", userSelect: "none" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.4 }}
      >
        {event.year}
      </motion.text>
    </motion.g>
  );
}
