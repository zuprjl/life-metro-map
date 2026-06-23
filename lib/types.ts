export type Category =
  | "education"
  | "career"
  | "travel"
  | "relationships"
  | "growth";

export interface LifeEvent {
  id: string;
  category: Category;
  title: string;
  year: number;
  notes: string;
  isEmotionalCenter?: boolean;
}

export interface LifeData {
  name: string;
  events: LifeEvent[];
}

export interface Point {
  x: number;
  y: number;
}

export interface StationLayout {
  event: LifeEvent;
  position: Point;
  labelSide: "above" | "below" | "left" | "right";
  isHub: boolean;
  isEmotionalCenter: boolean;
}

export interface LineLayout {
  category: Category;
  stations: StationLayout[];
  pathD: string;
}

export interface IntersectionLayout {
  position: Point;
  categories: Category[];
  eventTitles: string[];
}

export interface MapLayout {
  lines: LineLayout[];
  intersections: IntersectionLayout[];
  viewBox: { width: number; height: number };
}
