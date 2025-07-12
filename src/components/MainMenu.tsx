import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { animated, useSpring } from '@react-spring/web';
import { motion } from 'framer-motion';
import { Play, Settings, Trophy, Info, Volume2, VolumeX, Star, Zap, Shield } from 'lucide-react';

export const MainMenu: React.FC = () => {
  const { startGame, highScore } = useGameStore();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.7);
  const [sfxVolume, setSfxVolume] = useState(0.8);

  const containerSpring = useSpring({
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
    config: { tension: 300, friction: 30 }
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Space Background */}
      <div className="absolute inset-0">
        {/* Stars */}
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Nebula Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/3 to-transparent" />
      </div>

      {/* Main Frame */}
      <div className="relative z-10 min-h-screen p-2 sm:p-4 lg:p-8">
        <div className="h-full border border-cyan-400/30 rounded-lg sm:rounded-xl lg:rounded-2xl bg-black/10 backdrop-blur-sm">
          
          {/* Content Container */}
          <animated.div style={containerSpring} className="h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            
            {/* Title Section */}
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <motion.h1
                animate={{ 
                  textShadow: [
                    '0 0 10px #00ffff',
                    '0 0 20px #00ffff',
                    '0 0 10px #00ffff'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-3xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
              >
                SPACE INVADERS
              </motion.h1>
              
              <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-2 sm:mb-4 tracking-wider">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  GALACTIC WARFARE
                </span>
              </div>
              
              <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 mb-4 sm:mb-6 lg:mb-8 font-light max-w-xs sm:max-w-md lg:max-w-2xl mx-auto">
                Defiende la galaxia a través de 20 niveles épicos. Evoluciona tu armamento y enfrenta jefes poderosos.
              </p>

              {/* Game Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6 lg:mb-8 max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto">
                <div className="bg-black/40 rounded-lg sm:rounded-xl p-2 sm:p-4 border border-cyan-400/30">
                  <Star className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-yellow-400 mx-auto mb-1 sm:mb-2" />
                  <h3 className="text-white font-bold mb-1 text-xs sm:text-sm lg:text-base">20 Niveles</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Con jefes finales épicos</p>
                </div>
                <div className="bg-black/40 rounded-lg sm:rounded-xl p-2 sm:p-4 border border-purple-400/30">
                  <Zap className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-purple-400 mx-auto mb-1 sm:mb-2" />
                  <h3 className="text-white font-bold mb-1 text-xs sm:text-sm lg:text-base">10 Armas</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Evolución progresiva</p>
                </div>
                <div className="bg-black/40 rounded-lg sm:rounded-xl p-2 sm:p-4 border border-green-400/30">
                  <Trophy className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-green-400 mx-auto mb-1 sm:mb-2" />
                  <h3 className="text-white font-bold mb-1 text-xs sm:text-sm lg:text-base">Sistema de Estrellas</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Perfecciona tu técnica</p>
                </div>
              </div>
            </div>

            {/* Menu Buttons */}
            <div className="space-y-3 sm:space-y-4 w-full max-w-xs sm:max-w-sm lg:max-w-md">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startGame}
                className="w-full flex items-center justify-center space-x-2 sm:space-x-4 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg sm:rounded-xl text-sm sm:text-lg lg:text-xl font-bold text-white transition-all duration-300 shadow-lg border border-green-400/50"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                <span>INICIAR MISIÓN</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowInstructions(true)}
                className="w-full flex items-center justify-center space-x-2 sm:space-x-4 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg sm:rounded-xl text-sm sm:text-lg lg:text-xl font-bold text-white transition-all duration-300 shadow-lg border border-blue-400/50"
              >
                <Info className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                <span>INSTRUCCIONES</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSettings(true)}
                className="w-full flex items-center justify-center space-x-2 sm:space-x-4 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 rounded-lg sm:rounded-xl text-sm sm:text-lg lg:text-xl font-bold text-white transition-all duration-300 shadow-lg border border-purple-400/50"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                <span>CONFIGURACIÓN</span>
              </motion.button>
            </div>

            {/* High Score */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-4 sm:mt-6 lg:mt-8 p-3 sm:p-4 lg:p-6 bg-black/60 rounded-lg sm:rounded-xl lg:rounded-2xl border border-cyan-500/30 backdrop-blur-lg"
            >
              <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-400" />
                <span className="text-cyan-400 font-bold text-sm sm:text-lg lg:text-xl">RÉCORD GALÁCTICO:</span>
                <span className="text-white font-bold text-sm sm:text-lg lg:text-2xl">{highScore.toLocaleString()}</span>
              </div>
            </motion.div>
          </animated.div>
        </div>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-xs sm:max-w-2xl lg:max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900/95 to-black/95 rounded-lg sm:rounded-xl lg:rounded-3xl border border-cyan-400/50 backdrop-blur-lg p-3 sm:p-6 lg:p-8"
          >
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-center mb-4 sm:mb-6 lg:mb-8 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              MANUAL DE COMBATE GALÁCTICO
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 text-white text-sm sm:text-base">
              {/* Controls */}
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-cyan-400 mb-2 sm:mb-4 flex items-center">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2" />
                  Controles
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-12 sm:w-16 lg:w-20 h-6 sm:h-8 lg:h-10 bg-gray-700 rounded flex items-center justify-center text-xs sm:text-sm font-bold">WASD</div>
                    <span className="text-sm sm:text-base lg:text-lg">Movimiento de la nave</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-12 sm:w-16 lg:w-20 h-6 sm:h-8 lg:h-10 bg-gray-700 rounded flex items-center justify-center text-xs sm:text-sm font-bold">SPACE</div>
                    <span className="text-sm sm:text-base lg:text-lg">Disparar</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-12 sm:w-16 lg:w-20 h-6 sm:h-8 lg:h-10 bg-gray-700 rounded flex items-center justify-center text-xs sm:text-sm font-bold">P/ESC</div>
                    <span className="text-sm sm:text-base lg:text-lg">Pausa</span>
                  </div>
                </div>
              </div>

              {/* Objective */}
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400 mb-2 sm:mb-4 flex items-center">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2" />
                  Objetivo
                </h3>
                <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base lg:text-lg">
                  <li>• Completa 20 niveles épicos</li>
                  <li>• Derrota oleadas de aliens</li>
                  <li>• Enfrenta jefes finales poderosos</li>
                  <li>• Evoluciona tu armamento</li>
                  <li>• Obtén 3 estrellas por nivel</li>
                </ul>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowInstructions(false)}
              className="mt-4 sm:mt-6 lg:mt-8 w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg sm:rounded-xl text-sm sm:text-lg lg:text-xl font-bold text-white transition-all duration-300"
            >
              ¡ENTENDIDO, COMANDANTE!
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-xs sm:max-w-lg lg:max-w-2xl bg-gradient-to-br from-gray-900/95 to-black/95 rounded-lg sm:rounded-xl lg:rounded-3xl border border-purple-500/50 backdrop-blur-lg p-3 sm:p-6 lg:p-8"
          >
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-center mb-4 sm:mb-6 lg:mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              CONFIGURACIÓN
            </h2>
            
            <div className="space-y-4 sm:space-y-6">
              {/* Audio Master */}
              <div className="bg-black/40 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-purple-400/30">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {audioEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-400" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-400" />}
                    <span className="text-white text-sm sm:text-lg lg:text-xl font-semibold">Audio Principal</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className={`px-3 sm:px-4 lg:px-6 py-1 sm:py-2 rounded-lg font-bold transition-all duration-300 text-xs sm:text-sm ${
                      audioEnabled 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  >
                    {audioEnabled ? 'ON' : 'OFF'}
                  </motion.button>
                </div>
              </div>

              {/* Music Volume */}
              <div className="bg-black/40 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-blue-400/30">
                <h3 className="text-white text-sm sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-4">Volumen de Música</h3>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <span className="text-gray-400 text-xs sm:text-sm">0%</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={musicVolume}
                    onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                    className="flex-1 h-1 sm:h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-gray-400 text-xs sm:text-sm">100%</span>
                  <span className="text-white font-bold w-8 sm:w-12 text-xs sm:text-sm">{Math.round(musicVolume * 100)}%</span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSettings(false)}
              className="mt-4 sm:mt-6 lg:mt-8 w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-lg sm:rounded-xl text-sm sm:text-lg lg:text-xl font-bold text-white transition-all duration-300"
            >
              GUARDAR CONFIGURACIÓN
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
};