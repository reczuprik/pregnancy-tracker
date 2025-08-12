// src/components/dashboard/ProgressRing.tsx

import React, { useEffect, useState } from 'react';

interface ProgressRingProps {
  progress: number; // A value from 0 to 100
  children: React.ReactNode;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ progress, children }) => {
  const [offset, setOffset] = useState(0);
  const circumference = 339.292; // 2 * pi * 54 (radius)

  useEffect(() => {
    const progressOffset = ((100 - progress) / 100) * circumference;
    setOffset(progressOffset);
  }, [progress, circumference]);

  return (
    <div className="progress-ring-container">
      
      <svg className="progress-ring" width="220" height="220">
        <circle
          className="progress-ring__track"
          strokeWidth="12"
          fill="transparent"
          r="54"
          cx="110"
          cy="110"
        />
        <circle
          className="progress-ring__fill"
          strokeWidth="12"
          fill="transparent"
          r="54"
          cx="110"
          cy="110"
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