import React from 'react';
import { useGameStore } from '../store/gameStore';
import { animated, useSpring } from '@react-spring/web';
import { motion } from 'framer-motion';
import { Target, Zap } from 'lucide-react';

export const LevelTransition: React.FC = () => {
  const { nivelActual } = useGameStore();

  const containerSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 500 }
  });

  const levelSpring = useSpring({
    from: { scale: 0, rotate: -180 },
    to: { scale: 1, rotate: 0 },
    config: { tension: 200, friction: 20 }
  });

  return (
    <animated.div 
      style={containerSpring}
      className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-black/95 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="text-center">
        {/* Level indicator */}
        <animated.div style={levelSpring} className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full border-4 border-white/30 shadow-2xl">
            <div className="text-center">
              <Target className="w-8 h-8 text-white mx-auto mb-1" />
              <div className="text-2xl font-bold text-white">{nivelActual}</div>
            </div>
          </div>
        </animated.div>

        {/* Level text */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            NIVEL {nivelActual}
          </h1>
          <p className="text-xl text-cyan-400 mb-8">
            Preparando nueva oleada de enemigos...
          </p>
        </motion.div>

        {/* Loading animation */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="w-64 mx-auto"
        >
          <div className="h-2 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full shadow-lg">
            <motion.div
              animate={{ x: [-20, 20, -20] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="h-full w-8 bg-white/50 rounded-full"
            />
          </div>
        </motion.div>

        {/* Motivational text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-gray-300"
        >
          <p className="italic">
            {nivelActual % 10 === 0 
              ? "¡Prepárate para enfrentar al jefe!" 
              : "La galaxia cuenta contigo, comandante"
            }
          </p>
        </motion.div>
      </div>
    </animated.div>
  );
};