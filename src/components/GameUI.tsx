import React from 'react';
import { useGameStore } from '../store/gameStore';
import { animated, useSpring } from '@react-spring/web';
import { Heart, Shield, Zap, Pause, Home, Star } from 'lucide-react';

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
    showBoss
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
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Boss Health Bar (Top) */}
      {showBoss && (
        <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 w-full max-w-xs sm:max-w-md lg:max-w-lg px-2 sm:px-4 pointer-events-auto">
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-lg sm:rounded-xl lg:rounded-2xl p-2 sm:p-3 lg:p-4 border border-red-500/30 shadow-2xl">
            <div className="text-center mb-1 sm:mb-2 lg:mb-3">
              <span className="text-red-400 font-bold text-xs sm:text-sm lg:text-lg xl:text-xl uppercase tracking-wider">JEFE FINAL</span>
            </div>
            <div className="relative h-2 sm:h-3 lg:h-4 bg-slate-800/60 rounded-full border border-red-400/30 overflow-hidden">
              <animated.div
                style={bossBarSpring}
                className="h-full rounded-full shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse" />
            </div>
            <div className="text-center mt-1 sm:mt-2">
              <span className="text-white font-bold text-xs sm:text-sm lg:text-base">{bossHP}/{bossMaxHP}</span>
            </div>
          </div>
        </div>
      )}

      {/* Left Panel - Game Stats */}
      <div className="absolute left-1 sm:left-2 lg:left-4 top-1 sm:top-2 lg:top-4 bottom-1 sm:bottom-2 lg:bottom-4 w-48 sm:w-56 lg:w-72 xl:w-80 pointer-events-auto">
        <div className="h-full bg-slate-900/95 backdrop-blur-xl rounded-lg sm:rounded-xl lg:rounded-2xl border border-cyan-400/30 shadow-2xl p-2 sm:p-3 lg:p-4 xl:p-6 flex flex-col overflow-y-auto">
          
          {/* Level and Score */}
          <div className="text-center mb-3 sm:mb-4 lg:mb-6 pb-2 sm:pb-3 lg:pb-4 border-b border-cyan-400/30">
            <div className="text-lg sm:text-2xl lg:text-3xl xl:text-5xl font-bold text-cyan-400 mb-1 lg:mb-2 tracking-wider">
              NIVEL {nivelActual}
            </div>
            <animated.div className="text-sm sm:text-lg lg:text-xl xl:text-3xl font-bold text-yellow-400">
              {scoreSpring.number.to(n => Math.floor(n).toLocaleString())}
            </animated.div>
            <div className="text-xs lg:text-sm text-gray-300 uppercase tracking-wider">Puntos</div>
          </div>

          {/* Health */}
          <div className="mb-3 sm:mb-4 lg:mb-6">
            <div className="flex items-center justify-between mb-1 sm:mb-2 lg:mb-3">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-red-400" />
                <span className="text-red-400 font-bold uppercase tracking-wide text-xs lg:text-sm">Vida</span>
              </div>
              <span className="text-white font-bold text-xs lg:text-sm">{vidaJugador}/{vidaMaxima}</span>
            </div>
            <div className="relative h-2 sm:h-3 lg:h-4 bg-slate-800/50 rounded-full border border-red-400/30 overflow-hidden">
              <animated.div
                style={healthBarSpring}
                className="h-full rounded-full shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full" />
            </div>
          </div>

          {/* Shield */}
          <div className="mb-3 sm:mb-4 lg:mb-6">
            <div className="flex items-center justify-between mb-1 sm:mb-2 lg:mb-3">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-400" />
                <span className="text-blue-400 font-bold uppercase tracking-wide text-xs lg:text-sm">Escudo</span>
              </div>
              <span className="text-white font-bold text-xs lg:text-sm">{Math.floor(escudoActual)}/{escudoMaximo}</span>
            </div>
            <div className="relative h-2 sm:h-3 lg:h-4 bg-slate-800/50 rounded-full border border-blue-400/30 overflow-hidden">
              <animated.div
                style={shieldBarSpring}
                className="h-full rounded-full shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full" />
            </div>
          </div>

          {/* Level Progress */}
          <div className="mb-3 sm:mb-4 lg:mb-6">
            <div className="flex items-center justify-between mb-1 sm:mb-2 lg:mb-3">
              <span className="text-purple-400 font-bold uppercase tracking-wide text-xs lg:text-sm">Progreso</span>
              <span className="text-white font-bold text-xs lg:text-sm">{enemigosDestruidos}/{enemigosRequeridos}</span>
            </div>
            <div className="relative h-2 sm:h-3 lg:h-4 bg-slate-800/50 rounded-full border border-purple-400/30 overflow-hidden">
              <animated.div
                style={progressBarSpring}
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse" />
            </div>
            <div className="text-center mt-1 sm:mt-2 text-gray-300 font-semibold text-xs lg:text-sm">
              Restantes: {enemigosRequeridos - enemigosDestruidos}
            </div>
          </div>

          {/* Current Weapon */}
          <div className="mb-3 sm:mb-4 lg:mb-6">
            <div className="text-center mb-1 sm:mb-2 lg:mb-3">
              <span className="text-yellow-400 font-bold uppercase tracking-wide text-xs lg:text-sm">Arma Actual</span>
            </div>
            <div 
              className="p-2 sm:p-3 lg:p-4 bg-slate-800/60 rounded-lg sm:rounded-xl border-2 backdrop-blur-sm"
              style={{ borderColor: getWeaponColor(nivelArma) + '60' }}
            >
              <div className="text-center">
                <div 
                  className="text-xs sm:text-sm lg:text-lg font-bold uppercase tracking-wider mb-1 sm:mb-2"
                  style={{ color: getWeaponColor(nivelArma) }}
                >
                  {getWeaponName(nivelArma)}
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-xs text-gray-400">Nivel:</span>
                  <div className="flex space-x-0.5 sm:space-x-1">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 rounded-full ${
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
            <div className="text-white font-bold mb-1 sm:mb-2 lg:mb-3 text-center text-xs lg:text-sm">CONTROLES</div>
            <div className="space-y-1 lg:space-y-2 text-xs text-gray-300">
              <div className="flex items-center justify-between">
                <span>Mover</span>
                <div className="px-1 sm:px-2 py-0.5 sm:py-1 bg-gray-700 rounded text-xs font-bold">WASD</div>
              </div>
              <div className="flex items-center justify-between">
                <span>Disparar</span>
                <div className="px-1 sm:px-2 py-0.5 sm:py-1 bg-gray-700 rounded text-xs font-bold">SPACE</div>
              </div>
              <div className="flex items-center justify-between">
                <span>Pausa</span>
                <div className="px-1 sm:px-2 py-0.5 sm:py-1 bg-gray-700 rounded text-xs font-bold">P/ESC</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Controls and Info */}
      <div className="absolute right-1 sm:right-2 lg:right-4 top-1 sm:top-2 lg:top-4 bottom-1 sm:bottom-2 lg:bottom-4 w-48 sm:w-56 lg:w-72 xl:w-80 pointer-events-auto">
        <div className="h-full bg-slate-900/95 backdrop-blur-xl rounded-lg sm:rounded-xl lg:rounded-2xl border border-cyan-400/30 shadow-2xl p-2 sm:p-3 lg:p-4 xl:p-6 flex flex-col overflow-y-auto">
          
          {/* Game Controls */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h3 className="text-white font-bold mb-2 sm:mb-3 lg:mb-4 text-center text-xs lg:text-sm uppercase tracking-wide">Controles del Juego</h3>
            <div className="space-y-2 lg:space-y-3">
              <button
                onClick={pauseGame}
                className="w-full flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-2 lg:py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-lg sm:rounded-xl transition-all duration-300 border border-purple-400/50 shadow-lg hover:shadow-purple-500/25"
              >
                <Pause className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                <span className="font-bold text-xs lg:text-sm">PAUSAR</span>
              </button>
              
              <button 
                onClick={resetGame}
                className="w-full flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-2 lg:py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-lg sm:rounded-xl transition-all duration-300 border border-red-400/50 shadow-lg hover:shadow-red-500/25"
              >
                <Home className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                <span className="font-bold text-xs lg:text-sm">MENÚ</span>
              </button>
            </div>
          </div>

          {/* Alien Types Legend */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h3 className="text-white font-bold mb-2 sm:mb-3 lg:mb-4 text-center text-xs lg:text-sm uppercase tracking-wide">Tipos de Aliens</h3>
            <div className="space-y-1 lg:space-y-2">
              <div className="flex items-center space-x-2 sm:space-x-3 p-1 sm:p-2 bg-slate-800/30 rounded-lg">
                <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-red-500 rounded-full"></div>
                <span className="text-gray-300 text-xs flex-1">Scout</span>
                <span className="text-gray-400 text-xs">1 HP</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 p-1 sm:p-2 bg-slate-800/30 rounded-lg">
                <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-purple-500 rounded-full"></div>
                <span className="text-gray-300 text-xs flex-1">Warrior</span>
                <span className="text-gray-400 text-xs">1 HP</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 p-1 sm:p-2 bg-slate-800/30 rounded-lg">
                <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-orange-500 rounded-full"></div>
                <span className="text-gray-300 text-xs flex-1">Hunter</span>
                <span className="text-gray-400 text-xs">1 HP</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 p-1 sm:p-2 bg-slate-800/30 rounded-lg">
                <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-cyan-500 rounded-full"></div>
                <span className="text-gray-300 text-xs flex-1">Guardian</span>
                <span className="text-gray-400 text-xs">2 HP</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 p-1 sm:p-2 bg-slate-800/30 rounded-lg">
                <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-pink-500 rounded-full"></div>
                <span className="text-gray-300 text-xs flex-1">Commander</span>
                <span className="text-gray-400 text-xs">3 HP</span>
              </div>
            </div>
          </div>

          {/* Power-ups Legend */}
          <div className="mt-auto">
            <h3 className="text-white font-bold mb-2 sm:mb-3 lg:mb-4 text-center text-xs lg:text-sm uppercase tracking-wide">Power-ups</h3>
            <div className="space-y-1 lg:space-y-2">
              <div className="flex items-center space-x-2 sm:space-x-3 p-1 sm:p-2 bg-slate-800/30 rounded-lg">
                <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"></div>
                <span className="text-gray-300 text-xs">Evolución de Arma</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 p-1 sm:p-2 bg-slate-800/30 rounded-lg">
                <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></div>
                <span className="text-gray-300 text-xs">Restaurar Vida (+25)</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 p-1 sm:p-2 bg-slate-800/30 rounded-lg">
                <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                <span className="text-gray-300 text-xs">Restaurar Escudo (+30)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};