// src/components/LandingMessage.tsx
import React from 'react';
import './LandingMessage.css'; // Vamos criar este CSS a seguir

const LandingMessage: React.FC = () => {
  return (
    <div className="content">
      <h1>Cosmic quest</h1>
      <div className="line"></div>
      <p>Explore outer space in a way</p>
      <p>you've never seen before</p>
      <span className="press-key">Press Enter to start</span>
    </div>
  );
};

export default LandingMessage;