import React from 'react';
import { useGameStore } from '../store/gameStore';
import { animated, useSpring } from '@react-spring/web';
import { motion } from 'framer-motion';
import { Star, Trophy, ArrowRight } from 'lucide-react';

export const LevelComplete: React.FC = () => {
  const { nivelActual, currentLevelStars, nextLevel } = useGameStore();

  const containerSpring = useSpring({
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1 },
    config: { tension: 200, friction: 25 }
  });

  const getStarColor = (index: number) => {
    return index < currentLevelStars ? '#fbbf24' : '#374151';
  };

  const getPerformanceText = () => {
    switch (currentLevelStars) {
      case 3:
        return '¡PERFECTO! Sin daño recibido';
      case 2:
        return '¡EXCELENTE! Buen rendimiento';
      case 1:
        return '¡COMPLETADO! Nivel superado';
      default:
        return 'Nivel completado';
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-blue-900/95 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <animated.div style={containerSpring} className="text-center max-w-2xl mx-auto">
        {/* Level Complete Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex justify-center mb-6">
            <Trophy className="w-16 h-16 text-yellow-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-cyan-400 mb-4 tracking-wider">
            NIVEL {nivelActual} COMPLETADO
          </h1>
          <p className="text-xl md:text-2xl text-white mb-6">
            {getPerformanceText()}
          </p>
        </motion.div>

        {/* Stars Display */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="flex justify-center space-x-4 mb-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.7 + i * 0.2, type: "spring", stiffness: 300 }}
              >
                <Star 
                  className="w-12 h-12 md:w-16 md:h-16" 
                  style={{ color: getStarColor(i) }}
                  fill={i < currentLevelStars ? getStarColor(i) : 'transparent'}
                />
              </motion.div>
            ))}
          </div>
          <p className="text-lg text-gray-300">
            {currentLevelStars} de 3 estrellas obtenidas
          </p>
        </motion.div>

        {/* Performance Details */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-cyan-400/30 mb-8"
        >
          <h3 className="text-xl md:text-2xl font-bold text-cyan-400 mb-4">
            Rendimiento del Nivel
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-yellow-400">
                {currentLevelStars}★
              </div>
              <div className="text-gray-400">Estrellas</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-green-400">
                {nivelActual}
              </div>
              <div className="text-gray-400">Nivel</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-purple-400">
                {20 + (nivelActual - 1) * 5}
              </div>
              <div className="text-gray-400">Aliens Derrotados</div>
            </div>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={nextLevel}
            className="flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl text-xl font-bold text-white transition-all duration-300 mx-auto"
          >
            <span>CONTINUAR</span>
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </motion.div>

        {/* Auto-advance notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-6 text-gray-400 text-sm"
        >
          <p>El siguiente nivel comenzará automáticamente en unos segundos...</p>
        </motion.div>
      </animated.div>
    </div>
  );
};