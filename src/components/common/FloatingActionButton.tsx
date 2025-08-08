// src/components/common/FloatingActionButton.tsx

import React from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="28" height="28"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <button className="fab" onClick={onClick} aria-label="Add new measurement">
      <PlusIcon />
    </button>
  );
};

export default FloatingActionButton;