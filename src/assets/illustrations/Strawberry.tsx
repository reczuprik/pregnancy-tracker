// src/assets/illustrations/Strawberry.tsx
import React from 'react';
import strawberryImg from '../strawberry.png'; // Path to your transparent PNG

const StrawberryIllustration = ({ size = 80 }: { size?: number }) => (
  <img
    src={strawberryImg}
    alt="Strawberry"
    width={size}
    height={size}
    style={{
      display: 'block',
      objectFit: 'contain',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
    }}
  />
);

export default StrawberryIllustration;
