"use client";

import { useState } from "react";
import { LifeData } from "@/lib/types";
import { useLifeData } from "@/hooks/useLifeData";
import { EventWizard } from "@/components/wizard/EventWizard";
import { MapView } from "@/components/map/MapView";

type View = "wizard" | "map";

export default function Home() {
  const { data, setData, resetToDefault } = useLifeData();
  const [view, setView] = useState<View>("map");

  if (!data) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <p className="text-sm tracking-widest text-[#ccc]" style={{ fontFamily: "'Inter', sans-serif" }}>
          Loading...
        </p>
      </div>
    );
  }

  const handleWizardComplete = (updated: LifeData) => {
    setData(updated);
    setView("map");
  };

  const handleReset = () => {
    resetToDefault();
    setView("map");
  };

  if (view === "wizard") {
    return (
      <EventWizard
        initialData={data}
        onComplete={handleWizardComplete}
        onCancel={data.events.length > 0 ? () => setView("map") : undefined}
      />
    );
  }

  return (
    <MapView
      data={data}
      onEdit={() => setView("wizard")}
      onReset={handleReset}
    />
  );
}
