import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface GameState {
  // Core game state
  nivelActual: number;
  puntuacion: number;
  vidaJugador: number;
  vidaMaxima: number;
  escudoActual: number;
  escudoMaximo: number;
  armasEquipadas: string[];
  mejorasActivas: string[];
  
  // Game flow
  gameState: 'menu' | 'playing' | 'paused' | 'upgrading' | 'gameOver' | 'victory' | 'levelComplete' | 'leaderboard';
  isTransitioning: boolean;
  
  // Player stats
  velocidadNave: number;
  dañoMultiplicador: number;
  velocidadDisparo: number;
  tipoDisparo: string;
  nivelArma: number;
  
  // UI state
  showUpgradeSelection: boolean;
  availableUpgrades: any[];
  
  // Level progress (20 levels system)
  enemigosDestruidos: number;
  enemigosRequeridos: number;
  enemigosEscapados: number;
  
  // Boss system
  showBoss: boolean;
  bossHP: number;
  bossMaxHP: number;
  bossDefeated: boolean;
  
  // Star rating system
  levelStars: number[];
  currentLevelStars: number;
  
  // High score
  highScore: number;
  
  // Audio settings
  audioEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
}

export interface GameActions {
  // Game flow actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  gameOver: () => void;
  nextLevel: () => void;
  completeLevel: () => void;
  
  // Player actions
  takeDamage: (damage: number) => void;
  heal: (amount: number) => void;
  restoreShield: (amount: number) => void;
  addScore: (points: number) => void;
  enemyDestroyed: () => void;
  enemyEscaped: () => void;
  
  // Boss actions
  spawnBoss: (hp: number) => void;
  damageBoss: (damage: number) => void;
  
  // Equipment actions
  equipWeapon: (weaponId: string) => void;
  addUpgrade: (upgradeId: string) => void;
  upgradeWeapon: () => void;
  
  // UI actions
  showUpgrades: (upgrades: any[]) => void;
  hideUpgrades: () => void;
  selectUpgrade: (upgradeId: string) => void;
  
  // Audio actions
  setAudioEnabled: (enabled: boolean) => void;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  
  // Leaderboard actions
  showLeaderboard: () => void;
  saveScore: (playerName: string) => void;
  
  // Reset
  resetGame: () => void;
}

const initialState: GameState = {
  nivelActual: 1,
  puntuacion: 0,
  vidaJugador: 100,
  vidaMaxima: 100,
  escudoActual: 100,
  escudoMaximo: 100,
  armasEquipadas: ['laserSimple'],
  mejorasActivas: [],
  gameState: 'menu',
  isTransitioning: false,
  velocidadNave: 300,
  dañoMultiplicador: 1,
  velocidadDisparo: 1,
  tipoDisparo: 'single',
  nivelArma: 0,
  showUpgradeSelection: false,
  availableUpgrades: [],
  enemigosDestruidos: 0,
  enemigosRequeridos: 20,
  enemigosEscapados: 0,
  showBoss: false,
  bossHP: 0,
  bossMaxHP: 0,
  bossDefeated: false,
  levelStars: new Array(20).fill(0),
  currentLevelStars: 0,
  highScore: parseInt(localStorage.getItem('spaceInvaders_highScore') || '0'),
  audioEnabled: true,
  musicVolume: 0.7,
  sfxVolume: 0.8
};

export const useGameStore = create<GameState & GameActions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,
    
    startGame: () => {
      set({ 
        gameState: 'playing', 
        nivelActual: 1,
        puntuacion: 0, 
        vidaJugador: 100,
        vidaMaxima: 100,
        escudoActual: 100,
        escudoMaximo: 100,
        enemigosDestruidos: 0,
        enemigosRequeridos: 20,
        enemigosEscapados: 0,
        armasEquipadas: ['laserSimple'],
        tipoDisparo: 'single',
        nivelArma: 0,
        mejorasActivas: [],
        velocidadNave: 300,
        dañoMultiplicador: 1,
        velocidadDisparo: 1,
        showUpgradeSelection: false,
        isTransitioning: false,
        showBoss: false,
        bossHP: 0,
        bossMaxHP: 0,
        bossDefeated: false,
        currentLevelStars: 0,
        levelStars: new Array(20).fill(0)
      });
    },
    
    pauseGame: () => set({ gameState: 'paused' }),
    resumeGame: () => set({ gameState: 'playing' }),
    
    gameOver: () => {
      const { puntuacion, highScore } = get();
      const newHighScore = Math.max(puntuacion, highScore);
      localStorage.setItem('spaceInvaders_highScore', newHighScore.toString());
      set({ gameState: 'gameOver', highScore: newHighScore });
    },
    
    completeLevel: () => {
      const { nivelActual, vidaJugador, vidaMaxima, escudoActual, escudoMaximo } = get();
      
      // Calculate stars based on health and shield
      let stars = 1; // Base: completed level
      const healthPercentage = (vidaJugador / vidaMaxima) * 100;
      const shieldPercentage = (escudoActual / escudoMaximo) * 100;
      
      if (healthPercentage === 100 && shieldPercentage === 100) {
        stars = 3; // Perfect
      } else if ((healthPercentage + shieldPercentage) / 2 >= 75) {
        stars = 2; // Good
      }
      
      // Update level stars
      const newLevelStars = [...get().levelStars];
      newLevelStars[nivelActual - 1] = Math.max(newLevelStars[nivelActual - 1], stars);
      
      set({ 
        currentLevelStars: stars,
        levelStars: newLevelStars,
        gameState: 'levelComplete',
        bossDefeated: true,
        showBoss: false,
        bossHP: 0
      });
    },
    
    nextLevel: () => {
      const { nivelActual } = get();
      if (nivelActual >= 20) {
        set({ gameState: 'victory' });
      } else {
        const newLevel = nivelActual + 1;
        const newRequirement = 20 + (newLevel - 1) * 5;
        set({ 
          nivelActual: newLevel,
          enemigosDestruidos: 0,
          enemigosRequeridos: newRequirement,
          enemigosEscapados: 0,
          showBoss: false,
          bossHP: 0,
          bossMaxHP: 0,
          bossDefeated: false,
          isTransitioning: true,
          gameState: 'playing'
        });
        setTimeout(() => set({ isTransitioning: false }), 2000);
      }
    },
    
    spawnBoss: (hp: number) => {
      set({
        showBoss: true,
        bossHP: hp,
        bossMaxHP: hp,
        bossDefeated: false
      });
    },
    
    damageBoss: (damage: number) => {
      const { bossHP } = get();
      const newHP = Math.max(0, bossHP - damage);
      set({ bossHP: newHP });
      
      if (newHP <= 0) {
        get().addScore(1000);
        setTimeout(() => {
          get().completeLevel();
        }, 500);
      }
    },
    
    takeDamage: (damage: number) => {
      const { vidaJugador, escudoActual } = get();
      
      if (escudoActual > 0) {
        const newEscudo = Math.max(0, escudoActual - damage);
        const remainingDamage = damage - escudoActual;
        
        if (remainingDamage > 0) {
          const newVida = Math.max(0, vidaJugador - remainingDamage);
          set({ escudoActual: 0, vidaJugador: newVida });
          if (newVida <= 0) {
            get().gameOver();
          }
        } else {
          set({ escudoActual: newEscudo });
        }
      } else {
        const newVida = Math.max(0, vidaJugador - damage);
        set({ vidaJugador: newVida });
        if (newVida <= 0) {
          get().gameOver();
        }
      }
    },
    
    heal: (amount: number) => {
      const { vidaJugador, vidaMaxima } = get();
      set({ vidaJugador: Math.min(vidaMaxima, vidaJugador + amount) });
    },
    
    restoreShield: (amount: number) => {
      const { escudoActual, escudoMaximo } = get();
      set({ escudoActual: Math.min(escudoMaximo, escudoActual + amount) });
    },
    
    upgradeWeapon: () => {
      const { nivelArma } = get();
      const newLevel = Math.min(nivelArma + 1, 9);
      set({ nivelArma: newLevel });
    },
    
    addScore: (points: number) => {
      const { puntuacion } = get();
      set({ puntuacion: puntuacion + points });
    },
    
    enemyDestroyed: () => {
      const { enemigosDestruidos, enemigosRequeridos, nivelActual } = get();
      const newDestruidos = enemigosDestruidos + 1;
      set({ enemigosDestruidos: newDestruidos });
      
      // Check if all aliens defeated, spawn boss
      if (newDestruidos >= enemigosRequeridos) {
        const bossHP = 50 + (nivelActual * 25);
        get().spawnBoss(bossHP);
      }
    },
    
    enemyEscaped: () => {
      const { enemigosEscapados } = get();
      set({ enemigosEscapados: enemigosEscapados + 1 });
      get().takeDamage(5);
    },
    
    equipWeapon: (weaponId: string) => {
      set({ armasEquipadas: [weaponId] });
    },
    
    addUpgrade: (upgradeId: string) => {
      const { mejorasActivas } = get();
      set({ mejorasActivas: [...mejorasActivas, upgradeId] });
    },
    
    showUpgrades: (upgrades: any[]) => {
      set({ 
        showUpgradeSelection: true, 
        availableUpgrades: upgrades,
        gameState: 'upgrading'
      });
    },
    
    hideUpgrades: () => {
      set({ 
        showUpgradeSelection: false, 
        availableUpgrades: [],
        gameState: 'playing'
      });
    },
    
    selectUpgrade: (upgradeId: string) => {
      const state = get();
      
      switch (upgradeId) {
        case 'upgradeWeapon':
          state.upgradeWeapon();
          break;
        case 'health':
          state.heal(25);
          break;
        case 'shield':
          state.restoreShield(30);
          break;
        case 'velocidadNave':
          set({ velocidadNave: state.velocidadNave * 1.2 });
          break;
        default:
          state.addUpgrade(upgradeId);
      }
      
      state.hideUpgrades();
    },
    
    setAudioEnabled: (enabled: boolean) => {
      set({ audioEnabled: enabled });
    },
    
    setMusicVolume: (volume: number) => {
      set({ musicVolume: volume });
    },
    
    setSfxVolume: (volume: number) => {
      set({ sfxVolume: volume });
    },
    
    showLeaderboard: () => {
      set({ gameState: 'leaderboard' });
    },
    
    saveScore: (playerName: string) => {
      const { puntuacion, nivelActual } = get();
      
      // Get existing leaderboard
      const existingScores = JSON.parse(
        localStorage.getItem('spaceInvaders_leaderboard') || '[]'
      );
      
      // Add new score
      const newScore = {
        name: playerName.trim(),
        score: puntuacion,
        level: nivelActual,
        date: new Date().toISOString()
      };
      
      existingScores.push(newScore);
      
      // Sort by score (highest first) and keep top 10
      existingScores.sort((a: any, b: any) => b.score - a.score);
      const topScores = existingScores.slice(0, 10);
      
      // Save to localStorage
      localStorage.setItem('spaceInvaders_leaderboard', JSON.stringify(topScores));
    },
    
    resetGame: () => set({ ...initialState, highScore: get().highScore })
  }))
);