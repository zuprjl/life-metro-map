"use client";

import { CATEGORY_CONFIG } from "@/lib/constants";
import { Category } from "@/lib/types";

interface Props {
  categories: Category[];
}

export function MapLegend({ categories }: Props) {
  const itemW = 120;
  const totalW = categories.length * itemW;
  const startX = 40;
  const y = 742;

  return (
    <g>
      {/* Background pill */}
      <rect x={startX - 8} y={y - 8} width={totalW + 16} height={36} rx={4}
        fill="white" opacity={0.82} />
      <rect x={startX - 8} y={y - 8} width={totalW + 16} height={36} rx={4}
        fill="none" stroke="#E8E0D4" strokeWidth={0.75} />

      {categories.map((cat, i) => {
        const config = CATEGORY_CONFIG[cat];
        const x = startX + i * itemW;
        return (
          <g key={cat}>
            {/* Color swatch */}
            <rect x={x} y={y + 6} width={20} height={4} rx={2} fill={config.color} />
            {/* Label */}
            <text
              x={x + 26} y={y + 10}
              fill="#777"
              fontSize={9}
              fontFamily="'Inter', sans-serif"
              letterSpacing="0.06em"
              dominantBaseline="middle"
            >
              {config.label.replace(" Line", "").toUpperCase()}
            </text>
          </g>
        );
      })}
    </g>
  );
}
