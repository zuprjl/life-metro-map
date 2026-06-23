"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { MapLayout, StationLayout } from "@/lib/types";
import { CANVAS, CATEGORY_CONFIG } from "@/lib/constants";
import { MetroLine } from "./MetroLine";
import { Station } from "./Station";
import { IntersectionMarker } from "./IntersectionMarker";

interface Props {
  layout: MapLayout;
  mapTitle: string;
  onStationClick: (st: StationLayout) => void;
  selectedId?: string;
  svgRef?: React.RefObject<SVGSVGElement | null>;
}

const W = CANVAS.width;    // 1400
const H = CANVAS.height;   // 820

export function MetroMapSVG({ layout, mapTitle, onStationClick, selectedId, svgRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tf, setTf] = useState({ x: 0, y: 0, s: 1 });
  const drag = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setTf(t => {
      const factor = 1 - e.deltaY * 0.0012;
      const ns = Math.min(4, Math.max(0.15, t.s * factor));
      return {
        s: ns,
        x: mx - (mx - t.x) * (ns / t.s),
        y: my - (my - t.y) * (ns / t.s),
      };
    });
  }, []);
  const onDown = useCallback((e: React.MouseEvent) => { drag.current = true; last.current = { x: e.clientX, y: e.clientY }; }, []);
  const onMove = useCallback((e: React.MouseEvent) => {
    if (!drag.current) return;
    setTf(t => ({ ...t, x: t.x + e.clientX - last.current.x, y: t.y + e.clientY - last.current.y }));
    last.current = { x: e.clientX, y: e.clientY };
  }, []);
  const onUp = useCallback(() => { drag.current = false; }, []);

  const nLines = layout.lines.length;

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden select-none"
      style={{ cursor: drag.current ? "grabbing" : "grab" }}
      onWheel={onWheel} onMouseDown={onDown} onMouseMove={onMove}
      onMouseUp={onUp} onMouseLeave={onUp}
    >
      <div style={{
        transform: `translate(${tf.x}px,${tf.y}px) scale(${tf.s})`,
        transformOrigin: "center center",
        width: "100%", height: "100%",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          style={{ width: "100%", height: "100%", display: "block" }}
          aria-label={`Life Metro Map — ${mapTitle}`}
        >
          <defs>
            {/* Paper grain */}
            <filter id="grain" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" result="n"/>
              <feColorMatrix type="saturate" values="0" in="n" result="g"/>
              <feComponentTransfer in="g" result="lg">
                <feFuncR type="linear" slope="0.05" intercept="0.95"/>
                <feFuncG type="linear" slope="0.04" intercept="0.93"/>
                <feFuncB type="linear" slope="0.03" intercept="0.91"/>
              </feComponentTransfer>
              <feBlend in="SourceGraphic" in2="lg" mode="multiply"/>
            </filter>
          </defs>

          {/* ── Background ── */}
          <rect width={W} height={H} fill="#F8F4EE"/>
          <rect width={W} height={H} fill="#F8F4EE" filter="url(#grain)" opacity={0.5}/>

          {/* ── Outer poster frame ── */}
          <rect x={14} y={14} width={W-28} height={H-28} fill="none" stroke="#C8BCA8" strokeWidth={2}/>
          <rect x={20} y={20} width={W-40} height={H-40} fill="none" stroke="#DDD5C8" strokeWidth={0.75}/>

          {/* ── Corner ticks ── */}
          {[[30,30],[W-30,30],[30,H-30],[W-30,H-30]].map(([cx,cy],i) => (
            <g key={i}>
              <line x1={cx-10} y1={cy} x2={cx+10} y2={cy} stroke="#B8A898" strokeWidth={1}/>
              <line x1={cx} y1={cy-10} x2={cx} y2={cy+10} stroke="#B8A898" strokeWidth={1}/>
            </g>
          ))}

          {/* ── Map title ── */}
          <motion.g initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>
            <text x={W/2} y={54} textAnchor="middle" fill="#1a1a1a"
              fontSize={34} fontFamily="'DM Serif Display',Georgia,serif" letterSpacing="0.1em">
              {mapTitle.toUpperCase()}
            </text>
            <text x={W/2} y={74} textAnchor="middle" fill="#B8A898"
              fontSize={8.5} fontFamily="'Inter',sans-serif" letterSpacing="0.36em">
              LIFE · TRANSIT · MAP
            </text>
            <line x1={W/2-130} x2={W/2-16} y1={82} y2={82} stroke="#D4C4A8" strokeWidth={0.6}/>
            <circle cx={W/2} cy={82} r={2.5} fill="#D97706" opacity={0.7}/>
            <line x1={W/2+16} x2={W/2+130} y1={82} y2={82} stroke="#D4C4A8" strokeWidth={0.6}/>
          </motion.g>

          {/* ── Metro lines (under stations) ── */}
          {layout.lines.map((line, i) => (
            <MetroLine key={line.category} line={line} delay={0.1 + i * 0.25}/>
          ))}

          {/* ── Interchange markers (above lines, below stations) ── */}
          {layout.intersections.map((ix, i) => (
            <IntersectionMarker
              key={`${ix.position.x}-${ix.position.y}`}
              intersection={ix}
              delay={nLines * 0.25 + 0.5 + i * 0.03}
            />
          ))}

          {/* ── Stations (topmost) ── */}
          {layout.lines.map((line, li) =>
            line.stations.map((st, si) => (
              <Station
                key={st.event.id}
                station={st}
                delay={nLines * 0.25 + 1.2 + li * 0.08 + si * 0.09}
                isSelected={selectedId === st.event.id}
                onClick={() => onStationClick(st)}
              />
            ))
          )}

          {/* ── Legend ── */}
          <motion.g
            initial={{ opacity:0 }} animate={{ opacity:1 }}
            transition={{ delay: nLines * 0.25 + 2.5, duration: 0.6 }}
          >
            {(() => {
              const cats = layout.lines.map(l => l.category);
              const itemW = 116;
              const boxW = cats.length * itemW + 20;
              const bx = 30, by = H - 84;
              return (
                <>
                  <rect x={bx} y={by} width={boxW} height={52} rx={3}
                    fill="#FDFAF7" opacity={0.9}/>
                  <rect x={bx} y={by} width={boxW} height={52} rx={3}
                    fill="none" stroke="#DDD5C8" strokeWidth={0.75}/>
                  {cats.map((cat, i) => {
                    const cfg = CATEGORY_CONFIG[cat];
                    const x = bx + 14 + i * itemW;
                    const y = by + 15;
                    return (
                      <g key={cat}>
                        <rect x={x} y={y} width={24} height={5} rx={2.5} fill={cfg.color}/>
                        <text x={x+30} y={y+3.5} fill="#555" fontSize={8.5}
                          fontFamily="'Inter',sans-serif" letterSpacing="0.06em"
                          dominantBaseline="middle">
                          {cfg.label.replace(" Line","").toUpperCase()}
                        </text>
                        <text x={x} y={y+20} fill="#AAA" fontSize={7}
                          fontFamily="'Inter',sans-serif" letterSpacing="0.1em">
                          LINE
                        </text>
                      </g>
                    );
                  })}
                </>
              );
            })()}
          </motion.g>

          {/* ── Interchange key ── */}
          <motion.g
            initial={{ opacity:0 }} animate={{ opacity:1 }}
            transition={{ delay: nLines * 0.25 + 2.7, duration: 0.6 }}
          >
            <circle cx={W-110} cy={H-58} r={8} fill="#FDFAF7" stroke="#C8BCA8" strokeWidth={1}/>
            <circle cx={W-110} cy={H-58} r={3.5} fill="#C8BCA8" opacity={0.6}/>
            <text x={W-96} y={H-54} fill="#AAA" fontSize={8}
              fontFamily="'Inter',sans-serif" letterSpacing="0.1em" dominantBaseline="middle">
              INTERCHANGE
            </text>
          </motion.g>

          {/* ── Footer ── */}
          <text x={W-32} y={H-28} fill="#C8BCA8" fontSize={7}
            fontFamily="'Inter',sans-serif" textAnchor="end" letterSpacing="0.16em">
            LIFE METRO MAP
          </text>
        </svg>
      </div>
    </div>
  );
}
