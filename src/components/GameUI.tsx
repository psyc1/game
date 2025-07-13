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
      {/* Boss Health Bar - SOLO CUANDO HAY JEFE ACTIVO */}
      {bossActive && bossHP > 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 pointer-events-auto z-50">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-4 border border-red-500/50 shadow-2xl">
            <div className="text-center mb-3">
              <span className="text-red-400 font-bold text-lg uppercase tracking-wider">JEFE FINAL</span>
            </div>
            <div className="relative h-4 bg-slate-800/60 rounded-full border border-red-400/30 overflow-hidden">
              <animated.div
                style={bossBarSpring}
                className="h-full rounded-full shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse" />
            </div>
            <div className="text-center mt-2">
              <span className="text-white font-bold text-lg">{bossHP}/{bossMaxHP}</span>
            </div>
          </div>
        </div>
      )}

      {/* Left Panel - Game Stats */}
      <div className="absolute left-4 top-4 bottom-4 w-72 lg:w-80 pointer-events-auto">
        <div className="h-full bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-cyan-400/30 shadow-2xl p-4 lg:p-6 flex flex-col overflow-y-auto">
          
          {/* Level and Score */}
          <div className="text-center mb-6 pb-4 border-b border-cyan-400/30">
            <div className="text-2xl lg:text-4xl font-bold text-cyan-400 mb-2 tracking-wider">
              NIVEL {nivelActual}
            </div>
            <animated.div className="text-lg lg:text-2xl font-bold text-yellow-400">
              {scoreSpring.number.to(n => Math.floor(n).toLocaleString())}
            </animated.div>
            <div className="text-sm text-gray-300 uppercase tracking-wider">Puntos</div>
          </div>

          {/* Health */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-bold uppercase tracking-wide text-sm">Vida</span>
              </div>
              <span className="text-white font-bold text-sm">{vidaJugador}/{vidaMaxima}</span>
            </div>
            <div className="relative h-3 bg-slate-800/50 rounded-full border border-red-400/30 overflow-hidden">
              <animated.div
                style={healthBarSpring}
                className="h-full rounded-full shadow-lg"
              />
            </div>
          </div>

          {/* Shield */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-bold uppercase tracking-wide text-sm">Escudo</span>
              </div>
              <span className="text-white font-bold text-sm">{Math.floor(escudoActual)}/{escudoMaximo}</span>
            </div>
            <div className="relative h-3 bg-slate-800/50 rounded-full border border-blue-400/30 overflow-hidden">
              <animated.div
                style={shieldBarSpring}
                className="h-full rounded-full shadow-lg"
              />
            </div>
          </div>

          {/* Level Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-400 font-bold uppercase tracking-wide text-sm">Progreso</span>
              <span className="text-white font-bold text-sm">{enemigosDestruidos}/{enemigosRequeridos}</span>
            </div>
            <div className="relative h-3 bg-slate-800/50 rounded-full border border-purple-400/30 overflow-hidden">
              <animated.div
                style={progressBarSpring}
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full shadow-lg"
              />
            </div>
            <div className="text-center mt-2 text-gray-300 font-semibold text-sm">
              Restantes: {enemigosRequeridos - enemigosDestruidos}
            </div>
          </div>

          {/* Current Weapon */}
          <div className="mb-6">
            <div className="text-center mb-2">
              <span className="text-yellow-400 font-bold uppercase tracking-wide text-sm">Arma Actual</span>
            </div>
            <div 
              className="p-4 bg-slate-800/60 rounded-2xl border-2 backdrop-blur-sm"
              style={{ borderColor: getWeaponColor(nivelArma) + '60' }}
            >
              <div className="text-center">
                <div 
                  className="text-lg font-bold uppercase tracking-wider mb-2"
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
                        className={`w-2 h-2 rounded-full ${
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
            <div className="text-white font-bold mb-3 text-center text-sm">CONTROLES</div>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center justify-between">
                <span>Mover</span>
                <div className="px-2 py-1 bg-slate-700/60 rounded-lg text-xs font-bold border border-cyan-400/30">WASD</div>
              </div>
              <div className="flex items-center justify-between">
                <span>Disparar</span>
                <div className="px-2 py-1 bg-slate-700/60 rounded-lg text-xs font-bold border border-cyan-400/30">SPACE</div>
              </div>
              <div className="flex items-center justify-between">
                <span>Pausa</span>
                <div className="px-2 py-1 bg-slate-700/60 rounded-lg text-xs font-bold border border-cyan-400/30">P/ESC</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Controls and Info */}
      <div className="absolute right-4 top-4 bottom-4 w-72 lg:w-80 pointer-events-auto">
        <div className="h-full bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-cyan-400/30 shadow-2xl p-4 lg:p-6 flex flex-col overflow-y-auto">
          
          {/* Game Controls */}
          <div className="mb-6">
            <h3 className="text-white font-bold mb-4 text-center text-sm uppercase tracking-wide">Controles del Juego</h3>
            <div className="space-y-3">
              <button
                onClick={pauseGame}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-2xl transition-all duration-300 border border-purple-400/50 shadow-2xl hover:shadow-purple-500/25 backdrop-blur-xl"
              >
                <Pause className="w-4 h-4" />
                <span className="font-bold text-sm">PAUSAR</span>
              </button>
              
              <button 
                onClick={resetGame}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-2xl transition-all duration-300 border border-red-400/50 shadow-2xl hover:shadow-red-500/25 backdrop-blur-xl"
              >
                <Home className="w-4 h-4" />
                <span className="font-bold text-sm">MENÚ</span>
              </button>
            </div>
          </div>

          {/* Alien Types Legend */}
          <div className="mb-6">
            <h3 className="text-white font-bold mb-4 text-center text-sm uppercase tracking-wide">Tipos de Aliens</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-2 bg-slate-800/30 rounded-xl">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-300 text-sm flex-1">Scout</span>
                <span className="text-gray-400 text-sm">1 HP</span>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-slate-800/30 rounded-xl">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-300 text-sm flex-1">Warrior</span>
                <span className="text-gray-400 text-sm">1 HP</span>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-slate-800/30 rounded-xl">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-300 text-sm flex-1">Hunter</span>
                <span className="text-gray-400 text-sm">1 HP</span>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-slate-800/30 rounded-xl">
                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                <span className="text-gray-300 text-sm flex-1">Guardian</span>
                <span className="text-gray-400 text-sm">2 HP</span>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-slate-800/30 rounded-xl">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <span className="text-gray-300 text-sm flex-1">Commander</span>
                <span className="text-gray-400 text-sm">3 HP</span>
              </div>
            </div>
          </div>

          {/* Power-ups Legend */}
          <div className="mt-auto">
            <h3 className="text-white font-bold mb-4 text-center text-sm uppercase tracking-wide">Power-ups</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-2 bg-slate-800/30 rounded-xl">
                <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"></div>
                <span className="text-gray-300 text-sm">Evolución de Arma</span>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-slate-800/30 rounded-xl">
                <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></div>
                <span className="text-gray-300 text-sm">Restaurar Vida (+25)</span>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-slate-800/30 rounded-xl">
                <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                <span className="text-gray-300 text-sm">Restaurar Escudo (+30)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};