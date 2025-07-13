import React from 'react';
import { useGameStore } from '../store/gameStore';
import { animated, useSpring } from '@react-spring/web';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Home, RotateCcw } from 'lucide-react';

interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
  levels: number;
}

export const Leaderboard: React.FC = () => {
  const { resetGame } = useGameStore();

  const containerSpring = useSpring({
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
    config: { tension: 300, friction: 30 }
  });

  // Get leaderboard data
  const leaderboardData: LeaderboardEntry[] = JSON.parse(
    localStorage.getItem('spaceInvaders_leaderboard') || '[]'
  );

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">{index + 1}</div>;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-400/30';
      case 1:
        return 'from-gray-400/20 to-gray-600/20 border-gray-400/30';
      case 2:
        return 'from-amber-500/20 to-amber-700/20 border-amber-600/30';
      default:
        return 'from-slate-700/20 to-slate-800/20 border-slate-600/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <animated.div style={containerSpring} className="w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16 text-yellow-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            LEADERBOARD GALÁCTICO
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Los mejores defensores de la galaxia
          </p>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-cyan-400/30 shadow-2xl p-4 md:p-6 mb-8"
        >
          {leaderboardData.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-bold text-gray-400 mb-2">
                No hay puntuaciones aún
              </h3>
              <p className="text-gray-500">
                ¡Sé el primero en completar el juego y aparecer en el leaderboard!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-700">
                <div className="col-span-1">Rank</div>
                <div className="col-span-4 md:col-span-5">Jugador</div>
                <div className="col-span-3 md:col-span-2">Puntuación</div>
                <div className="col-span-2 md:col-span-2">Niveles</div>
                <div className="col-span-2 md:col-span-2 hidden md:block">Fecha</div>
              </div>

              {/* Entries */}
              {leaderboardData.map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className={`grid grid-cols-12 gap-4 px-4 py-4 rounded-xl bg-gradient-to-r ${getRankColor(index)} border backdrop-blur-sm hover:scale-[1.02] transition-all duration-300`}
                >
                  <div className="col-span-1 flex items-center">
                    {getRankIcon(index)}
                  </div>
                  <div className="col-span-4 md:col-span-5 flex items-center">
                    <span className="font-bold text-white text-sm md:text-base truncate">
                      {entry.name}
                    </span>
                  </div>
                  <div className="col-span-3 md:col-span-2 flex items-center">
                    <span className="font-bold text-yellow-400 text-sm md:text-base">
                      {entry.score.toLocaleString()}
                    </span>
                  </div>
                  <div className="col-span-2 md:col-span-2 flex items-center">
                    <span className="text-cyan-400 font-semibold text-sm md:text-base">
                      {entry.levels}/20
                    </span>
                  </div>
                  <div className="col-span-2 md:col-span-2 hidden md:flex items-center">
                    <span className="text-gray-400 text-sm">
                      {formatDate(entry.date)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col md:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetGame();
              useGameStore.getState().startGame();
            }}
            className="flex items-center justify-center space-x-3 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl text-lg md:text-xl font-bold text-white transition-all duration-300 shadow-2xl border border-green-400/50 backdrop-blur-xl"
          >
            <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
            <span>JUGAR DE NUEVO</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="flex items-center justify-center space-x-3 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl text-lg md:text-xl font-bold text-white transition-all duration-300 shadow-2xl border border-blue-400/50 backdrop-blur-xl"
          >
            <Home className="w-5 h-5 md:w-6 md:h-6" />
            <span>MENÚ PRINCIPAL</span>
          </motion.button>
        </motion.div>
      </animated.div>
    </div>
  );
};