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
  private bossSpawned = false;

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
    
    // Set up camera for 2D-like view
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
      
      // Prevenir comportamiento por defecto para teclas del juego
      if (['Space', 'KeyP', 'Escape', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
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
    console.log(`Game3D: Starting level ${level}`);
    this.bossSpawned = false;
    this.waveManager.startWave(level);
    
    // Clear boss state
    const gameStore = useGameStore.getState();
    gameStore.clearBoss();
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
    
    // Check wave completion and boss spawning
    if (this.waveManager.isWaveComplete() && !this.bossSpawned && !gameStore.bossActive) {
      console.log('Wave complete, spawning boss');
      const bossHP = 50 + (gameStore.nivelActual * 25);
      gameStore.spawnBoss(bossHP);
      this.audioManager.playBossSpawn();
      this.bossSpawned = true;
    }
  }

  private handleInput(deltaTime: number) {
    const gameStore = useGameStore.getState();
    const moveSpeed = 0.15;
    
    // Movement - PLAYABLE AREA: X between -4 and 4
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
      if (this.player.position.x > -4) {
        this.player.move(-moveSpeed, 0);
      }
    }
    if (this.keys['ArrowRight'] || this.keys['KeyD']) {
      if (this.player.position.x < 4) {
        this.player.move(moveSpeed, 0);
      }
    }
    if (this.keys['ArrowUp'] || this.keys['KeyW']) {
      if (this.player.position.y < -2) {
        this.player.move(0, moveSpeed);
      }
    }
    if (this.keys['ArrowDown'] || this.keys['KeyS']) {
      if (this.player.position.y > -7) {
        this.player.move(0, -moveSpeed);
      }
    }
    
    // Shooting
    if (this.keys['Space'] && this.shootCooldown <= 0) {
      this.weaponSystem.fire(this.player.position, gameStore.nivelArma, this.audioManager);
      this.shootCooldown = 0.15;
    }
    
    if (this.shootCooldown > 0) {
      this.shootCooldown -= deltaTime;
    }
  }

  private checkCollisions() {
    const gameStore = useGameStore.getState();
    
    // Player bullets vs enemies - CORRECT 2D COLLISIONS
    const bullets = this.weaponSystem.getBullets();
    const aliens = this.waveManager.getAliens();
    const boss = this.waveManager.getBoss();
    
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      
      // Aliens collision - 2D distance check (more precise)
      for (const alien of aliens) {
        const dx = bullet.mesh.position.x - alien.position.x;
        const dy = bullet.mesh.position.y - alien.position.y;
        const distance2D = dx * dx + dy * dy; // Faster without sqrt
        
        if (distance2D < 0.36) { // 0.6^2 = 0.36 for precise collisions
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
      
      // Boss collision - 2D distance check
      if (boss) {
        const dx = bullet.mesh.position.x - boss.position.x;
        const dy = bullet.mesh.position.y - boss.position.y;
        const distance2D = dx * dx + dy * dy;
        
        if (distance2D < 1.0) { // 1.0^2 = 1.0 for boss
          const destroyed = boss.takeDamage(bullet.damage);
          this.weaponSystem.removeBullet(i);
          
          // Update boss HP in store
          gameStore.damageBoss(bullet.damage);
          
          if (destroyed) {
            this.waveManager.removeBoss();
            gameStore.addScore(boss.getScore());
            gameStore.clearBoss();
            this.audioManager.playExplosion();
            this.particleSystem.createExplosion(boss.position, boss.getColor());
            
            // Complete level after boss defeat
            setTimeout(() => {
              gameStore.completeLevel();
            }, 1000);
          } else {
            this.audioManager.playBossHit();
            this.particleSystem.createExplosion(boss.position, '#ff4444');
          }
          break;
        }
      }
    }
    
    // Aliens vs player - 2D collision
    for (const alien of aliens) {
      const dx = alien.position.x - this.player.position.x;
      const dy = alien.position.y - this.player.position.y;
      const distance2D = dx * dx + dy * dy;
      
      if (distance2D < 0.36) { // 0.6^2
        this.waveManager.removeAlien(alien);
        gameStore.takeDamage(alien.getDamage());
        this.audioManager.playHit();
        this.particleSystem.createExplosion(this.player.position, '#ff4444');
        break;
      }
    }
    
    // Boss vs player - 2D collision
    if (boss) {
      const dx = boss.position.x - this.player.position.x;
      const dy = boss.position.y - this.player.position.y;
      const distance2D = dx * dx + dy * dy;
      
      if (distance2D < 1.0) { // 1.0^2
        gameStore.takeDamage(boss.getDamage());
        this.audioManager.playHit();
        this.particleSystem.createExplosion(this.player.position, '#ff4444');
      }
    }
    
    // Power-ups vs player - 2D collision
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

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  public dispose() {
    this.stop();
    this.audioManager.dispose();
    this.waveManager.stopWave();
    this.scene.clear();
    this.renderer.dispose();
  }
}