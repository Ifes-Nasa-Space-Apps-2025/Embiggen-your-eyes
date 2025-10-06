// src/components/Sidebar.tsx
import React, { useState } from 'react';
import './Sidebar.css';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // 1. NOVO ESTADO: para controlar o dropdown de "Pin options"
  const [isPinOptionsOpen, setPinOptionsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // 2. NOVA FUNÇÃO: para controlar o toggle do dropdown
  const handlePinOptionsToggle = () => {
    setPinOptionsOpen(!isPinOptionsOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="toggle-button" onClick={handleToggle}>
        {isOpen ? <FaAngleLeft /> : <FaAngleRight />}
      </button>

      {isOpen && (
        <div className="sidebar-content">
          <h2>Menu</h2>
          <ul>
            {/* 3. Item de menu agora é clicável */}
            <li className="menu-item-toggle" onClick={handlePinOptionsToggle}>
              + Pin options
            </li>

            {/* 4. SUBMENU: Renderizado condicionalmente e com classes dinâmicas */}
            <ul className={`submenu ${isPinOptionsOpen ? 'open' : ''}`}>
              <li>Mark area</li>
              <li>Add text</li>
              
            </ul>

            {/* Adicione outros itens de menu principais aqui, se desejar */}
            
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;