import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { animated, useSpring } from '@react-spring/web';
import { motion } from 'framer-motion';
import { Trophy, Star, Home, Users, Save } from 'lucide-react';

interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
  levels: number;
}

export const VictoryScreen: React.FC = () => {
  const { puntuacion, resetGame, showLeaderboard } = useGameStore();
  const [playerName, setPlayerName] = useState('');
  const [nameSubmitted, setNameSubmitted] = useState(false);

  const containerSpring = useSpring({
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1 },
    config: { tension: 200, friction: 25 }
  });

  const handleSubmitScore = () => {
    if (playerName.trim()) {
      // Get existing leaderboard
      const existingScores: LeaderboardEntry[] = JSON.parse(
        localStorage.getItem('spaceInvaders_leaderboard') || '[]'
      );
      
      // Add new score
      const newScore: LeaderboardEntry = {
        name: playerName.trim(),
        score: puntuacion,
        date: new Date().toISOString(),
        levels: 20
      };
      
      existingScores.push(newScore);
      
      // Sort by score (highest first) and keep top 10
      existingScores.sort((a, b) => b.score - a.score);
      const topScores = existingScores.slice(0, 10);
      
      // Save to localStorage
      localStorage.setItem('spaceInvaders_leaderboard', JSON.stringify(topScores));
      
      setNameSubmitted(true);
    }
  };

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/90 via-purple-900/90 to-blue-900/90 backdrop-blur-sm flex items-center justify-center p-4">
      <animated.div style={containerSpring} className="text-center max-w-2xl mx-auto">
        {/* Victory Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16 md:w-24 md:h-24 text-yellow-400" />
          </div>
          <h1 className="text-3xl md:text-6xl font-bold text-yellow-400 mb-4 tracking-wider">
            ¡VICTORIA TOTAL!
          </h1>
          <p className="text-lg md:text-2xl text-white mb-4">
            ¡Has completado todos los 20 niveles!
          </p>
          <div className="flex justify-center space-x-1 mb-4">
            {[...Array(3)].map((_, i) => (
              <Star key={i} className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 fill-current" />
            ))}
          </div>
          <p className="text-base md:text-lg text-gray-300">
            ¡Eres un verdadero defensor de la galaxia!
          </p>
        </motion.div>

        {/* Final Score */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 md:p-8 border border-yellow-400/30">
            <h2 className="text-xl md:text-3xl font-bold text-yellow-400 mb-4">
              PUNTUACIÓN FINAL
            </h2>
            <div className="text-3xl md:text-6xl font-bold text-white mb-4">
              {puntuacion.toLocaleString()}
            </div>
            <p className="text-sm md:text-base text-gray-300">
              20 niveles completados con éxito
            </p>
          </div>
        </motion.div>

        {/* Name Input or Submitted State */}
        {!nameSubmitted ? (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 md:p-8 border border-cyan-400/30">
              <h3 className="text-lg md:text-2xl font-bold text-cyan-400 mb-4">
                Ingresa tu nombre para el Leaderboard Galáctico
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Tu nombre de comandante..."
                  maxLength={20}
                  className="flex-1 px-4 py-3 bg-slate-800/60 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-sm md:text-base"
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitScore()}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmitScore}
                  disabled={!playerName.trim()}
                  className="flex items-center justify-center space-x-2 px-4 md:px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 rounded-xl font-bold text-white transition-all duration-300 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  <Save className="w-4 h-4 md:w-5 md:h-5" />
                  <span>GUARDAR</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-8"
          >
            <div className="bg-green-900/80 backdrop-blur-xl rounded-2xl p-4 md:p-8 border border-green-400/30">
              <h3 className="text-lg md:text-2xl font-bold text-green-400 mb-2">
                ¡Puntuación Guardada!
              </h3>
              <p className="text-sm md:text-base text-gray-300">
                Tu hazaña ha sido registrada en el leaderboard galáctico.
              </p>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={showLeaderboard}
            className="w-full flex items-center justify-center space-x-2 md:space-x-3 px-4 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-xl text-base md:text-xl font-bold text-white transition-all duration-300"
          >
            <Users className="w-4 h-4 md:w-6 md:h-6" />
            <span>VER LEADERBOARD</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetGame();
              useGameStore.getState().startGame();
            }}
            className="w-full flex items-center justify-center space-x-2 md:space-x-3 px-4 md:px-8 py-3 md:py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl text-base md:text-xl font-bold text-white transition-all duration-300"
          >
            <Trophy className="w-4 h-4 md:w-6 md:h-6" />
            <span>NUEVA CAMPAÑA</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="w-full flex items-center justify-center space-x-2 md:space-x-3 px-4 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl text-base md:text-xl font-bold text-white transition-all duration-300"
          >
            <Home className="w-4 h-4 md:w-6 md:h-6" />
            <span>MENÚ PRINCIPAL</span>
          </motion.button>
        </motion.div>
      </animated.div>
    </div>
  );
};