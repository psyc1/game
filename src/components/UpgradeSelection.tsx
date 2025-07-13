import React from 'react';
import { useGameStore } from '../store/gameStore';
import { animated, useSpring, useTrail } from '@react-spring/web';
import { motion } from 'framer-motion';
import { Zap, Heart, Shield, Star } from 'lucide-react';

export const UpgradeSelection: React.FC = () => {
  const { availableUpgrades, selectUpgrade, nivelActual } = useGameStore();

  const containerSpring = useSpring({
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1 },
    config: { tension: 300, friction: 30 }
  });

  const trail = useTrail(availableUpgrades.length, {
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    delay: 300
  });

  const getUpgradeIcon = (upgrade: any) => {
    const iconMap: { [key: string]: any } = {
      upgradeWeapon: Zap,
      health: Heart,
      shield: Shield
    };
    return iconMap[upgrade.id] || Star;
  };

  const getUpgradeColor = (upgrade: any) => {
    const colorMap: { [key: string]: string } = {
      upgradeWeapon: 'from-yellow-500/20 to-orange-500/20 border-yellow-400/50',
      health: 'from-green-500/20 to-emerald-500/20 border-green-400/50',
      shield: 'from-blue-500/20 to-cyan-500/20 border-blue-400/50'
    };
    return colorMap[upgrade.id] || 'from-purple-500/20 to-pink-500/20 border-purple-400/50';
  };

  return (
    <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <animated.div style={containerSpring} className="max-w-6xl w-full">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            NIVEL {nivelActual} COMPLETADO
          </h1>
          <div className="text-xl md:text-2xl text-white mb-2">¡Excelente trabajo, Comandante!</div>
          <p className="text-lg md:text-xl text-gray-300">Elige una mejora para continuar tu misión</p>
        </motion.div>

        {/* Upgrade Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {trail.map((style, index) => {
            const upgrade = availableUpgrades[index];
            if (!upgrade) return null;

            const IconComponent = getUpgradeIcon(upgrade);
            const colorClass = getUpgradeColor(upgrade);

            return (
              <animated.div key={upgrade.id} style={style}>
                <motion.div
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectUpgrade(upgrade.id)}
                  className={`relative p-6 md:p-8 rounded-2xl bg-gradient-to-br ${colorClass} cursor-pointer transition-all duration-300 group overflow-hidden backdrop-blur-xl h-full shadow-2xl`}
                >
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Icon */}
                  <div className="relative flex justify-center mb-6">
                    <div className="p-4 md:p-6 rounded-full bg-slate-900/60 backdrop-blur-sm border border-cyan-400/30 shadow-2xl">
                      <IconComponent className="w-8 h-8 md:w-12 md:h-12 text-cyan-400" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative text-center space-y-4">
                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                      {upgrade.nombre}
                    </h3>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                      {upgrade.descripcion}
                    </p>
                    
                    {/* Type badge */}
                    <div className="flex justify-center">
                      <span className="px-3 md:px-4 py-1 md:py-2 bg-slate-900/60 rounded-full text-cyan-400 text-xs md:text-sm font-semibold uppercase tracking-wide border border-cyan-400/30 backdrop-blur-sm">
                        {upgrade.tipo === 'weapon' ? 'Arma' : 
                         upgrade.tipo === 'stat' ? 'Estadística' : 'Especial'}
                      </span>
                    </div>
                  </div>

                  {/* Hover effect border */}
                  <div className="absolute inset-0 border-2 border-cyan-400/0 group-hover:border-cyan-400/50 rounded-2xl transition-all duration-300" />
                  
                  {/* Selection indicator */}
                  <motion.div
                    className="absolute top-4 right-4 w-4 h-4 md:w-6 md:h-6 bg-cyan-400/20 rounded-full border-2 border-cyan-400/40"
                    whileHover={{ scale: 1.2 }}
                  />
                </motion.div>
              </animated.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 space-y-4"
        >
          <p className="text-gray-400 text-base md:text-lg">Haz clic en una carta para seleccionar la mejora</p>
          <div className="flex justify-center space-x-6 md:space-x-8 text-xs md:text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Mejora de Arma</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Mejora de Vida</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Mejora de Escudo</span>
            </div>
          </div>
        </motion.div>
      </animated.div>
    </div>
  );
};