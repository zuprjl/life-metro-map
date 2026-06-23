"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StationLayout } from "@/lib/types";
import { CATEGORY_CONFIG } from "@/lib/constants";
import { X, MapPin } from "lucide-react";

interface Props {
  station: StationLayout | null;
  onClose: () => void;
}

export function StationPanel({ station, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && station) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [station, onClose]);

  return (
    <AnimatePresence>
      {station && (
        <motion.div
          key={station.event.id}
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 34 }}
          className="fixed top-0 right-0 h-full w-80 z-50 flex flex-col overflow-hidden"
          style={{ background: "#FAF7F2", borderLeft: "1px solid #DDD5C8" }}
          role="dialog"
          aria-label={`Station details: ${station.event.title}`}
        >
          {/* Colored top bar */}
          <motion.div
            className="h-1 w-full flex-shrink-0"
            style={{ background: CATEGORY_CONFIG[station.event.category].color }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          />

          {/* Close button */}
          <div className="flex justify-end px-5 pt-4 flex-shrink-0">
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#AAA] hover:text-[#1a1a1a] hover:bg-[#EDE8E0] transition-all"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 px-7 pt-4 pb-8 flex flex-col overflow-y-auto">
            {/* Category badge */}
            <div className="flex items-center gap-2 mb-5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: CATEGORY_CONFIG[station.event.category].color }}
              />
              <span
                className="text-[9px] tracking-[0.28em] uppercase"
                style={{
                  color: CATEGORY_CONFIG[station.event.category].color,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {CATEGORY_CONFIG[station.event.category].label}
              </span>
            </div>

            {/* Station name */}
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-[2.6rem] leading-[1.05] mb-3"
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                color: "#1a1a1a",
              }}
            >
              {station.event.title}
            </motion.h2>

            {/* Year */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.18, duration: 0.4 }}
              className="flex items-center gap-2 mb-7"
            >
              <MapPin size={10} style={{ color: CATEGORY_CONFIG[station.event.category].color }} />
              <span
                className="text-sm tracking-[0.15em] text-[#999]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {station.event.year}
              </span>
            </motion.div>

            {/* Divider */}
            <div
              className="mb-7 h-px"
              style={{ background: `linear-gradient(to right, ${CATEGORY_CONFIG[station.event.category].color}30, transparent)` }}
            />

            {/* Notes */}
            {station.event.notes ? (
              <motion.blockquote
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.4 }}
                className="text-[1.05rem] leading-[1.75] text-[#555] italic"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                &ldquo;{station.event.notes}&rdquo;
              </motion.blockquote>
            ) : (
              <p
                className="text-sm text-[#CCC] italic"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                No notes for this station.
              </p>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Bottom decoration */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 pt-6 mt-6 border-t border-[#EDE8E0]"
            >
              <div
                className="h-[3px] w-10 rounded-full"
                style={{ background: CATEGORY_CONFIG[station.event.category].color }}
              />
              <span
                className="text-[9px] tracking-[0.22em] text-[#C8BCA8] uppercase"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Station · {CATEGORY_CONFIG[station.event.category].label.replace(" Line", "")}
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
