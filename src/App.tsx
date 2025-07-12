import React from 'react';
import { GameManager } from './components/GameManager';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <GameManager />
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a2e',
            color: '#fff',
            border: '1px solid #4ecdc4'
          }
        }}
      />
    </>
  );
}

export default App;