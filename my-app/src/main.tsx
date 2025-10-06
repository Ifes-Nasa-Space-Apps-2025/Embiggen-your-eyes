// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // 1. Importe as ferramentas

import App from './App.tsx';
import HomePage from './pages/HomePage.tsx'; // 2. Importe a nova página
import './index.css';

// 3. Crie as rotas
const router = createBrowserRouter([
  {
    path: '/', // Na URL raiz (ex: localhost:5173/)
    element: <App />, // Mostre o componente App (nossa tela de entrada)
  },
  {
    path: '/home', // Na URL /home (ex: localhost:5173/home)
    element: <HomePage />, // Mostre o componente HomePage
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} /> {/* 4. Use o RouterProvider */}
  </React.StrictMode>,
);