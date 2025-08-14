// src/components/dashboard/ProgressRing.tsx

import React, { useEffect, useState } from 'react';

interface ProgressRingProps {
  progress: number;
  children: React.ReactNode;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ progress, children }) => {
  const [offset, setOffset] = useState(0);
  const radius = 120; // Increased radius for larger ring
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progressOffset = ((100 - progress) / 100) * circumference;
    setOffset(progressOffset);
  }, [progress, circumference]);

  return (
    <div className="progress-ring-container">
      <svg 
        className="progress-ring"
        viewBox="0 0 260 260" // Larger viewBox
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B35" />
            <stop offset="100%" stopColor="#F28456" />
          </linearGradient>
        </defs>
        <circle
          className="progress-ring__track"
          strokeWidth="8"
          fill="transparent"
          r={radius}
          cx="130"
          cy="130"
        />
        <circle
          className="progress-ring__fill"
          strokeWidth="8"
          fill="transparent"
          r={radius}
          cx="130"
          cy="130"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>

      <div className="progress-ring__content">
        {children}
      </div>
    </div>
  );
};

export default ProgressRing;