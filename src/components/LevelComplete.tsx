import React from 'react';
import { useGameStore } from '../store/gameStore';
import { animated, useSpring } from '@react-spring/web';
import { motion } from 'framer-motion';

export const LevelComplete: React.FC = () => {
  const { nivelActual, currentLevelStars, nextLevel, puntuacion } = useGameStore();

  const containerSpring = useSpring({
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1 },
    config: { tension: 200, friction: 25 }
  });

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <animated.div style={containerSpring} className="text-center max-w-md mx-auto">
        {/* AWESOME! Title - Following exact reference */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative">
            {/* Glow effect background */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-2xl blur-xl" />
            
            {/* Main card - Following reference design exactly */}
            <div className="relative bg-gradient-to-br from-purple-600/30 to-blue-600/30 backdrop-blur-xl rounded-2xl border border-cyan-400/50 p-8 shadow-2xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-wider">
                AWESOME!
              </h1>
              <p className="text-lg sm:text-xl text-cyan-300 mb-6">
                Mission accomplished
              </p>
              
              {/* Decorative elements like in reference */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-lg rotate-12 opacity-80" />
              <div className="absolute -top-2 -right-6 w-6 h-6 bg-orange-500 rounded-lg rotate-45 opacity-70" />
              <div className="absolute -bottom-3 -left-2 w-5 h-5 bg-pink-500 rounded-lg rotate-12 opacity-60" />
              <div className="absolute -bottom-4 -right-4 w-7 h-7 bg-green-400 rounded-lg rotate-45 opacity-80" />
            </div>
          </div>
        </motion.div>

        {/* Final Score Section - Following reference format */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-xl border border-cyan-400/30 p-6 shadow-xl">
            <div className="text-cyan-400 font-bold text-sm uppercase tracking-wider mb-2">
              [ Final Score ]
            </div>
            <div className="text-3xl font-bold text-white">
              {puntuacion.toLocaleString()}
            </div>
          </div>
        </motion.div>

        {/* Next Level Button - Following reference exactly */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(34, 211, 238, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={nextLevel}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-2xl border border-cyan-400/50 backdrop-blur-xl transition-all duration-300"
          >
            Next Level
          </motion.button>
        </motion.div>

        {/* Auto-advance notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-6 text-gray-400 text-sm"
        >
          <p>Advancing automatically...</p>
        </motion.div>
      </animated.div>
    </div>
  );
};