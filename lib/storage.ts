import { LifeData } from "./types";
import { DEFAULT_DATA } from "./constants";

const KEY = "lifeMetroMap_v1";

export function loadData(): LifeData {
  if (typeof window === "undefined") return DEFAULT_DATA;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_DATA;
    return JSON.parse(raw) as LifeData;
  } catch {
    return DEFAULT_DATA;
  }
}

export function saveData(data: LifeData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(data));
}
