// src/components/dashboard/StatusCard.tsx
import React from 'react';

interface StatusCardProps {
  children: React.ReactNode;
}

const StatusCard: React.FC<StatusCardProps> = ({ children }) => {
  return (
    <div className="status-card">
      {children}
    </div>
  );
};

export default StatusCard;