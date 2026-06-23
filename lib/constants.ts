import { Category, LifeData } from "./types";

export const CATEGORY_CONFIG: Record<
  Category,
  { label: string; color: string; dashArray?: string; order: number }
> = {
  education: {
    label: "Education Line",
    color: "#2563EB",
    order: 0,
  },
  career: {
    label: "Career Line",
    color: "#16A34A",
    order: 1,
  },
  travel: {
    label: "Travel Line",
    color: "#EA580C",
    order: 2,
  },
  relationships: {
    label: "Relationship Line",
    color: "#DC2626",
    dashArray: "none",
    order: 3,
  },
  growth: {
    label: "Growth Line",
    color: "#7C3AED",
    order: 4,
  },
};

export const CANVAS = {
  width: 1400,
  height: 820,
  paddingX: 100,
  paddingY: 80,
  lineStrokeWidth: 5,
  stationRadius: 10,
  intersectionRadius: 14,
};

export const LANE_CENTERS = [160, 290, 420, 560, 690];

export const DEFAULT_DATA: LifeData = {
  name: "Maya Santos",
  events: [
    // Education
    {
      id: "edu-1",
      category: "education",
      title: "Design Academy",
      year: 2012,
      notes: "Where everything began to take shape.",
    },
    {
      id: "edu-2",
      category: "education",
      title: "Graduation",
      year: 2016,
      notes: "The last day I had to ask for permission.",
    },

    // Career
    {
      id: "car-1",
      category: "career",
      title: "Studio Assistant",
      year: 2016,
      notes: "First coffee. First brief. First real yes.",
    },
    {
      id: "car-2",
      category: "career",
      title: "Archipelago Co.",
      year: 2018,
      notes: "Found my design voice here.",
    },
    {
      id: "car-3",
      category: "career",
      title: "Principal Designer",
      year: 2021,
      notes: "They trusted me to lead. I was terrified.",
    },
    {
      id: "car-4",
      category: "career",
      title: "Lumen Studio",
      year: 2025,
      notes: "Built something entirely my own.",
    },

    // Travel — Lisbon is the emotional center
    {
      id: "trv-1",
      category: "travel",
      title: "Manila",
      year: 1994,
      notes: "Home. Where I learned what warmth means.",
    },
    {
      id: "trv-2",
      category: "travel",
      title: "Lisbon",
      year: 2020,
      notes: "Everything pivoted here.",
      isEmotionalCenter: true,
    },
    {
      id: "trv-3",
      category: "travel",
      title: "New York",
      year: 2022,
      notes: "The city I thought I wanted.",
    },
    {
      id: "trv-4",
      category: "travel",
      title: "Back Home",
      year: 2024,
      notes: "Returned different. Grateful for it.",
    },

    // Relationships
    {
      id: "rel-1",
      category: "relationships",
      title: "Marco",
      year: 2018,
      notes: "A slow beginning. The best kind.",
    },
    {
      id: "rel-2",
      category: "relationships",
      title: "Engagement",
      year: 2021,
      notes: "We decided to make it official.",
    },
    {
      id: "rel-3",
      category: "relationships",
      title: "Separation",
      year: 2023,
      notes: "We grew in different directions. That's okay.",
    },

    // Growth
    {
      id: "grw-1",
      category: "growth",
      title: "Burnout",
      year: 2019,
      notes: "The signal I kept ignoring, finally loud enough.",
    },
    {
      id: "grw-2",
      category: "growth",
      title: "Therapy",
      year: 2020,
      notes: "Learning to sit with uncomfortable things.",
    },
    {
      id: "grw-3",
      category: "growth",
      title: "Rebuilding",
      year: 2022,
      notes: "Quieter. More deliberate. More me.",
    },
  ],
};
