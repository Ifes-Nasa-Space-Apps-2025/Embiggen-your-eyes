// src/components/LandingScreen.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './LandingScreen.css';
import LandingMessage from './LandingMessage';
import spaceVideo from '../assets/space-video.mp4';

const LandingScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Modificamos a função para receber o 'event' do teclado
    const handleKeyDown = (event: KeyboardEvent) => {
      // 2. Verificamos se a tecla pressionada foi 'Enter'
      if (event.key === 'Enter') {
        console.log('Tecla Enter pressionada! Navegando para /home...');
        navigate('/home'); // 3. A navegação agora só acontece dentro do 'if'
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  return (
    <div className="fullscreen-video-container">
      <video
        autoPlay
        loop
        muted
        playsInline
        id="background-video"
        src={spaceVideo}
      />
      <LandingMessage />
    </div>
  );
};

export default LandingScreen;