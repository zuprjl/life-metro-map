"use client";

import { useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { LifeData, StationLayout } from "@/lib/types";
import { generateLayout } from "@/lib/layout/generateLayout";
import { MetroMapSVG } from "./MetroMapSVG";
import { StationPanel } from "@/components/ui/StationPanel";
import { exportMapAsPNG } from "@/lib/exportMap";
import { Download, Pencil, RotateCcw, MapPin } from "lucide-react";

interface Props {
  data: LifeData;
  onEdit: () => void;
  onReset: () => void;
}

export function MapView({ data, onEdit, onReset }: Props) {
  const [selectedStation, setSelectedStation] = useState<StationLayout | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const layout = useMemo(() => generateLayout(data.events), [data.events]);

  const totalStations = layout.lines.reduce((s, l) => s + l.stations.length, 0);
  const totalLines = layout.lines.length;

  const handleExport = async () => {
    if (!svgRef.current) return;
    await exportMapAsPNG(
      svgRef.current,
      `${data.name.toLowerCase().replace(/\s+/g, "-")}-metro-map.png`
    );
  };

  return (
    <div className="h-screen bg-[#FAF7F2] flex flex-col overflow-hidden">
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-6 py-3 border-b border-[#E0D8CC] flex-shrink-0 bg-[#FAF7F2]"
      >
        {/* Left: branding + stats */}
        <div className="flex items-center gap-4">
          <div>
            <span
              className="text-base tracking-[0.18em] text-[#1a1a1a] uppercase"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Life Metro Map
            </span>
          </div>
          <div className="h-4 w-px bg-[#DDD5C8]" />
          <div className="flex items-center gap-1.5 text-[11px] text-[#B8A898]" style={{ fontFamily: "'Inter', sans-serif" }}>
            <MapPin size={10} className="text-[#D97706]" />
            <span>{data.name}</span>
            <span className="mx-1 text-[#DDD5C8]">·</span>
            <span>{totalStations} stations</span>
            <span className="mx-1 text-[#DDD5C8]">·</span>
            <span>{totalLines} lines</span>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            title="Load sample data"
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-[#AAA] hover:text-[#666] transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <RotateCcw size={11} />
            Sample
          </button>

          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase border border-[#DDD5C8] hover:border-[#AAA] text-[#666] hover:text-[#1a1a1a] transition-all"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <Pencil size={11} />
            Edit Map
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase text-white transition-all hover:opacity-90"
            style={{ fontFamily: "'Inter', sans-serif", background: "#1a1a1a" }}
          >
            <Download size={11} />
            Export PNG
          </button>
        </div>
      </motion.div>

      {/* Map canvas */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{
          marginRight: selectedStation ? 320 : 0,
          transition: "margin-right 0.38s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <MetroMapSVG
          layout={layout}
          mapTitle={data.name}
          onStationClick={setSelectedStation}
          selectedId={selectedStation?.event.id}
          svgRef={svgRef}
        />

        {/* Usage hint */}
        {totalStations > 0 && !selectedStation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4, duration: 1.2 }}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none"
          >
            <p
              className="text-[9px] tracking-[0.25em] text-[#C8BCA8] uppercase"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Click a station · Scroll to zoom · Drag to pan
            </p>
          </motion.div>
        )}

        {/* Empty state */}
        {totalStations === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <p
              className="text-2xl text-[#C8BCA8]"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              No stations yet
            </p>
            <button
              onClick={onEdit}
              className="px-6 py-2 text-[11px] tracking-widest uppercase text-white"
              style={{ background: "#D97706", fontFamily: "'Inter', sans-serif" }}
            >
              Add life events →
            </button>
          </div>
        )}
      </div>

      {/* Station detail panel */}
      <StationPanel
        station={selectedStation}
        onClose={() => setSelectedStation(null)}
      />
    </div>
  );
}
