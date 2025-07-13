import * as THREE from 'three';
import { SpaceEnvironment3D } from './SpaceEnvironment3D';
import { Player3D } from './Player3D';
import { WaveManager } from './WaveManager';
import { WeaponSystem } from './WeaponSystem';
import { ParticleSystem3D } from './ParticleSystem3D';
import { PowerUpManager } from './PowerUpManager';
import { useGameStore } from '../store/gameStore';
import { AudioManager } from './AudioManager';

export class Game3D {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  
  private spaceEnvironment: SpaceEnvironment3D;
  private player: Player3D;
  private waveManager: WaveManager;
  private weaponSystem: WeaponSystem;
  private particleSystem: ParticleSystem3D;
  private powerUpManager: PowerUpManager;
  private audioManager: AudioManager;
  
  private animationId: number | null = null;
  private isRunning = false;
  private lastTime = 0;
  
  private keys: { [key: string]: boolean } = {};
  private shootCooldown = 0;

  constructor(canvas: HTMLCanvasElement) {
    // Initialize Three.js
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true,
      alpha: true 
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Initialize game systems
    this.spaceEnvironment = new SpaceEnvironment3D(this.scene);
    this.player = new Player3D(this.scene);
    this.waveManager = new WaveManager(this.scene);
    this.weaponSystem = new WeaponSystem(this.scene);
    this.particleSystem = new ParticleSystem3D(this.scene);
    this.powerUpManager = new PowerUpManager(this.scene);
    this.audioManager = new AudioManager();
    
    // Set up camera
    this.camera.position.set(0, 0, 15);
    this.camera.lookAt(0, 0, 0);
    
    this.setupEventListeners();
    
    // Make game store available globally for enemy escape notifications
    if (typeof window !== 'undefined') {
      (window as any).gameStore = useGameStore;
    }
  }

  private setupEventListeners() {
    // Keyboard events
    document.addEventListener('keydown', (event) => {
      this.keys[event.code] = true;
      
      if (event.code === 'Space' || event.code === 'KeyP' || event.code === 'Escape') {
        event.preventDefault();
      }
      
      // Handle pause
      if ((event.code === 'KeyP' || event.code === 'Escape') && this.isRunning) {
        const gameStore = useGameStore.getState();
        if (gameStore.gameState === 'playing') {
          gameStore.pauseGame();
        }
      }
    });
    
    document.addEventListener('keyup', (event) => {
      this.keys[event.code] = false;
    });
    
    // Window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  public startLevel(level: number) {
    this.waveManager.startWave(level);
  }

  public start() {
    this.isRunning = true;
    this.gameLoop();
  }

  public stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private gameLoop(currentTime: number = 0) {
    if (!this.isRunning) return;
    
    const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.016); // Cap at 60fps
    this.lastTime = currentTime;
    
    this.update(deltaTime);
    this.render();
    
    this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
  }

  private update(deltaTime: number) {
    const gameStore = useGameStore.getState();
    
    // Only update if game is playing
    if (gameStore.gameState !== 'playing') return;
    
    this.handleInput(deltaTime);
    
    // Update all systems
    this.spaceEnvironment.update(deltaTime);
    this.player.update(deltaTime);
    this.waveManager.update(deltaTime);
    this.weaponSystem.update(deltaTime);
    this.particleSystem.update(deltaTime);
    this.powerUpManager.update(deltaTime);
    
    this.checkCollisions();
    
    // Check wave completion
    if (this.waveManager.isWaveComplete()) {
      // All aliens defeated, spawn boss
      if (!gameStore.showBoss && gameStore.bossHP === 0) {
        const bossHP = 50 + (gameStore.nivelActual * 25);
        gameStore.spawnBoss(bossHP);
        this.audioManager.playBossSpawn();
      }
    }
  }

  private handleInput(deltaTime: number) {
    const gameStore = useGameStore.getState();
    const moveSpeed = 0.12; // Improved movement speed
    
    // Movement
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
      this.player.move(-moveSpeed, 0);
    }
    if (this.keys['ArrowRight'] || this.keys['KeyD']) {
      this.player.move(moveSpeed, 0);
    }
    if (this.keys['ArrowUp'] || this.keys['KeyW']) {
      this.player.move(0, moveSpeed);
    }
    if (this.keys['ArrowDown'] || this.keys['KeyS']) {
      this.player.move(0, -moveSpeed);
    }
    
    // Shooting
    if (this.keys['Space'] && this.shootCooldown <= 0) {
      const weaponConfig = this.getWeaponConfig(gameStore.tipoDisparo);
      this.weaponSystem.fire(this.player.position, gameStore.tipoDisparo);
      this.audioManager.playShoot();
      this.shootCooldown = weaponConfig.fireRate;
    }
    
    if (this.shootCooldown > 0) {
      this.shootCooldown -= deltaTime;
    }
  }

  private getWeaponConfig(weaponType: string) {
    const configs = {
      single: { fireRate: 0.2 },
      double: { fireRate: 0.25 },
      triple: { fireRate: 0.3 },
      spread: { fireRate: 0.4 },
      laser: { fireRate: 0.15 },
      missile: { fireRate: 0.8 }
    };
    return configs[weaponType as keyof typeof configs] || configs.single;
  }

  private checkCollisions() {
    const gameStore = useGameStore.getState();
    
    // Player bullets vs enemies
    const bullets = this.weaponSystem.getBullets();
    const aliens = this.waveManager.getAliens();
    
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      
      for (const alien of aliens) {
        if (this.weaponSystem.checkCollision(i, alien.position, 0.8)) {
          // Hit alien
          const destroyed = alien.takeDamage(bullet.damage);
          this.weaponSystem.removeBullet(i);
          
          if (destroyed) {
            this.waveManager.removeAlien(alien);
            gameStore.addScore(alien.getScore());
            gameStore.enemyDestroyed();
            this.audioManager.playExplosion();
            this.particleSystem.createExplosion(alien.position, alien.getColor());
            
            // Chance to drop power-up
            if (Math.random() < 0.15) {
              this.powerUpManager.spawnRandomPowerUp();
            }
          } else {
            this.audioManager.playEnemyDestroyed();
            this.particleSystem.createExplosion(alien.position, '#ffaa00');
          }
          break;
        }
      }
    }
    
    // Aliens vs player (collision damage)
    for (const alien of aliens) {
      const distance = alien.position.distanceTo(this.player.position);
      if (distance < 0.6) {
        this.waveManager.removeAlien(alien);
        gameStore.takeDamage(alien.getDamage());
        this.audioManager.playHit();
        this.particleSystem.createExplosion(this.player.position, '#ff4444');
        break;
      }
    }
    
    // Power-ups vs player
    const collectedPowerUp = this.powerUpManager.checkCollisions(this.player.position);
    if (collectedPowerUp) {
      this.applyPowerUp(collectedPowerUp);
      this.audioManager.playPowerUp();
      this.particleSystem.createPowerUpEffect(this.player.position);
    }
  }

  private applyPowerUp(powerUp: any) {
    const gameStore = useGameStore.getState();
    
    switch (powerUp.effect) {
      case 'weapon':
        gameStore.upgradeWeapon();
        break;
      case 'health':
        gameStore.heal(powerUp.value);
        break;
      case 'shield':
        gameStore.restoreShield(powerUp.value);
        break;
    }
  }

  private showRandomUpgrades() {
    const gameStore = useGameStore.getState();
    const availableUpgrades = [
      { 
        id: 'upgradeWeapon', 
        nombre: 'Evolución de Arma', 
        descripcion: 'Evoluciona tu arma al siguiente nivel', 
        tipo: 'weapon', 
        color: '#00ff88' 
      },
      { 
        id: 'health', 
        nombre: 'Nanobots Médicos', 
        descripcion: 'Restaura 25 puntos de vida', 
        tipo: 'stat', 
        color: '#ff6b6b' 
      },
      { 
        id: 'shield', 
        nombre: 'Recarga de Escudo', 
        descripcion: 'Restaura 50 puntos de escudo', 
        tipo: 'stat', 
        color: '#4ecdc4' 
      }
    ];
    
    gameStore.showUpgrades(availableUpgrades);
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  public dispose() {
    this.stop();
    this.audioManager.dispose();
    this.scene.clear();
    this.renderer.dispose();
  }
}