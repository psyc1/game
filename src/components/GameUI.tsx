import React from 'react';
import { useGameStore } from '../store/gameStore';
import { animated, useSpring } from '@react-spring/web';
import { Heart, Shield, Zap, Pause, Home, Star, Target } from 'lucide-react';

export const GameUI: React.FC = () => {
  const {
    nivelActual,
    puntuacion,
    vidaJugador,
    vidaMaxima,
    escudoActual,
    escudoMaximo,
    nivelArma,
    enemigosDestruidos,
    enemigosRequeridos,
    pauseGame,
    resetGame,
    bossHP,
    bossMaxHP,
    showBoss,
    bossActive
  } = useGameStore();

  const healthPercentage = (vidaJugador / vidaMaxima) * 100;
  const shieldPercentage = (escudoActual / escudoMaximo) * 100;
  const progressPercentage = (enemigosDestruidos / enemigosRequeridos) * 100;
  const bossHPPercentage = bossMaxHP > 0 ? (bossHP / bossMaxHP) * 100 : 0;

  const healthBarSpring = useSpring({
    width: `${healthPercentage}%`,
    backgroundColor: healthPercentage > 60 ? '#10b981' : healthPercentage > 30 ? '#f59e0b' : '#ef4444'
  });

  const shieldBarSpring = useSpring({
    width: `${shieldPercentage}%`,
    backgroundColor: shieldPercentage > 60 ? '#3b82f6' : shieldPercentage > 30 ? '#8b5cf6' : '#ef4444'
  });

  const progressBarSpring = useSpring({
    width: `${progressPercentage}%`
  });

  const bossBarSpring = useSpring({
    width: `${bossHPPercentage}%`,
    backgroundColor: bossHPPercentage > 60 ? '#ef4444' : bossHPPercentage > 30 ? '#f59e0b' : '#dc2626'
  });

  const scoreSpring = useSpring({
    number: puntuacion,
    from: { number: 0 }
  });

  const getWeaponName = (level: number) => {
    const names = [
      'Básico', 'Doble', 'Triple', 'Abanico', 'Abanico+M1',
      'Abanico+M2', 'Abanico+M3', 'Abanico+2M', 'Abanico+3M', 'Arsenal'
    ];
    return names[level] || 'Desconocido';
  };

  const getWeaponColor = (level: number) => {
    const colors = [
      '#00ffff', '#00ff88', '#88ff00', '#ffaa00', '#ff8800',
      '#ff4400', '#ff0088', '#8800ff', '#4400ff', '#0088ff'
    ];
    return colors[level] || '#ffffff';
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Boss Health Bar (Top) - SOLO CUANDO HAY JEFE ACTIVO */}
      {bossActive && bossHP > 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 pointer-events-auto z-50">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-xl p-3 border border-red-500/50 shadow-2xl">
            <div className="text-center mb-2">
              <span className="text-red-400 font-bold text-sm uppercase tracking-wider">JEFE FINAL</span>
            </div>
            <div className="relative h-3 bg-slate-800/60 rounded-full border border-red-400/30 overflow-hidden">
              <animated.div
                style={bossBarSpring}
                className="h-full rounded-full shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse" />
            </div>
            <div className="text-center mt-1">
              <span className="text-white font-bold text-sm">{bossHP}/{bossMaxHP}</span>
            </div>
          </div>
        </div>
      )}

      {/* Left Panel - Game Stats */}
      <div className="absolute left-2 top-2 bottom-2 w-48 lg:w-72 pointer-events-auto">
        <div className="h-full bg-slate-900/95 backdrop-blur-xl rounded-xl border border-cyan-400/30 shadow-2xl p-3 lg:p-4 flex flex-col overflow-y-auto">
          
          {/* Level and Score */}
          <div className="text-center mb-4 pb-3 border-b border-cyan-400/30">
            <div className="text-xl lg:text-3xl font-bold text-cyan-400 mb-1 tracking-wider">
              NIVEL {nivelActual}
            </div>
            <animated.div className="text-sm lg:text-xl font-bold text-yellow-400">
              {scoreSpring.number.to(n => Math.floor(n).toLocaleString())}
            </animated.div>
            <div className="text-xs text-gray-300 uppercase tracking-wider">Puntos</div>
          </div>

          {/* Health */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3 lg:w-4 lg:h-4 text-red-400" />
                <span className="text-red-400 font-bold uppercase tracking-wide text-xs">Vida</span>
              </div>
              <span className="text-white font-bold text-xs">{vidaJugador}/{vidaMaxima}</span>
            </div>
            <div className="relative h-2 lg:h-3 bg-slate-800/50 rounded-full border border-red-400/30 overflow-hidden">
              <animated.div
                style={healthBarSpring}
                className="h-full rounded-full shadow-lg"
              />
            </div>
          </div>

          {/* Shield */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3 lg:w-4 lg:h-4 text-blue-400" />
                <span className="text-blue-400 font-bold uppercase tracking-wide text-xs">Escudo</span>
              </div>
              <span className="text-white font-bold text-xs">{Math.floor(escudoActual)}/{escudoMaximo}</span>
            </div>
            <div className="relative h-2 lg:h-3 bg-slate-800/50 rounded-full border border-blue-400/30 overflow-hidden">
              <animated.div
                style={shieldBarSpring}
                className="h-full rounded-full shadow-lg"
              />
            </div>
          </div>

          {/* Level Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-purple-400 font-bold uppercase tracking-wide text-xs">Progreso</span>
              <span className="text-white font-bold text-xs">{enemigosDestruidos}/{enemigosRequeridos}</span>
            </div>
            <div className="relative h-2 lg:h-3 bg-slate-800/50 rounded-full border border-purple-400/30 overflow-hidden">
              <animated.div
                style={progressBarSpring}
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full shadow-lg"
              />
            </div>
            <div className="text-center mt-1 text-gray-300 font-semibold text-xs">
              Restantes: {enemigosRequeridos - enemigosDestruidos}
            </div>
          </div>

          {/* Current Weapon */}
          <div className="mb-4">
            <div className="text-center mb-1">
              <span className="text-yellow-400 font-bold uppercase tracking-wide text-xs">Arma Actual</span>
            </div>
            <div 
              className="p-2 lg:p-4 bg-slate-800/60 rounded-xl border-2 backdrop-blur-sm"
              style={{ borderColor: getWeaponColor(nivelArma) + '60' }}
            >
              <div className="text-center">
                <div 
                  className="text-sm lg:text-lg font-bold uppercase tracking-wider mb-1"
                  style={{ color: getWeaponColor(nivelArma) }}
                >
                  {getWeaponName(nivelArma)}
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-xs text-gray-400">Nivel:</span>
                  <div className="flex space-x-1">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-1 lg:w-2 lg:h-2 rounded-full ${
                          i <= nivelArma 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                            : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-auto">
            <div className="text-white font-bold mb-2 text-center text-xs">CONTROLES</div>
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex items-center justify-between">
                <span>Mover</span>
                <div className="px-1 py-0.5 bg-gray-700 rounded text-xs font-bold">WASD</div>
              </div>
              <div className="flex items-center justify-between">
                <span>Disparar</span>
                <div className="px-1 py-0.5 bg-gray-700 rounded text-xs font-bold">SPACE</div>
              </div>
              <div className="flex items-center justify-between">
                <span>Pausa</span>
                <div className="px-1 py-0.5 bg-gray-700 rounded text-xs font-bold">P/ESC</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Controls and Info */}
      <div className="absolute right-2 top-2 bottom-2 w-48 lg:w-72 pointer-events-auto">
        <div className="h-full bg-slate-900/95 backdrop-blur-xl rounded-xl border border-cyan-400/30 shadow-2xl p-3 lg:p-4 flex flex-col overflow-y-auto">
          
          {/* Game Controls */}
          <div className="mb-4">
            <h3 className="text-white font-bold mb-3 text-center text-xs uppercase tracking-wide">Controles del Juego</h3>
            <div className="space-y-2">
              <button
                onClick={pauseGame}
                className="w-full flex items-center justify-center space-x-1 px-2 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-lg transition-all duration-300 border border-purple-400/50 shadow-lg hover:shadow-purple-500/25"
              >
                <Pause className="w-3 h-3" />
                <span className="font-bold text-xs">PAUSAR</span>
              </button>
              
              <button 
                onClick={resetGame}
                className="w-full flex items-center justify-center space-x-1 px-2 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-lg transition-all duration-300 border border-red-400/50 shadow-lg hover:shadow-red-500/25"
              >
                <Home className="w-3 h-3" />
                <span className="font-bold text-xs">MENÚ</span>
              </button>
            </div>
          </div>

          {/* Alien Types Legend */}
          <div className="mb-4">
            <h3 className="text-white font-bold mb-3 text-center text-xs uppercase tracking-wide">Tipos de Aliens</h3>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 p-1 bg-slate-800/30 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-300 text-xs flex-1">Scout</span>
                <span className="text-gray-400 text-xs">1 HP</span>
              </div>
              <div className="flex items-center space-x-2 p-1 bg-slate-800/30 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-300 text-xs flex-1">Warrior</span>
                <span className="text-gray-400 text-xs">1 HP</span>
              </div>
              <div className="flex items-center space-x-2 p-1 bg-slate-800/30 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-300 text-xs flex-1">Hunter</span>
                <span className="text-gray-400 text-xs">1 HP</span>
              </div>
              <div className="flex items-center space-x-2 p-1 bg-slate-800/30 rounded-lg">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                <span className="text-gray-300 text-xs flex-1">Guardian</span>
                <span className="text-gray-400 text-xs">2 HP</span>
              </div>
              <div className="flex items-center space-x-2 p-1 bg-slate-800/30 rounded-lg">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span className="text-gray-300 text-xs flex-1">Commander</span>
                <span className="text-gray-400 text-xs">3 HP</span>
              </div>
            </div>
          </div>

          {/* Power-ups Legend */}
          <div className="mt-auto">
            <h3 className="text-white font-bold mb-3 text-center text-xs uppercase tracking-wide">Power-ups</h3>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 p-1 bg-slate-800/30 rounded-lg">
                <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"></div>
                <span className="text-gray-300 text-xs">Evolución de Arma</span>
              </div>
              <div className="flex items-center space-x-2 p-1 bg-slate-800/30 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></div>
                <span className="text-gray-300 text-xs">Restaurar Vida (+25)</span>
              </div>
              <div className="flex items-center space-x-2 p-1 bg-slate-800/30 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                <span className="text-gray-300 text-xs">Restaurar Escudo (+30)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};