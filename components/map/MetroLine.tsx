"use client";

import { motion } from "framer-motion";
import { LineLayout } from "@/lib/types";
import { CATEGORY_CONFIG } from "@/lib/constants";
import { ROUTES } from "@/lib/layout/routes";

interface Props {
  line: LineLayout;
  delay: number;
}

function TerminusCap({ ax, ay, bx, by, color }: { ax:number; ay:number; bx:number; by:number; color:string }) {
  const dx = bx - ax, dy = by - ay;
  const len = Math.hypot(dx, dy);
  if (len < 1) return null;
  const px = (-dy / len) * 11;
  const py = ( dx / len) * 11;
  return <line x1={ax+px} y1={ay+py} x2={ax-px} y2={ay-py} stroke={color} strokeWidth={5} strokeLinecap="round" />;
}

function lineLabel(ax:number, ay:number, bx:number, by:number, label:string, color:string, side:"start"|"end") {
  // Place line-name label near terminus, angled away from the route
  const dx = bx - ax, dy = by - ay;
  const len = Math.hypot(dx, dy);
  const ux = dx / len, uy = dy / len;
  // offset perpendicular + away from route
  const px = -uy * 20, py = ux * 20;
  const outX = side === "end" ? ax + ux * 12 : ax - ux * 12;
  const outY = side === "end" ? ay + uy * 12 : ay - uy * 12;
  const anchor = px > 0 ? "start" : px < 0 ? "end" : "middle";
  return (
    <text
      x={outX + px} y={outY + py}
      fill={color}
      fontSize={8}
      fontFamily="'Inter', sans-serif"
      letterSpacing="0.18em"
      fontWeight="600"
      textAnchor={anchor}
      dominantBaseline="middle"
      opacity={0.7}
    >
      {label.toUpperCase()}
    </text>
  );
}

export function MetroLine({ line, delay }: Props) {
  const cfg = CATEGORY_CONFIG[line.category];
  const pts = ROUTES[line.category];
  const first = pts[0], second = pts[1];
  const last = pts[pts.length - 1], prev = pts[pts.length - 2];

  return (
    <g>
      {/* Glow / shadow */}
      <motion.path
        d={line.pathD} fill="none"
        stroke={cfg.color} strokeWidth={13}
        strokeLinecap="square" strokeLinejoin="miter"
        opacity={0.06}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.06 }}
        transition={{ pathLength: { duration: 1.8, delay, ease: "easeInOut" }, opacity: { duration: 0.2, delay } }}
      />
      {/* Main stroke */}
      <motion.path
        d={line.pathD} fill="none"
        stroke={cfg.color} strokeWidth={6}
        strokeLinecap="square" strokeLinejoin="miter"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ pathLength: { duration: 1.8, delay, ease: "easeInOut" }, opacity: { duration: 0.2, delay } }}
      />
      {/* Terminus caps + labels */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + 1.9, duration: 0.35 }}>
        <TerminusCap ax={first.x} ay={first.y} bx={second.x} by={second.y} color={cfg.color} />
        <TerminusCap ax={last.x} ay={last.y} bx={prev.x} by={prev.y} color={cfg.color} />
        {lineLabel(second.x, second.y, first.x, first.y, cfg.label, cfg.color, "end")}
        {lineLabel(prev.x, prev.y, last.x, last.y, cfg.label, cfg.color, "end")}
      </motion.g>
    </g>
  );
}
