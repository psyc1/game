import React from 'react';
import { useGameStore } from '../store/gameStore';
import { animated, useSpring } from '@react-spring/web';
import { motion } from 'framer-motion';
import { RotateCcw, Home, Trophy } from 'lucide-react';

export const GameOverScreen: React.FC = () => {
  const { puntuacion, nivelActual, highScore, resetGame } = useGameStore();

  const containerSpring = useSpring({
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1 },
    config: { tension: 200, friction: 25 }
  });

  const isNewRecord = puntuacion === highScore && puntuacion > 0;

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 via-black/90 to-purple-900/90 backdrop-blur-sm flex items-center justify-center">
      <animated.div style={containerSpring} className="text-center max-w-lg mx-auto px-6">
        {/* Game Over Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-6xl font-bold text-red-400 mb-4 tracking-wider">
            GAME OVER
          </h1>
          {isNewRecord && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="mb-4"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
                <Trophy className="w-5 h-5 text-white" />
                <span className="text-white font-bold">¡NUEVO RÉCORD!</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6 mb-8"
        >
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-cyan-400/30">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {puntuacion.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-wide">
                  Puntuación Final
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-1">
                  {nivelActual}
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-wide">
                  Nivel Alcanzado
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-4 border border-cyan-400/30">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {highScore.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wide">
                Récord Personal
              </div>
            </div>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetGame();
              useGameStore.getState().startGame();
            }}
            className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl text-xl font-bold text-white transition-all duration-300 shadow-2xl border border-green-400/50 backdrop-blur-xl"
          >
            <RotateCcw className="w-6 h-6" />
            <span>INTENTAR DE NUEVO</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl text-xl font-bold text-white transition-all duration-300 shadow-2xl border border-blue-400/50 backdrop-blur-xl"
          >
            <Home className="w-6 h-6" />
            <span>MENÚ PRINCIPAL</span>
          </motion.button>
        </motion.div>

        {/* Motivational message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-gray-400 text-center"
        >
          <p className="italic">
            "La galaxia necesita héroes como tú. ¡No te rindas, comandante!"
          </p>
        </motion.div>
      </animated.div>
    </div>
  );
};