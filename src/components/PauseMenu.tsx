import React from 'react';
import { useGameStore } from '../store/gameStore';
import { animated, useSpring } from '@react-spring/web';
import { motion } from 'framer-motion';
import { Play, Home, Settings, Volume2 } from 'lucide-react';

export const PauseMenu: React.FC = () => {
  const { resumeGame, resetGame } = useGameStore();

  const containerSpring = useSpring({
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
    config: { tension: 300, friction: 30 }
  });

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center">
      <animated.div style={containerSpring} className="text-center max-w-md mx-auto px-6">
        {/* Title */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">PAUSA</h1>
          <p className="text-gray-400">Misión en espera</p>
        </motion.div>

        {/* Menu Options */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={resumeGame}
            className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg text-lg font-bold text-white transition-all duration-300"
          >
            <Play className="w-5 h-5" />
            <span>CONTINUAR</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 rounded-lg text-lg font-bold text-white transition-all duration-300"
          >
            <Settings className="w-5 h-5" />
            <span>CONFIGURACIÓN</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(249, 115, 22, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-lg text-lg font-bold text-white transition-all duration-300"
          >
            <Volume2 className="w-5 h-5" />
            <span>AUDIO</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-lg text-lg font-bold text-white transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            <span>ABANDONAR MISIÓN</span>
          </motion.button>
        </motion.div>

        {/* Controls reminder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-black/30 rounded-lg border border-gray-700"
        >
          <h3 className="text-white font-semibold mb-2">Controles</h3>
          <div className="text-sm text-gray-400 space-y-1">
            <div>WASD / Flechas: Movimiento</div>
            <div>ESPACIO: Disparar</div>
            <div>P / ESC: Pausa</div>
          </div>
        </motion.div>
      </animated.div>
    </div>
  );
};