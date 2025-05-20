"use client";

import React from "react";

export interface HexChartPoint {
  name: string;
  value: number;
  color: string;
}

export interface HexChartProps {
  points: HexChartPoint[];
  size?: number;
  className?: string;
}

export function HexChart({ 
  points = [
    { name: "Sentiment Analysis", value: 0.9, color: "rgba(147, 51, 234, 0.7)" },  // Purple
    { name: "Token Analytics", value: 0.85, color: "rgba(59, 130, 246, 0.7)" },    // Blue
    { name: "Strategy AI", value: 0.95, color: "rgba(16, 185, 129, 0.7)" },        // Green
    { name: "DEX Insights", value: 0.8, color: "rgba(239, 68, 68, 0.7)" },         // Red
    { name: "User Experience", value: 0.85, color: "rgba(249, 115, 22, 0.7)" },    // Orange
    { name: "Performance", value: 0.9, color: "rgba(236, 72, 153, 0.7)" }          // Pink
  ],
  size = 600,
  className = "",
}: HexChartProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size, margin: "0 auto" }}>
      {/* Concentric hexagons for scale */}
      {[0.2, 0.4, 0.6, 0.8, 1].map((scale, idx) => (
        <div 
          key={idx}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            width: `${scale * 100}%`,
            height: `${scale * 100}%`,
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            border: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: idx === 0 ? "rgba(255,255,255,0.03)" : "transparent",
            zIndex: 1,
          }}
        />
      ))}
      
      {/* Data area - use gradient background for visual appeal */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "100%",
          height: "100%",
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          background: "linear-gradient(135deg, rgba(147, 51, 234, 0.4), rgba(16, 185, 129, 0.4))",
          zIndex: 5,
          opacity: 0.5,
        }}
      />
      
      {/* Feature points and labels */}
      {points.map((point, idx) => {
        // Calculate position around hexagon (60 degree intervals)
        const angle = (Math.PI / 3) * idx - Math.PI / 2;
        const x = 50 + 48 * Math.cos(angle);
        const y = 50 + 48 * Math.sin(angle);
        
        // Calculate data point position based on its value
        const dataX = 50 + 48 * point.value * Math.cos(angle);
        const dataY = 50 + 48 * point.value * Math.sin(angle);
        
        return (
          <React.Fragment key={idx}>
            {/* Data point */}
            <div 
              className="absolute w-3 h-3 rounded-full bg-primary shadow-glow"
              style={{
                left: `${dataX}%`,
                top: `${dataY}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 15,
                boxShadow: `0 0 10px ${point.color}`,
                backgroundColor: point.color,
              }}
            />
            
            {/* Feature label */}
            <div 
              className="absolute font-medium text-sm md:text-base"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
            >
              <div className="bg-background/80 backdrop-blur-sm p-2 rounded-md shadow-md">
                {point.name}
              </div>
            </div>
            
            {/* Line from center to data point */}
            <div 
              className="absolute top-1/2 left-1/2 origin-center"
              style={{
                width: `${point.value * 50}%`,
                height: "2px",
                background: `linear-gradient(to right, transparent, ${point.color})`,
                transform: `rotate(${(angle + Math.PI/2) * (180/Math.PI)}deg)`,
                zIndex: 8,
                opacity: 0.7,
              }}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}
