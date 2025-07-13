import React from 'react';
import { useGameStore } from '../store/gameStore';
import { animated, useSpring } from '@react-spring/web';
import { Heart, Shield, Pause, Home } from 'lucide-react';

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
    bossActive,
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
      'BÁSICO', 'DOBLE', 'TRIPLE', 'ABANICO', 'ABANICO+M1',
      'ABANICO+M2', 'ABANICO+M3', 'ABANICO+2M', 'ABANICO+3M', 'ARSENAL'
    ];
    return names[level] || 'DESCONOCIDO';
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
      {/* DESKTOP/TABLET: Grid Layout */}
      <div className="hidden md:block w-full h-full">
        <div className="w-full h-full grid grid-cols-12 gap-0">
          
          {/* Left Panel - Desktop/Tablet */}
          <div className="col-span-3 bg-slate-900/95 backdrop-blur-xl border-r border-cyan-400/30 pointer-events-auto">
            <div className="h-full p-4 flex flex-col overflow-y-auto">
              
              {/* Level and Score */}
              <div className="text-center mb-6 pb-4 border-b border-cyan-400/30">
                <div className="text-2xl lg:text-3xl font-bold text-cyan-400 mb-2 tracking-wider">
                  NIVEL {nivelActual}
                </div>
                <animated.div className="text-lg lg:text-xl font-bold text-yellow-400">
                  {scoreSpring.number.to(n => Math.floor(n).toLocaleString())}
                </animated.div>
                <div className="text-xs lg:text-sm text-gray-300 uppercase tracking-wider">Puntos</div>
              </div>

              {/* Health */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 lg:w-5 lg:h-5 text-red-400" />
                    <span className="text-red-400 font-bold uppercase tracking-wide text-sm lg:text-base">Vida</span>
                  </div>
                  <span className="text-white font-bold text-sm lg:text-base">{vidaJugador}/{vidaMaxima}</span>
                </div>
                <div className="relative h-3 lg:h-4 bg-slate-800/50 rounded-full border border-red-400/30 overflow-hidden">
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
                    <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
                    <span className="text-blue-400 font-bold uppercase tracking-wide text-sm lg:text-base">Escudo</span>
                  </div>
                  <span className="text-white font-bold text-sm lg:text-base">{Math.floor(escudoActual)}/{escudoMaximo}</span>
                </div>
                <div className="relative h-3 lg:h-4 bg-slate-800/50 rounded-full border border-blue-400/30 overflow-hidden">
                  <animated.div
                    style={shieldBarSpring}
                    className="h-full rounded-full shadow-lg"
                  />
                </div>
              </div>

              {/* Level Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-400 font-bold uppercase tracking-wide text-sm lg:text-base">Progreso</span>
                  <span className="text-white font-bold text-sm lg:text-base">{enemigosDestruidos}/{enemigosRequeridos}</span>
                </div>
                <div className="relative h-3 lg:h-4 bg-slate-800/50 rounded-full border border-purple-400/30 overflow-hidden">
                  <animated.div
                    style={progressBarSpring}
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full shadow-lg"
                  />
                </div>
                <div className="text-center mt-2 text-gray-300 font-semibold text-xs lg:text-sm">
                  Restantes: {Math.max(0, enemigosRequeridos - enemigosDestruidos)}
                </div>
              </div>

              {/* Current Weapon */}
              <div className="mb-6">
                <div className="text-center mb-2">
                  <span className="text-yellow-400 font-bold uppercase tracking-wide text-sm lg:text-base">Arma Actual</span>
                </div>
                <div 
                  className="p-3 lg:p-4 bg-slate-800/60 rounded-xl border-2 backdrop-blur-sm"
                  style={{ borderColor: getWeaponColor(nivelArma) + '60' }}
                >
                  <div className="text-center">
                    <div 
                      className="text-base lg:text-lg font-bold uppercase tracking-wider mb-2"
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
                            className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${
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
                <div className="text-white font-bold mb-3 text-center text-sm lg:text-base">CONTROLES</div>
                <div className="space-y-2 text-xs lg:text-sm text-gray-300">
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

          {/* Center Game Area - Desktop/Tablet */}
          <div className="col-span-6 relative">
            {/* Boss Health Bar */}
            {showBoss && bossActive && bossHP > 0 && (
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
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-white font-bold text-lg">{bossHP}/{bossMaxHP}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Desktop/Tablet */}
          <div className="col-span-3 bg-slate-900/95 backdrop-blur-xl border-l border-cyan-400/30 pointer-events-auto">
            <div className="h-full p-4 flex flex-col overflow-y-auto">
              
              {/* Game Controls */}
              <div className="mb-6">
                <h3 className="text-white font-bold mb-4 text-center uppercase tracking-wide text-sm lg:text-base">Controles del Juego</h3>
                <div className="space-y-3">
                  <button
                    onClick={pauseGame}
                    className="w-full flex items-center justify-center space-x-2 px-3 lg:px-4 py-2 lg:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl transition-all duration-300 border border-purple-400/50 shadow-2xl hover:shadow-purple-500/25 backdrop-blur-xl text-sm lg:text-base"
                  >
                    <Pause className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="font-bold">PAUSAR</span>
                  </button>
                  
                  <button 
                    onClick={resetGame}
                    className="w-full flex items-center justify-center space-x-2 px-3 lg:px-4 py-2 lg:py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-xl transition-all duration-300 border border-red-400/50 shadow-2xl hover:shadow-red-500/25 backdrop-blur-xl text-sm lg:text-base"
                  >
                    <Home className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="font-bold">MENÚ</span>
                  </button>
                </div>
              </div>

              {/* Alien Types Legend */}
              <div className="mb-6">
                <h3 className="text-white font-bold mb-4 text-center uppercase tracking-wide text-sm lg:text-base">Tipos de Aliens</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-2 bg-slate-800/30 rounded-xl">
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-300 text-xs lg:text-sm flex-1">Scout</span>
                    <span className="text-gray-400 text-xs lg:text-sm">1 HP</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-slate-800/30 rounded-xl">
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-300 text-xs lg:text-sm flex-1">Warrior</span>
                    <span className="text-gray-400 text-xs lg:text-sm">1 HP</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-slate-800/30 rounded-xl">
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-300 text-xs lg:text-sm flex-1">Hunter</span>
                    <span className="text-gray-400 text-xs lg:text-sm">1 HP</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-slate-800/30 rounded-xl">
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-cyan-500 rounded-full"></div>
                    <span className="text-gray-300 text-xs lg:text-sm flex-1">Guardian</span>
                    <span className="text-gray-400 text-xs lg:text-sm">2 HP</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-slate-800/30 rounded-xl">
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-pink-500 rounded-full"></div>
                    <span className="text-gray-300 text-xs lg:text-sm flex-1">Commander</span>
                    <span className="text-gray-400 text-xs lg:text-sm">3 HP</span>
                  </div>
                </div>
              </div>

              {/* Power-ups Legend */}
              <div className="mt-auto">
                <h3 className="text-white font-bold mb-4 text-center uppercase tracking-wide text-sm lg:text-base">Power-ups</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-2 bg-slate-800/30 rounded-xl">
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"></div>
                    <span className="text-gray-300 text-xs lg:text-sm">Evolución de Arma</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-slate-800/30 rounded-xl">
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></div>
                    <span className="text-gray-300 text-xs lg:text-sm">Restaurar Vida (+25)</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-slate-800/30 rounded-xl">
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                    <span className="text-gray-300 text-xs lg:text-sm">Restaurar Escudo (+30)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE: Vertical Layout */}
      <div className="md:hidden w-full h-full flex flex-col">
        
        {/* Top Section - Boss Health Bar */}
        {showBoss && bossActive && bossHP > 0 && (
          <div className="bg-slate-900/95 backdrop-blur-xl border-b border-red-500/50 p-3 pointer-events-auto">
            <div className="text-center mb-2">
              <span className="text-red-400 font-bold text-sm uppercase tracking-wider">JEFE FINAL</span>
            </div>
            <div className="relative h-3 bg-slate-800/60 rounded-full border border-red-400/30 overflow-hidden">
              <animated.div
                style={bossBarSpring}
                className="h-full rounded-full shadow-lg"
              />
            </div>
            <div className="text-center mt-1">
              <span className="text-white font-bold text-sm">{bossHP}/{bossMaxHP}</span>
            </div>
          </div>
        )}

        {/* Left Panel Content - Mobile */}
        <div className="bg-slate-900/95 backdrop-blur-xl border-b border-cyan-400/30 p-3 pointer-events-auto">
          
          {/* Level and Score */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-center">
              <div className="text-lg font-bold text-cyan-400 tracking-wider">NIVEL {nivelActual}</div>
              <animated.div className="text-sm font-bold text-yellow-400">
                {scoreSpring.number.to(n => Math.floor(n).toLocaleString())}
              </animated.div>
            </div>
            
            {/* Game Controls - Mobile */}
            <div className="flex space-x-2">
              <button
                onClick={pauseGame}
                className="flex items-center justify-center px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-xs font-bold text-white border border-purple-400/50"
              >
                <Pause className="w-3 h-3 mr-1" />
                PAUSAR
              </button>
              <button 
                onClick={resetGame}
                className="flex items-center justify-center px-3 py-2 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg text-xs font-bold text-white border border-red-400/50"
              >
                <Home className="w-3 h-3 mr-1" />
                MENÚ
              </button>
            </div>
          </div>

          {/* Health and Shield - Mobile */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3 text-red-400" />
                  <span className="text-red-400 font-bold text-xs">VIDA</span>
                </div>
                <span className="text-white font-bold text-xs">{vidaJugador}/{vidaMaxima}</span>
              </div>
              <div className="relative h-2 bg-slate-800/50 rounded-full border border-red-400/30 overflow-hidden">
                <animated.div
                  style={healthBarSpring}
                  className="h-full rounded-full shadow-lg"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3 text-blue-400" />
                  <span className="text-blue-400 font-bold text-xs">ESCUDO</span>
                </div>
                <span className="text-white font-bold text-xs">{Math.floor(escudoActual)}/{escudoMaximo}</span>
              </div>
              <div className="relative h-2 bg-slate-800/50 rounded-full border border-blue-400/30 overflow-hidden">
                <animated.div
                  style={shieldBarSpring}
                  className="h-full rounded-full shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Progress - Mobile */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-purple-400 font-bold text-xs">PROGRESO</span>
              <span className="text-white font-bold text-xs">{enemigosDestruidos}/{enemigosRequeridos}</span>
            </div>
            <div className="relative h-2 bg-slate-800/50 rounded-full border border-purple-400/30 overflow-hidden">
              <animated.div
                style={progressBarSpring}
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full shadow-lg"
              />
            </div>
            <div className="text-center mt-1 text-gray-300 font-semibold text-xs">
              Restantes: {Math.max(0, enemigosRequeridos - enemigosDestruidos)}
            </div>
          </div>

          {/* Current Weapon - Mobile */}
          <div className="mb-3">
            <div className="text-center mb-1">
              <span className="text-yellow-400 font-bold text-xs">ARMA ACTUAL</span>
            </div>
            <div 
              className="p-2 bg-slate-800/60 rounded-lg border backdrop-blur-sm"
              style={{ borderColor: getWeaponColor(nivelArma) + '60' }}
            >
              <div className="text-center">
                <div 
                  className="text-sm font-bold uppercase tracking-wider mb-1"
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
                        className={`w-1 h-1 rounded-full ${
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
        </div>

        {/* Game Area - Mobile (Flexible) */}
        <div className="flex-1 relative">
          {/* Game canvas goes here */}
        </div>

        {/* Right Panel Content - Mobile */}
        <div className="bg-slate-900/95 backdrop-blur-xl border-t border-cyan-400/30 p-3 pointer-events-auto">
          
          {/* Alien Types and Power-ups - Mobile */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Alien Types */}
            <div>
              <h3 className="text-white font-bold mb-2 text-center text-xs">TIPOS DE ALIENS</h3>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 p-1 bg-slate-800/30 rounded">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-300 text-xs flex-1">Scout</span>
                  <span className="text-gray-400 text-xs">1 HP</span>
                </div>
                <div className="flex items-center space-x-2 p-1 bg-slate-800/30 rounded">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-300 text-xs flex-1">Warrior</span>
                  <span className="text-gray-400 text-xs">1 HP</span>
                </div>
                <div className="flex items-center space-x-2 p-1 bg-slate-800/30 rounded">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-300 text-xs flex-1">Hunter</span>
                  <span className="text-gray-400 text-xs">1 HP</span>
                </div>
                <div className="flex items-center space-x-2 p-1 bg-slate-800/30 rounded">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-gray-300 text-xs flex-1">Guardian</span>
                  <span className="text-gray-400 text-xs">2 HP</span>
                </div>
                <div className="flex items-center space-x-2 p-1 bg-slate-800/30 rounded">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-gray-300 text-xs flex-1">Commander</span>
                  <span className="text-gray-400 text-xs">3 HP</span>
                </div>
              </div>
            </div>

            {/* Power-ups */}
            <div>
              <h3 className="text-white font-bold mb-2 text-center text-xs">POWER-UPS</h3>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 p-1 bg-slate-800/30 rounded">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-300 text-xs">Evolución de Arma</span>
                </div>
                <div className="flex items-center space-x-2 p-1 bg-slate-800/30 rounded">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-xs">Restaurar Vida (+25)</span>
                </div>
                <div className="flex items-center space-x-2 p-1 bg-slate-800/30 rounded">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300 text-xs">Restaurar Escudo (+30)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls - Mobile */}
          <div className="mt-3 pt-3 border-t border-cyan-400/30">
            <div className="text-white font-bold mb-2 text-center text-xs">CONTROLES</div>
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-300">
              <div className="text-center">
                <div className="px-2 py-1 bg-slate-700/60 rounded text-xs font-bold border border-cyan-400/30 mb-1">WASD</div>
                <div>Mover</div>
              </div>
              <div className="text-center">
                <div className="px-2 py-1 bg-slate-700/60 rounded text-xs font-bold border border-cyan-400/30 mb-1">SPACE</div>
                <div>Disparar</div>
              </div>
              <div className="text-center">
                <div className="px-2 py-1 bg-slate-700/60 rounded text-xs font-bold border border-cyan-400/30 mb-1">P</div>
                <div>Pausa</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};