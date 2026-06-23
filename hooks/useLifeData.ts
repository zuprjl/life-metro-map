"use client";

import { useEffect, useState, useCallback } from "react";
import { LifeData, LifeEvent, Category } from "@/lib/types";
import { loadData, saveData } from "@/lib/storage";
import { nanoid } from "@/lib/nanoid";

export function useLifeData() {
  const [data, setData] = useState<LifeData | null>(null);

  useEffect(() => {
    setData(loadData());
  }, []);

  const updateData = useCallback((next: LifeData) => {
    setData(next);
    saveData(next);
  }, []);

  const addEvent = useCallback(
    (
      category: Category,
      title: string,
      year: number,
      notes: string
    ) => {
      if (!data) return;
      const event: LifeEvent = { id: nanoid(), category, title, year, notes };
      updateData({ ...data, events: [...data.events, event] });
    },
    [data, updateData]
  );

  const removeEvent = useCallback(
    (id: string) => {
      if (!data) return;
      updateData({ ...data, events: data.events.filter((e) => e.id !== id) });
    },
    [data, updateData]
  );

  const updateEvent = useCallback(
    (updated: LifeEvent) => {
      if (!data) return;
      updateData({
        ...data,
        events: data.events.map((e) => (e.id === updated.id ? updated : e)),
      });
    },
    [data, updateData]
  );

  const setName = useCallback(
    (name: string) => {
      if (!data) return;
      updateData({ ...data, name });
    },
    [data, updateData]
  );

  const resetToDefault = useCallback(() => {
    import("@/lib/constants").then(({ DEFAULT_DATA }) => {
      updateData(DEFAULT_DATA);
    });
  }, [updateData]);

  return { data, addEvent, removeEvent, updateEvent, setName, resetToDefault, setData: updateData };
}
