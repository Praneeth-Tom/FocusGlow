
"use client";

import type { FC} from 'react';
import { useState, useEffect } from 'react';

const GRID_SIZE = 25; // e.g., 25x25 grid
const DOT_RADIUS = 1.8;
const DOT_SPACING = 5; // Center to center spacing
const SVG_SIZE = (GRID_SIZE -1) * DOT_SPACING + DOT_RADIUS * 2 + 2; // canvas size
const CENTER_OFFSET = (SVG_SIZE / 2);

const HAND_DOT_RADIUS = 2;
const HOUR_HAND_LENGTH = 7; // Number of dots from center
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
    length: number,
    centerX: number,
    centerY: number
  ): Set<string> => {
    const dots = new Set<string>();
    for (let i = 0; i < length; i++) {
      // Calculate position along the hand vector
      // Scale `i` so the hand extends up to `length` units, where each unit is `DOT_SPACING`
      const r = (i * DOT_SPACING) / (DOT_SPACING * 0.8) ; // Adjust scaling factor as needed
      const x = centerX + r * Math.cos(angle - Math.PI / 2); // PI/2 offset because 0 angle is East
      const y = centerY + r * Math.sin(angle - Math.PI / 2);

      // Find the nearest grid cell
      const gx = Math.round((x - DOT_RADIUS) / DOT_SPACING);
      const gy = Math.round((y - DOT_RADIUS) / DOT_SPACING);
      
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
  
  const gridCenterX = (GRID_SIZE -1 ) / 2;
  const gridCenterY = (GRID_SIZE -1 ) / 2;

  const hourDots = getHandDots(hourAngle, HOUR_HAND_LENGTH, gridCenterX, gridCenterY);
  const minuteDots = getHandDots(minuteAngle, MINUTE_HAND_LENGTH, gridCenterX, gridCenterY);
  const secondDots = getHandDots(secondAngle, SECOND_HAND_LENGTH, gridCenterX, gridCenterY);

  const dots = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const key = `${c}-${r}`;
      let fill = "hsl(var(--border))"; // Background dot color
      const isCenterDot = r === gridCenterY && c === gridCenterX;


      if (secondDots.has(key)) {
        fill = "hsl(var(--primary))";
      } else if (minuteDots.has(key)) {
        fill = "hsl(var(--foreground))";
      } else if (hourDots.has(key)) {
        fill = "hsl(var(--foreground))";
      } else if (isCenterDot) {
        fill = "hsl(var(--muted-foreground))";
      }


      dots.push(
        <circle
          key={key}
          cx={c * DOT_SPACING + DOT_RADIUS + 1}
          cy={r * DOT_SPACING + DOT_RADIUS + 1}
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
