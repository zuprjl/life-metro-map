/**
 * Route skeletons for each metro line.
 *
 * Design rules:
 * - Every segment must be H (Δy=0), V (Δx=0), or 45° (|Δx|=|Δy|).
 * - Lines must have distinct visual personalities — not all left-to-right.
 * - Routes must cross each other to produce real interchange nodes.
 * - Canvas: 1400 × 820, safe area x:80–1320, y:100–740.
 *
 * Line personalities:
 *   Education  (Blue)   — W-shape: upper horizontal with a downward dip through centre
 *   Career     (Green)  — Diagonal sweep SW → NE with flat centre section
 *   Travel     (Orange) — N-shape: rises, plateaus, dips, plateaus, rises again
 *   Relationships (Red) — Arch: enters top-centre, dips to lower, exits top-right
 *   Growth     (Purple) — Rising diagonal from lower-left to upper-right
 */

import { Category } from "../types";

export interface RoutePoint { x: number; y: number; }

export const ROUTES: Record<Category, RoutePoint[]> = {
  // ── EDUCATION (Blue) ── W-shape across upper canvas ──────────────────────
  // H → 45°↘ → H → 45°↗ → H → 45°↘
  education: [
    { x:  80, y: 180 },   // west terminus
    { x: 340, y: 180 },
    { x: 460, y: 300 },   // dips through centre
    { x: 660, y: 300 },
    { x: 780, y: 180 },   // rises back up
    { x: 1100, y: 180 },
    { x: 1320, y: 400 },  // east terminus (angles down)
  ],

  // ── CAREER (Green) ── SW→NE diagonal sweep ───────────────────────────────
  // 45°↗ → H → 45°↗ → H → 45°↘
  career: [
    { x:  80, y: 640 },   // south-west terminus
    { x: 300, y: 420 },
    { x: 580, y: 420 },   // flat centre section
    { x: 800, y: 200 },
    { x: 1200, y: 200 },  // upper-right plateau
    { x: 1320, y: 320 },  // east terminus (angles down slightly)
  ],

  // ── TRAVEL (Orange) ── N-shape: wide arc across the full canvas ──────────
  // 45°↗ → H → 45°↘ → H → 45°↗
  travel: [
    { x:  80, y: 420 },   // west terminus (mid-height)
    { x: 260, y: 240 },   // rises
    { x: 580, y: 240 },   // upper plateau
    { x: 820, y: 480 },   // dips through lower-centre
    { x: 1060, y: 480 },  // lower plateau
    { x: 1280, y: 260 },  // rises to east terminus
  ],

  // ── RELATIONSHIPS (Red) ── Arch through centre ───────────────────────────
  // 45°↘ → V → H → 45°↗ → V
  relationships: [
    { x: 420, y: 100 },   // north terminus (left)
    { x: 640, y: 320 },   // diagonal into centre
    { x: 640, y: 560 },   // vertical down
    { x: 860, y: 560 },   // horizontal across lower centre
    { x: 1080, y: 340 },  // diagonal up to right
    { x: 1080, y: 100 },  // vertical to north terminus (right)
  ],

  // ── GROWTH (Purple) ── Rising diagonal from lower-left ───────────────────
  // 45°↗ → H → 45°↗ → H → 45°↗
  growth: [
    { x: 200, y: 740 },   // south terminus
    { x: 440, y: 500 },
    { x: 680, y: 500 },   // lower plateau
    { x: 920, y: 260 },
    { x: 1160, y: 260 },  // upper plateau
    { x: 1320, y: 100 },  // north-east terminus
  ],
};
