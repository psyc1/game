import { getWavePattern } from '../config/wavePatterns';
import { alienTypes } from '../config/alienTypes';
import { Alien3D } from './Alien3D';
import * as THREE from 'three';

interface AlienType {
  name: string;
  hp: number;
  speed: number;
  points: number;
  color: string;
}

interface WaveComposition {
  alienType: AlienType;
  count: number;
}

interface WavePattern {
  description: string;
  composition: WaveComposition[];
}

export class WaveManager {
  private scene: THREE.Scene;
  private aliens: Alien3D[] = [];
  private boss: Alien3D | null = null;
  private currentWave: WavePattern | null = null;
  private spawnQueue: Array<{ alienType: AlienType; position: THREE.Vector3; delay: number }> = [];
  private spawnTimer = 0;
  private level = 1;
  private aliensDestroyed = 0;
  private totalAliensInWave = 0;
  private waveStarted = false;
  private bossSpawned = false;
  private aliensSpawned = 0;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public startWave(level: number) {
    console.log(`🌊 Starting wave for level ${level}`);
    this.level = level;
    this.aliensDestroyed = 0;
    this.aliensSpawned = 0;
    this.waveStarted = true;
    this.bossSpawned = false;
    
    // Limpiar aliens y jefe existentes
    this.aliens.forEach(alien => alien.dispose());
    this.aliens = [];
    
    if (this.boss) {
      this.boss.dispose();
      this.boss = null;
    }
    
    // ALWAYS 20 aliens per level - FIXED
    this.totalAliensInWave = 20;
    
    console.log(`📊 FIXED: 20 aliens for level ${level}`);
    
    // Generar cola de spawn inmediatamente
    this.generateSpawnQueue();
    this.spawnTimer = 0;
  }

  private generateSpawnQueue() {
    if (!this.currentWave) return;
    
    this.spawnQueue = [];
    
    // Área de juego: X entre -4.5 y 4.5 (centro entre paneles), Y entre 8 y 15
    const gameAreaWidth = 9; // -4.5 a 4.5
    const gameAreaHeight = 7; // 8 a 15
    
    let alienIndex = 0;
    
    // Crear aliens basados en el patrón de la wave
    this.currentWave.composition.forEach(comp => {
      for (let i = 0; i < comp.count; i++) {
        // Posición aleatoria en el área de juego
        const x = (Math.random() - 0.5) * gameAreaWidth; // -4.5 a 4.5
        const y = 8 + Math.random() * gameAreaHeight; // 8 a 15
        const z = (Math.random() - 0.5) * 1; // Pequeña variación en Z
        
        this.spawnQueue.push({
          alienType: comp.alienType,
          position: new THREE.Vector3(x, y, z),
          delay: alienIndex * 0.1 // 0.1 segundos entre cada alien
        });
        alienIndex++;
      }
    });
    
    // Llenar hasta el total requerido con aliens aleatorios
    while (alienIndex < this.totalAliensInWave) {
      const randomAlienType = alienTypes[Math.floor(Math.random() * alienTypes.length)];
      const x = (Math.random() - 0.5) * gameAreaWidth;
      const y = 8 + Math.random() * gameAreaHeight;
      const z = (Math.random() - 0.5) * 1;
      
      this.spawnQueue.push({
        alienType: randomAlienType,
        position: new THREE.Vector3(x, y, z),
        delay: alienIndex * 0.1
      });
      alienIndex++;
    }
    
    console.log(`🎯 Spawn queue created with ${this.spawnQueue.length} aliens`);
  }

  public update(deltaTime: number) {
    if (!this.waveStarted) return;
    
    // Spawn aliens continuously until total completed
    if (this.aliensSpawned < this.totalAliensInWave) {
      this.spawnTimer += deltaTime;
      
      if (this.spawnTimer >= 0.05) { // Every 0.05 seconds - FASTER
        this.spawnRandomAlien();
        this.spawnTimer = 0;
      }
    }
    
    // Actualizar aliens existentes
    for (let i = this.aliens.length - 1; i >= 0; i--) {
      const alien = this.aliens[i];
      alien.update(deltaTime);
      
      // Force Z=0 for all aliens
      alien.position.z = 0;
      
      // Remover aliens que escaparon (llegaron abajo)
      if (alien.position.y < -8) {
        console.log(`👾 Alien escaped!`);
        this.removeAlienEscaped(alien);
      }
    }
    
    // Actualizar jefe si existe
    if (this.boss) {
      this.boss.update(deltaTime);
      
      // Force Z=0 for boss
      this.boss.position.z = 0;
      
      // Remover jefe si escapa
      if (this.boss.position.y < -8) {
        console.log(`👹 Boss escaped!`);
        this.boss.dispose();
        this.boss = null;
        // Notificar escape del jefe
        if (typeof window !== 'undefined' && (window as any).gameStore) {
          (window as any).gameStore.getState().takeDamage(50);
        }
      }
    }
    
    // Procesar cola de spawn
    if (this.spawnQueue.length > 0) {
      this.spawnTimer += deltaTime;
      
      // Spawn aliens cuando sea su turno
      while (this.spawnQueue.length > 0 && this.spawnTimer >= this.spawnQueue[0].delay) {
        const spawnData = this.spawnQueue.shift()!;
        this.spawnAlien(spawnData.alienType, spawnData.position);
        this.spawnTimer = 0; // Reset timer para el siguiente
      }
    }
    
    // Spawn del jefe cuando todos los aliens han sido eliminados
    if (!this.bossSpawned && this.spawnQueue.length === 0 && this.aliens.length === 0 && !this.boss) {
      console.log(`👹 All aliens defeated, spawning boss for level ${this.level}`);
      this.spawnBoss();
    }
  }

  private spawnAlien(alienType: AlienType, position: THREE.Vector3) {
    const alien = new Alien3D(this.scene, position, alienType, false);
    this.aliens.push(alien);
    this.aliensSpawned++;
    console.log(`👾 Spawned alien ${this.aliensSpawned}/${this.totalAliensInWave}, active: ${this.aliens.length}`);
  }

  private spawnRandomAlien() {
    if (this.aliensSpawned >= this.totalAliensInWave) return;
    
    // Seleccionar tipo de alien aleatorio
    const randomAlienType = alienTypes[Math.floor(Math.random() * alienTypes.length)];
    
    // PLAYABLE AREA: Only between side panels
    // X: -4 to 4 (central area between panels)
    // Y: 8 to 12 (visible top area)
    const x = -4 + Math.random() * 8; // -4 a 4
    const y = 8 + Math.random() * 4;  // 8 a 12
    const z = 0; // ALWAYS Z=0 for 2D collisions
    
    const position = new THREE.Vector3(x, y, z);
    const alien = new Alien3D(this.scene, position, randomAlienType, false);
    this.aliens.push(alien);
    this.aliensSpawned++;
    
    console.log(`👾 Spawned alien ${this.aliensSpawned}/${this.totalAliensInWave} at (${x.toFixed(1)}, ${y.toFixed(1)})`);
  }

  private spawnBoss() {
    this.bossSpawned = true;
    
    // Seleccionar tipo de alien para el jefe basado en el nivel
    const bossAlienType = alienTypes[Math.min(this.level - 1, alienTypes.length - 1)];
    
    // Posición central del jefe en el área de juego
    const bossPosition = new THREE.Vector3(0, 12, 0);
    
    // Crear jefe con HP escalado
    const bossHP = 50 + (this.level * 25);
    const bossBoostedType = {
      ...bossAlienType,
      hp: bossHP
    };
    
    this.boss = new Alien3D(this.scene, bossPosition, bossBoostedType, true);
    console.log(`👹 Boss spawned with ${bossHP} HP at level ${this.level}`);
    
    // Notificar al store que hay un jefe
    if (typeof window !== 'undefined' && (window as any).gameStore) {
      (window as any).gameStore.getState().spawnBoss(bossHP);
    }
  }

  public removeAlien(alien: Alien3D) {
    const index = this.aliens.indexOf(alien);
    if (index !== -1) {
      this.aliens.splice(index, 1);
      alien.dispose();
      this.aliensDestroyed++;
      console.log(`💥 Alien destroyed: ${this.aliensDestroyed}, remaining: ${this.aliens.length}`);
    }
  }

  public removeBoss() {
    if (this.boss) {
      this.boss.dispose();
      this.boss = null;
      console.log(`💥 Boss destroyed!`);
    }
  }

  private removeAlienEscaped(alien: Alien3D) {
    this.removeAlien(alien);
    // Notificar escape al game store - pierdes vida
    if (typeof window !== 'undefined' && (window as any).gameStore) {
      (window as any).gameStore.getState().takeDamage(10);
    }
  }

  public getAliens(): Alien3D[] {
    return this.aliens;
  }

  public getBoss(): Alien3D | null {
    return this.boss;
  }

  public hasBoss(): boolean {
    return this.boss !== null;
  }

  public isWaveComplete(): boolean {
    const allAliensSpawned = this.spawnQueue.length === 0;
    const noAliensRemaining = this.aliens.length === 0;
    const noBossRemaining = this.boss === null;
    const waveComplete = allAliensSpawned && noAliensRemaining && noBossRemaining && this.waveStarted && this.bossSpawned;
    
    if (waveComplete) {
      console.log(`🏆 Wave ${this.level} completed!`);
    }
    
    return waveComplete;
  }

  public getProgress(): { destroyed: number; total: number; remaining: number } {
    return {
      destroyed: this.aliensDestroyed,
      total: this.totalAliensInWave,
      remaining: this.aliens.length + this.spawnQueue.length
    };
  }

  public getCurrentWaveInfo(): string {
    return this.currentWave?.description || `Oleada ${this.level}`;
  }

  public stopWave() {
    this.waveStarted = false;
    this.bossSpawned = false;
    this.aliens.forEach(alien => alien.dispose());
    this.aliens = [];
    if (this.boss) {
      this.boss.dispose();
      this.boss = null;
    }
    this.spawnQueue = [];
    console.log(`🛑 Wave stopped`);
  }
}