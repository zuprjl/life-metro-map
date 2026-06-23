"use client";

import { LifeEvent, Category } from "@/lib/types";
import { CATEGORY_CONFIG } from "@/lib/constants";
import { nanoid } from "@/lib/nanoid";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  category: Category;
  events: LifeEvent[];
  onChange: (events: LifeEvent[]) => void;
}

export function CategoryStep({ category, events, onChange }: Props) {
  const config = CATEGORY_CONFIG[category];

  const addEvent = () => {
    onChange([
      ...events,
      { id: nanoid(), category, title: "", year: new Date().getFullYear(), notes: "" },
    ]);
  };

  const updateEvent = (id: string, field: keyof LifeEvent, value: string | number) => {
    onChange(events.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const removeEvent = (id: string) => {
    onChange(events.filter((e) => e.id !== id));
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-4 h-4 rounded-full" style={{ background: config.color }} />
        <p className="text-xs tracking-[0.25em] uppercase" style={{ color: config.color, fontFamily: "'Inter', sans-serif" }}>
          {config.label}
        </p>
      </div>
      <h2
        className="text-3xl text-[#1a1a1a] mb-6"
        style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
      >
        {categoryPrompt(category)}
      </h2>

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="group border border-[#e8e0d4] bg-white/60 rounded-sm p-4">
            <div className="flex gap-3 mb-3">
              <input
                type="text"
                value={event.title}
                onChange={(e) => updateEvent(event.id, "title", e.target.value)}
                placeholder="Station name"
                className="flex-1 bg-transparent border-b border-[#e0d8cc] focus:border-[#1a1a1a] outline-none text-base text-[#1a1a1a] pb-1 placeholder:text-[#ccc] transition-colors"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              />
              <input
                type="number"
                value={event.year}
                onChange={(e) => updateEvent(event.id, "year", parseInt(e.target.value) || new Date().getFullYear())}
                className="w-20 bg-transparent border-b border-[#e0d8cc] focus:border-[#1a1a1a] outline-none text-base text-[#888] pb-1 text-center transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
                min={1900}
                max={2099}
              />
              <button
                onClick={() => removeEvent(event.id)}
                className="text-[#ddd] hover:text-[#dc2626] transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <input
              type="text"
              value={event.notes}
              onChange={(e) => updateEvent(event.id, "notes", e.target.value)}
              placeholder="A short note about this moment..."
              className="w-full bg-transparent text-sm text-[#888] outline-none placeholder:text-[#ddd] italic"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={addEvent}
        className="mt-4 flex items-center gap-2 text-xs tracking-widest uppercase transition-colors"
        style={{ color: config.color, fontFamily: "'Inter', sans-serif" }}
      >
        <Plus size={14} />
        Add station
      </button>
    </div>
  );
}

function categoryPrompt(cat: Category): string {
  switch (cat) {
    case "education": return "Where did you learn?";
    case "career": return "Where did you work?";
    case "travel": return "Where did you go?";
    case "relationships": return "Who mattered most?";
    case "growth": return "How did you grow?";
  }
}
