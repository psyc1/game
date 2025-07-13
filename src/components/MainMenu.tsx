import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { animated, useSpring } from '@react-spring/web';
import { motion } from 'framer-motion';
import { Play, Settings, Trophy, Info, Volume2, VolumeX, Star, Zap, Shield } from 'lucide-react';

export const MainMenu: React.FC = () => {
  const { startGame, highScore, audioEnabled, setAudioEnabled, musicVolume, setMusicVolume, sfxVolume, setSfxVolume } = useGameStore();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const containerSpring = useSpring({
    from: { opacity: 0, scale: 0.95 },
    to: { opacity: 1, scale: 1 },
    config: { tension: 280, friction: 60 }
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Space Background */}
      <div className="absolute inset-0">
        {/* Stars */}
        {[...Array(200)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1.2, 0.5],
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

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <animated.div style={containerSpring} className="w-full max-w-4xl">
          
          {/* Title Section */}
          <div className="text-center mb-8 sm:mb-12">
            <motion.h1
              animate={{ 
                textShadow: [
                  '0 0 20px #00ffff',
                  '0 0 30px #00ffff',
                  '0 0 20px #00ffff'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            >
              SPACE INVADERS
            </motion.h1>
            
            <div className="text-base sm:text-lg lg:text-2xl xl:text-3xl font-bold text-white mb-4 tracking-wider">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                GALACTIC WARFARE
              </span>
            </div>
            
            <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-6 sm:mb-8 font-light max-w-2xl mx-auto">
              Defiende la galaxia a través de 20 niveles épicos. Evoluciona tu armamento y enfrenta jefes poderosos.
            </p>

            {/* Game Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 max-w-4xl mx-auto">
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-cyan-400/30 shadow-2xl">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mx-auto mb-2" />
                <h3 className="text-white font-bold mb-2 text-sm sm:text-base">20 Niveles</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Con jefes finales épicos</p>
              </div>
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-purple-400/30 shadow-2xl">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-white font-bold mb-2 text-sm sm:text-base">10 Armas</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Evolución progresiva</p>
              </div>
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-green-400/30 shadow-2xl">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-white font-bold mb-2 text-sm sm:text-base">Sistema de Estrellas</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Perfecciona tu técnica</p>
              </div>
            </div>
          </div>

          {/* Menu Buttons */}
          <div className="space-y-4 w-full max-w-md mx-auto">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              onClick={startGame}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-2xl text-lg font-bold text-white transition-all duration-300 shadow-2xl border border-emerald-400/50 backdrop-blur-xl"
            >
              <Play className="w-5 h-5" />
              <span>INICIAR MISIÓN</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowInstructions(true)}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-2xl text-lg font-bold text-white transition-all duration-300 shadow-2xl border border-blue-400/50 backdrop-blur-xl"
            >
              <Info className="w-5 h-5" />
              <span>INSTRUCCIONES</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 rounded-2xl text-lg font-bold text-white transition-all duration-300 shadow-2xl border border-purple-400/50 backdrop-blur-xl"
            >
              <Settings className="w-5 h-5" />
              <span>CONFIGURACIÓN</span>
            </motion.button>
          </div>

          {/* High Score */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-cyan-500/30 max-w-md mx-auto shadow-2xl"
          >
            <div className="flex items-center justify-center space-x-3">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-cyan-400 font-bold text-sm sm:text-base">RÉCORD GALÁCTICO:</span>
              <span className="text-white font-bold text-lg sm:text-xl">{highScore.toLocaleString()}</span>
            </div>
          </motion.div>
        </animated.div>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-cyan-400/50 shadow-2xl p-6"
          >
            <h2 className="text-2xl sm:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              MANUAL DE COMBATE GALÁCTICO
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-white">
              {/* Controls */}
              <div>
                <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Controles
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-8 bg-slate-700/60 rounded-lg flex items-center justify-center text-sm font-bold border border-cyan-400/30">WASD</div>
                    <span>Movimiento de la nave</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-8 bg-slate-700/60 rounded-lg flex items-center justify-center text-sm font-bold border border-cyan-400/30">SPACE</div>
                    <span>Disparar</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-8 bg-slate-700/60 rounded-lg flex items-center justify-center text-sm font-bold border border-cyan-400/30">P/ESC</div>
                    <span>Pausa</span>
                  </div>
                </div>
              </div>

              {/* Objective */}
              <div>
                <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Objetivo
                </h3>
                <ul className="space-y-2">
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
              className="mt-6 w-full px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-2xl text-lg font-bold text-white transition-all duration-300 shadow-2xl border border-cyan-400/50"
            >
              ¡ENTENDIDO, COMANDANTE!
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-purple-500/50 shadow-2xl p-6"
          >
            <h2 className="text-2xl sm:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              CONFIGURACIÓN
            </h2>
            
            <div className="space-y-6">
              {/* Audio Master */}
              <div className="bg-slate-800/40 rounded-xl p-4 border border-purple-400/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {audioEnabled ? <Volume2 className="w-5 h-5 text-green-400" /> : <VolumeX className="w-5 h-5 text-red-400" />}
                    <span className="text-white font-semibold">Audio Principal</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                      audioEnabled 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-400/50' 
                        : 'bg-red-600 hover:bg-red-700 text-white border border-red-400/50'
                    }`}
                  >
                    {audioEnabled ? 'ON' : 'OFF'}
                  </motion.button>
                </div>
              </div>

              {/* Music Volume */}
              <div className="bg-slate-800/40 rounded-xl p-4 border border-blue-400/30">
                <h3 className="text-white font-semibold mb-4">Volumen de Música</h3>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 text-sm">0%</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={musicVolume}
                    onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-gray-400 text-sm">100%</span>
                  <span className="text-white font-bold w-12">{Math.round(musicVolume * 100)}%</span>
                </div>
              </div>

              {/* SFX Volume */}
              <div className="bg-slate-800/40 rounded-xl p-4 border border-orange-400/30">
                <h3 className="text-white font-semibold mb-4">Volumen de Efectos</h3>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 text-sm">0%</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={sfxVolume}
                    onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-gray-400 text-sm">100%</span>
                  <span className="text-white font-bold w-12">{Math.round(sfxVolume * 100)}%</span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSettings(false)}
              className="mt-6 w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl text-lg font-bold text-white transition-all duration-300 shadow-2xl border border-purple-400/50"
            >
              GUARDAR CONFIGURACIÓN
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
};