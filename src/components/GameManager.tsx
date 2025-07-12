import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { GameCanvas } from './GameCanvas';
import { GameUI } from './GameUI';
import { MainMenu } from './MainMenu';
import { UpgradeSelection } from './UpgradeSelection';
import { GameOverScreen } from './GameOverScreen';
import { PauseMenu } from './PauseMenu';
import { LevelTransition } from './LevelTransition';
import { VictoryScreen } from './VictoryScreen';
import { Leaderboard } from './Leaderboard';
import { LevelComplete } from './LevelComplete';
import { Game3D } from '../game3d/Game3D';
import toast from 'react-hot-toast';

export const GameManager: React.FC = () => {
  const gameRef = useRef<Game3D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const {
    gameState,
    nivelActual,
    isTransitioning,
    showUpgradeSelection,
    nivelArma
  } = useGameStore();

  // Initialize game when canvas is ready and game starts
  useEffect(() => {
    if (canvasRef.current && gameState === 'playing' && !gameRef.current && !isTransitioning) {
      gameRef.current = new Game3D(canvasRef.current);
      gameRef.current.start();
      gameRef.current.startLevel(nivelActual);
      
      toast.success(`¡Nivel ${nivelActual} iniciado!`, {
        icon: '🚀',
        style: {
          background: 'rgba(15, 23, 42, 0.95)',
          color: '#fff',
          border: '1px solid rgba(34, 211, 238, 0.5)',
          borderRadius: '12px',
          backdropFilter: 'blur(12px)'
        }
      });
    }
    
    return () => {
      if (gameRef.current && (gameState === 'menu' || gameState === 'gameOver' || gameState === 'victory')) {
        gameRef.current.dispose();
        gameRef.current = null;
      }
    };
  }, [gameState, isTransitioning]);

  // Handle level changes
  useEffect(() => {
    if (gameRef.current && gameState === 'playing' && !isTransitioning && nivelActual > 1) {
      gameRef.current.startLevel(nivelActual);
      
      toast.success(`¡Nivel ${nivelActual} desbloqueado!`, {
        icon: '⭐',
        duration: 2000,
        style: {
          background: 'rgba(15, 23, 42, 0.95)',
          color: '#fff',
          border: '1px solid rgba(34, 211, 238, 0.5)',
          borderRadius: '12px',
          backdropFilter: 'blur(12px)'
        }
      });
    }
  }, [nivelActual, gameState, isTransitioning]);

  // Handle weapon upgrades
  useEffect(() => {
    if (gameState === 'playing') {
      const weaponNames = {
        0: 'Disparo Básico',
        1: 'Disparo Doble',
        2: 'Disparo Triple',
        3: 'Abanico',
        4: 'Abanico + Misil Central',
        5: 'Abanico + Misil Derecho',
        6: 'Abanico + Misil Izquierdo',
        7: 'Abanico + 2 Misiles',
        8: 'Abanico + 3 Misiles',
        9: 'Arsenal Completo + Láseres'
      };
      
      const weaponName = weaponNames[nivelArma as keyof typeof weaponNames];
      if (weaponName && nivelArma > 0) {
        toast.success(`¡Arma mejorada: ${weaponName}!`, {
          icon: '⚡',
          duration: 3000,
          style: {
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#fff',
            border: '1px solid rgba(251, 191, 36, 0.5)',
            borderRadius: '12px',
            backdropFilter: 'blur(12px)'
          }
        });
      }
    }
  }, [nivelArma]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D Canvas Background - Always rendered */}
      <GameCanvas ref={canvasRef} />
      
      {/* UI Overlays with proper z-index */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 z-50">
          <MainMenu />
        </div>
      )}
      
      {gameState === 'playing' && (
        <div className="absolute inset-0 z-40">
          <GameUI />
        </div>
      )}
      
      {gameState === 'paused' && (
        <div className="absolute inset-0 z-50">
          <PauseMenu />
        </div>
      )}
      
      {gameState === 'upgrading' && showUpgradeSelection && (
        <div className="absolute inset-0 z-50">
          <UpgradeSelection />
        </div>
      )}
      
      {gameState === 'levelComplete' && (
        <div className="absolute inset-0 z-50">
          <LevelComplete />
        </div>
      )}
      
      {gameState === 'gameOver' && (
        <div className="absolute inset-0 z-50">
          <GameOverScreen />
        </div>
      )}
      
      {gameState === 'victory' && (
        <div className="absolute inset-0 z-50">
          <VictoryScreen />
        </div>
      )}
      
      {gameState === 'leaderboard' && (
        <div className="absolute inset-0 z-50">
          <Leaderboard />
        </div>
      )}
      
      {isTransitioning && (
        <div className="absolute inset-0 z-50">
          <LevelTransition />
        </div>
      )}
    </div>
  );
};