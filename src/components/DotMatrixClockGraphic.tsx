
"use client";

import type { FC} from 'react';
import { useState, useEffect } from 'react';

const GRID_SIZE = 25; // e.g., 25x25 grid
const DOT_RADIUS = 1.8;
const DOT_SPACING = 5; // Center to center spacing
const SVG_SIZE = (GRID_SIZE -1) * DOT_SPACING + DOT_RADIUS * 2 + 2; // canvas size

const HAND_DOT_RADIUS = 2;
const HOUR_HAND_LENGTH = 7; // Number of dots from center, including center
const MINUTE_HAND_LENGTH = 10;
const SECOND_HAND_LENGTH = 12;

const DotMatrixClockGraphic: FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const getHandDots = (
    angle: number,
    length: number, // Number of dots in the hand (e.g., HOUR_HAND_LENGTH)
    svgGridCenterX: number, // SVG X-coordinate of the center of the dot grid
    svgGridCenterY: number  // SVG Y-coordinate of the center of the dot grid
  ): Set<string> => {
    const dots = new Set<string>();
    if (length === 0) return dots;

    for (let i = 0; i < length; i++) { // i is the 0-indexed dot number from the center
      // Calculate the pixel distance of the i-th dot from the SVG center of the grid
      const r = i * DOT_SPACING; 

      // Calculate absolute SVG coordinates of the i-th dot on the hand
      const dotSvgX = svgGridCenterX + r * Math.cos(angle - Math.PI / 2); // Offset angle by -PI/2 because 0 is East
      const dotSvgY = svgGridCenterY + r * Math.sin(angle - Math.PI / 2);

      // Convert these absolute SVG coordinates to grid indices (gx, gy)
      // The SVG coordinate of the center of grid cell (c, r_idx) is (c * DOT_SPACING + DOT_RADIUS + 1, r_idx * DOT_SPACING + DOT_RADIUS + 1)
      const gx = Math.round((dotSvgX - (DOT_RADIUS + 1)) / DOT_SPACING);
      const gy = Math.round((dotSvgY - (DOT_RADIUS + 1)) / DOT_SPACING);
      
      if (gx >=0 && gx < GRID_SIZE && gy >=0 && gy < GRID_SIZE) {
         dots.add(`${gx}-${gy}`);
      }
    }
    return dots;
  };

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const hourAngle = ((hours % 12) + minutes / 60) * (2 * Math.PI / 12);
  const minuteAngle = (minutes + seconds / 60) * (2 * Math.PI / 60);
  const secondAngle = seconds * (2 * Math.PI / 60);
  
  // Calculate grid center in terms of grid indices
  const gridCenterIndexX = Math.floor(GRID_SIZE / 2); // e.g., 12 for GRID_SIZE 25
  const gridCenterIndexY = Math.floor(GRID_SIZE / 2);

  // Calculate the SVG coordinates of the center of the central dot
  const svgGridActualCenterX = gridCenterIndexX * DOT_SPACING + DOT_RADIUS + 1;
  const svgGridActualCenterY = gridCenterIndexY * DOT_SPACING + DOT_RADIUS + 1;

  const hourDots = getHandDots(hourAngle, HOUR_HAND_LENGTH, svgGridActualCenterX, svgGridActualCenterY);
  const minuteDots = getHandDots(minuteAngle, MINUTE_HAND_LENGTH, svgGridActualCenterX, svgGridActualCenterY);
  const secondDots = getHandDots(secondAngle, SECOND_HAND_LENGTH, svgGridActualCenterX, svgGridActualCenterY);

  const dots = [];
  for (let r_idx = 0; r_idx < GRID_SIZE; r_idx++) { // r_idx for row index to avoid conflict with 'r' for radius
    for (let c_idx = 0; c_idx < GRID_SIZE; c_idx++) { // c_idx for column index
      const key = `${c_idx}-${r_idx}`;
      let fill = "hsl(var(--border))"; // Background dot color
      // The center dot of the grid is at (gridCenterIndexX, gridCenterIndexY)
      const isCenterDotOnGrid = r_idx === gridCenterIndexY && c_idx === gridCenterIndexX;


      if (secondDots.has(key)) {
        fill = "hsl(var(--primary))";
      } else if (minuteDots.has(key)) {
        fill = "hsl(var(--foreground))";
      } else if (hourDots.has(key)) {
        fill = "hsl(var(--foreground))";
      } else if (isCenterDotOnGrid) { // Ensure the physical center dot has a distinct color if not covered by a hand
        fill = "hsl(var(--muted-foreground))";
      }


      dots.push(
        <circle
          key={key}
          cx={c_idx * DOT_SPACING + DOT_RADIUS + 1}
          cy={r_idx * DOT_SPACING + DOT_RADIUS + 1}
          r={secondDots.has(key) || minuteDots.has(key) || hourDots.has(key) ? HAND_DOT_RADIUS : DOT_RADIUS}
          fill={fill}
        />
      );
    }
  }

  return (
    <svg
      width={SVG_SIZE}
      height={SVG_SIZE}
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      className="mx-auto"
    >
      {dots}
    </svg>
  );
};

export default DotMatrixClockGraphic;
