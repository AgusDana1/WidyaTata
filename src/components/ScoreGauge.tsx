"use client";

import React from "react";

interface ScoreGaugeProps {
  score: number;
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const clampedScore = Math.min(Math.max(score, 0), 100);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clampedScore / 100);

  const getColor = (s: number) => {
    if (s >= 80) return "#059669"; // Emerald 600
    if (s >= 60) return "#2563eb"; // Blue 600
    if (s >= 40) return "#d97706"; // Amber 600
    return "#dc2626"; // Red 600
  };

  const color = getColor(clampedScore);

  return (
    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
      <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference.toFixed(1)}
          strokeDashoffset={offset.toFixed(1)}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-3xl font-extrabold tracking-tight transition-colors"
          style={{ color }}
        >
          {clampedScore}
        </span>
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
          dari 100
        </span>
      </div>
    </div>
  );
}
