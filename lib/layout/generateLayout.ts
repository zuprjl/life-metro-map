import {
  Category, LifeEvent, LineLayout, MapLayout,
  StationLayout, IntersectionLayout, Point,
} from "../types";
import { CANVAS, CATEGORY_CONFIG } from "../constants";
import { ROUTES, RoutePoint } from "./routes";

// ─── Geometry helpers ────────────────────────────────────────────────────────

function segLen(a: RoutePoint, b: RoutePoint) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function routeLen(pts: RoutePoint[]) {
  let t = 0;
  for (let i = 0; i < pts.length - 1; i++) t += segLen(pts[i], pts[i + 1]);
  return t;
}

/** Walk `dist` units along the polyline and return the (x,y) reached. */
function walk(pts: RoutePoint[], dist: number): Point {
  let rem = dist;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const l = segLen(a, b);
    if (rem <= l + 0.001) {
      const t = Math.min(rem / l, 1);
      return { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) };
    }
    rem -= l;
  }
  return pts[pts.length - 1];
}

/** Index of the segment that contains position `dist` along the route. */
function segIdx(pts: RoutePoint[], dist: number): number {
  let rem = dist;
  for (let i = 0; i < pts.length - 1; i++) {
    const l = segLen(pts[i], pts[i + 1]);
    if (rem <= l + 0.001) return i;
    rem -= l;
  }
  return pts.length - 2;
}

function snap(v: number, g = 20) {
  return Math.round(v / g) * g;
}

/** Segment–segment intersection (interior only). */
function segIntersect(p1: Point, p2: Point, p3: Point, p4: Point): Point | null {
  const d1x = p2.x - p1.x, d1y = p2.y - p1.y;
  const d2x = p4.x - p3.x, d2y = p4.y - p3.y;
  const cross = d1x * d2y - d1y * d2x;
  if (Math.abs(cross) < 0.001) return null;
  const t = ((p3.x - p1.x) * d2y - (p3.y - p1.y) * d2x) / cross;
  const u = ((p3.x - p1.x) * d1y - (p3.y - p1.y) * d1x) / cross;
  if (t > 0.02 && t < 0.98 && u > 0.02 && u < 0.98) {
    return { x: snap(p1.x + t * d1x), y: snap(p1.y + t * d1y) };
  }
  return null;
}

// ─── Label direction ─────────────────────────────────────────────────────────

function labelSide(
  a: RoutePoint, b: RoutePoint, idx: number, cat: string
): "above" | "below" | "left" | "right" {
  const dx = b.x - a.x, dy = b.y - a.y;
  if (Math.abs(dy) < 2) {
    // horizontal segment: alternate above/below, biased by category zone
    const preferAbove = cat === "education" || cat === "travel";
    return (idx % 2 === 0) === preferAbove ? "above" : "below";
  }
  if (Math.abs(dx) < 2) {
    // vertical: alternate left/right
    return idx % 2 === 0 ? "right" : "left";
  }
  // diagonal ↗ (dx>0, dy<0): label above-right → "above"
  // diagonal ↘ (dx>0, dy>0): label below-right → "below"
  if (dy < 0) return idx % 2 === 0 ? "above" : "right";
  return idx % 2 === 0 ? "below" : "left";
}

// ─── SVG path string ─────────────────────────────────────────────────────────

function polyPath(pts: RoutePoint[]): string {
  return `M ${pts[0].x} ${pts[0].y} ` + pts.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
}

// ─── Main ────────────────────────────────────────────────────────────────────

export function generateLayout(events: LifeEvent[]): MapLayout {
  if (events.length === 0) {
    return { lines: [], intersections: [], viewBox: { width: CANVAS.width, height: CANVAS.height } };
  }

  const categories = Object.keys(CATEGORY_CONFIG) as Category[];
  const lines: LineLayout[] = [];

  for (const cat of categories) {
    const evs = events
      .filter(e => e.category === cat)
      .sort((a, b) => a.year - b.year);   // sort so labels read chronologically

    if (evs.length === 0) continue;

    const pts = ROUTES[cat];
    const total = routeLen(pts);
    const n = evs.length;

    // Distribute stations across 15%–85% of the route arc length
    // so termini remain clean and uncluttered
    const lo = 0.15, hi = 0.85;
    const span = hi - lo;

    const stations: StationLayout[] = evs.map((ev, i) => {
      const frac = n === 1 ? 0.5 : lo + (i / (n - 1)) * span;
      const dist = frac * total;
      const pos = walk(pts, dist);
      const si = segIdx(pts, dist);
      const side = labelSide(pts[si], pts[si + 1] ?? pts[si], i, cat);
      return {
        event: ev,
        position: pos,
        labelSide: side,
        isHub: false,
        isEmotionalCenter: ev.isEmotionalCenter === true,
      };
    });

    lines.push({ category: cat, stations, pathD: polyPath(pts) });
  }

  // ─── Intersection detection ───────────────────────────────────────────────
  const seen = new Map<string, IntersectionLayout>();
  const result: IntersectionLayout[] = [];

  for (let li = 0; li < lines.length; li++) {
    for (let lj = li + 1; lj < lines.length; lj++) {
      const A = lines[li], B = lines[lj];
      const wA = ROUTES[A.category], wB = ROUTES[B.category];

      for (let si = 0; si < wA.length - 1; si++) {
        for (let sj = 0; sj < wB.length - 1; sj++) {
          const pt = segIntersect(wA[si], wA[si + 1], wB[sj], wB[sj + 1]);
          if (!pt) continue;
          const key = `${pt.x},${pt.y}`;
          if (seen.has(key)) {
            const ex = seen.get(key)!;
            for (const c of [A.category, B.category])
              if (!ex.categories.includes(c)) ex.categories.push(c);
          } else {
            const ix: IntersectionLayout = { position: pt, categories: [A.category, B.category], eventTitles: [] };
            seen.set(key, ix);
            result.push(ix);
          }
        }
      }
    }
  }

  // ─── Label collision resolution ──────────────────────────────────────────
  const allSt = lines.flatMap(l => l.stations);

  // Step 1: Lock emotional center to "above" — cannot be overridden
  for (const st of allSt) {
    if (st.isEmotionalCenter) st.labelSide = "above";
  }

  // Step 2: Collect all pairs within 120px; sort closest-first so tightly-coupled
  // pairs are resolved first and later (farther) pairs don't undo them
  const pairs: Array<{ i: number; j: number; dist: number }> = [];
  for (let i = 0; i < allSt.length; i++) {
    for (let j = i + 1; j < allSt.length; j++) {
      const d = Math.hypot(
        allSt[i].position.x - allSt[j].position.x,
        allSt[i].position.y - allSt[j].position.y,
      );
      if (d < 120) pairs.push({ i, j, dist: d });
    }
  }
  pairs.sort((a, b) => a.dist - b.dist);

  // Step 3: Resolve each pair
  for (const { i, j } of pairs) {
    const a = allSt[i], b = allSt[j];
    if (a.isEmotionalCenter) {
      b.labelSide = b.position.y >= a.position.y ? "below" : "above";
      continue;
    }
    if (b.isEmotionalCenter) {
      a.labelSide = a.position.y >= b.position.y ? "below" : "above";
      continue;
    }
    const dy = a.position.y - b.position.y;
    const dx = a.position.x - b.position.x;
    if (Math.abs(dy) >= Math.abs(dx) * 0.4) {
      // Vertically separated: higher station label goes above, lower goes below
      allSt[i].labelSide = dy <= 0 ? "above" : "below";
      allSt[j].labelSide = dy <= 0 ? "below" : "above";
    } else {
      // Primarily horizontal: push labels to opposite sides
      allSt[i].labelSide = dx <= 0 ? "left" : "right";
      allSt[j].labelSide = dx <= 0 ? "right" : "left";
    }
  }

  // Step 4: Final safety pass — if two stations are still within 30px and share a
  // label side, push the second one perpendicular
  for (let i = 0; i < allSt.length; i++) {
    for (let j = i + 1; j < allSt.length; j++) {
      const a = allSt[i], b = allSt[j];
      if (a.isEmotionalCenter || b.isEmotionalCenter) continue;
      const d = Math.hypot(a.position.x - b.position.x, a.position.y - b.position.y);
      if (d < 30 && a.labelSide === b.labelSide) {
        const dy = a.position.y - b.position.y;
        const dx = a.position.x - b.position.x;
        if (a.labelSide === "above" || a.labelSide === "below") {
          allSt[j].labelSide = dx >= 0 ? "right" : "left";
        } else {
          allSt[j].labelSide = dy >= 0 ? "below" : "above";
        }
      }
    }
  }

  // Mark hub stations: those within 48px of any interchange marker
  for (const line of lines) {
    for (const st of line.stations) {
      st.isHub = result.some(
        ix => Math.hypot(ix.position.x - st.position.x, ix.position.y - st.position.y) < 48
      );
    }
  }

  // Only keep intersection markers where 3+ lines cross (reduces clutter)
  // 2-line crossings are still rendered but at reduced visual weight via categories.length check
  return { lines, intersections: result, viewBox: { width: CANVAS.width, height: CANVAS.height } };
}
