"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LifeData, LifeEvent, Category } from "@/lib/types";
import { CATEGORY_CONFIG } from "@/lib/constants";
import { nanoid } from "@/lib/nanoid";
import { CategoryStep } from "./CategoryStep";

const STEPS: Category[] = ["education", "career", "travel", "relationships", "growth"];

interface Props {
  initialData: LifeData;
  onComplete: (data: LifeData) => void;
  onCancel?: () => void;
}

export function EventWizard({ initialData, onComplete, onCancel }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(initialData.name === "Your Life" ? "" : initialData.name);
  const [events, setEvents] = useState<LifeEvent[]>(initialData.events);
  const [direction, setDirection] = useState(1);

  const isNameStep = step === 0;
  const categoryIndex = step - 1;
  const currentCategory = STEPS[categoryIndex];
  const isLast = step === STEPS.length + 1;

  const catEvents = (cat: Category) => events.filter((e) => e.category === cat);

  const updateCatEvents = (cat: Category, updated: LifeEvent[]) => {
    setEvents((prev) => [...prev.filter((e) => e.category !== cat), ...updated]);
  };

  const go = (delta: number) => {
    setDirection(delta);
    setStep((s) => s + delta);
  };

  const handleSubmit = () => {
    const finalName = name.trim() || "Your Life";
    onComplete({ name: finalName, events });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      {/* Header */}
      <div className="border-b border-[#e0d8cc] px-8 py-5 flex items-center justify-between">
        <div>
          <h1
            className="text-2xl tracking-widest text-[#1a1a1a]"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            LIFE METRO MAP
          </h1>
          <p className="text-xs tracking-[0.2em] text-[#999] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
            Turn your life into a transit map
          </p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-xs tracking-widest text-[#999] hover:text-[#333] transition-colors uppercase"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Back to map
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-[#e8e0d4]">
        <motion.div
          className="h-full bg-[#D97706]"
          animate={{ width: `${((step) / (STEPS.length + 1)) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 pt-8 pb-2">
        {[0, ...STEPS.map((_, i) => i + 1), STEPS.length + 1].map((s) => (
          <div
            key={s}
            className="rounded-full transition-all duration-300"
            style={{
              width: s === step ? 24 : 6,
              height: 6,
              background:
                s < step
                  ? "#D97706"
                  : s === step
                  ? STEPS[s - 1]
                    ? CATEGORY_CONFIG[STEPS[s - 1]].color
                    : "#D97706"
                  : "#e0d8cc",
            }}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait" custom={direction}>
            {isNameStep && (
              <motion.div
                key="name"
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-xs tracking-[0.25em] text-[#D97706] uppercase mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Getting started
                </p>
                <h2
                  className="text-3xl text-[#1a1a1a] mb-8"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  What's your name?
                </h2>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && go(1)}
                  placeholder="Your name"
                  autoFocus
                  className="w-full bg-transparent border-b-2 border-[#e0d8cc] focus:border-[#D97706] outline-none text-2xl text-[#1a1a1a] pb-2 placeholder:text-[#ccc] transition-colors"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                />
                <p className="text-xs text-[#bbb] mt-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                  This will appear as the map title
                </p>
              </motion.div>
            )}

            {!isNameStep && !isLast && currentCategory && (
              <motion.div
                key={currentCategory}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.25 }}
              >
                <CategoryStep
                  category={currentCategory}
                  events={catEvents(currentCategory)}
                  onChange={(updated) => updateCatEvents(currentCategory, updated)}
                />
              </motion.div>
            )}

            {isLast && (
              <motion.div
                key="review"
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-xs tracking-[0.25em] text-[#D97706] uppercase mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Almost there
                </p>
                <h2
                  className="text-3xl text-[#1a1a1a] mb-2"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  Ready to generate your map
                </h2>
                <p className="text-sm text-[#888] mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {events.length} station{events.length !== 1 ? "s" : ""} across {STEPS.filter((s) => catEvents(s).length > 0).length} lines
                </p>

                {STEPS.filter((cat) => catEvents(cat).length > 0).map((cat) => (
                  <div key={cat} className="flex items-start gap-3 mb-4">
                    <div
                      className="mt-1.5 w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: CATEGORY_CONFIG[cat].color }}
                    />
                    <div>
                      <p className="text-xs tracking-widest text-[#888] uppercase mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {CATEGORY_CONFIG[cat].label}
                      </p>
                      <p className="text-sm text-[#444]" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {catEvents(cat).map((e) => e.title).join(" · ")}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-10">
            <button
              onClick={() => go(-1)}
              disabled={step === 0}
              className="text-sm tracking-widest text-[#999] hover:text-[#333] transition-colors uppercase disabled:opacity-0"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              ← Back
            </button>

            {!isLast ? (
              <button
                onClick={() => go(1)}
                className="px-8 py-3 text-xs tracking-[0.2em] uppercase transition-colors"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  background: "#1a1a1a",
                  color: "#FAF7F2",
                }}
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 text-xs tracking-[0.2em] uppercase transition-colors"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  background: "#D97706",
                  color: "white",
                }}
              >
                Generate Map →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
