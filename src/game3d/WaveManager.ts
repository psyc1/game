import * as THREE from 'three';
import { Alien3D } from './Alien3D';
import { getWavePattern, WavePattern } from '../config/wavePatterns';
import { AlienType, alienTypes } from '../config/alienTypes';

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

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public startWave(level: number) {
    console.log(`Starting wave for level ${level}`);
    this.level = level;
    this.aliensDestroyed = 0;
    this.waveStarted = true;
    this.bossSpawned = false;
    
    // Limpiar aliens y jefe existentes
    this.aliens.forEach(alien => alien.dispose());
    this.aliens = [];
    
    if (this.boss) {
      this.boss.dispose();
      this.boss = null;
    }
    
    // Obtener patrón de oleada
    this.currentWave = getWavePattern(level);
    this.generateSpawnQueue();
    this.spawnTimer = 0;
    
    // Calculate required aliens for this level: 20 + (level-1) * 5
    this.totalAliensInWave = 20 + (level - 1) * 5;
    console.log(`Total aliens for level ${level}: ${this.totalAliensInWave}`);
  }

  private generateSpawnQueue() {
    if (!this.currentWave) return;
    
    this.spawnQueue = [];
    
    // Generar posiciones aleatorias dentro del área de juego
    const positions = this.generateRandomPositions();
    let positionIndex = 0;
    
    // Crear cola de spawn con delays muy rápidos
    this.currentWave.composition.forEach(comp => {
      for (let i = 0; i < comp.count; i++) {
        if (positionIndex < positions.length) {
          this.spawnQueue.push({
            alienType: comp.alienType,
            position: positions[positionIndex],
            delay: positionIndex * 0.02 // Muy rápido: 0.02 segundos entre aliens
          });
          positionIndex++;
        }
      }
    });
    
    console.log(`Spawn queue created with ${this.spawnQueue.length} aliens`);
  }

  private generateRandomPositions(): THREE.Vector3[] {
    const positions: THREE.Vector3[] = [];
    const totalAliens = this.totalAliensInWave;
    
    // Área de juego definida: entre x=-5 y x=5 (entre paneles), y entre y=8 y y=15
    const gameAreaWidth = 10; // -5 a 5
    const gameAreaHeight = 7;  // 8 a 15
    
    for (let i = 0; i < totalAliens; i++) {
      const x = (Math.random() - 0.5) * gameAreaWidth; // -5 a 5
      const y = 8 + Math.random() * gameAreaHeight; // 8 a 15
      const z = (Math.random() - 0.5) * 2; // Pequeña variación en Z
      positions.push(new THREE.Vector3(x, y, z));
    }
    
    return positions;
  }

  public update(deltaTime: number) {
    if (!this.waveStarted) return;
    
    // Actualizar aliens existentes con velocidad aumentada
    for (let i = this.aliens.length - 1; i >= 0; i--) {
      const alien = this.aliens[i];
      alien.update(deltaTime);
      
      // Remover aliens que escaparon (llegaron abajo)
      if (alien.position.y < -8) {
        this.removeAlienEscaped(alien);
      }
    }
    
    // Actualizar jefe si existe
    if (this.boss) {
      this.boss.update(deltaTime);
      
      // Remover jefe si escapa
      if (this.boss.position.y < -8) {
        this.boss.dispose();
        this.boss = null;
        // Notificar escape del jefe
        if (typeof window !== 'undefined' && (window as any).gameStore) {
          (window as any).gameStore.getState().takeDamage(50);
        }
      }
    }
    
    // Procesar cola de spawn muy rápido
    if (this.spawnQueue.length > 0) {
      this.spawnTimer += deltaTime;
      
      // Revisar si es tiempo de hacer spawn del siguiente alien
      while (this.spawnQueue.length > 0 && this.spawnTimer >= this.spawnQueue[0].delay) {
        const spawnData = this.spawnQueue.shift()!;
        this.spawnAlien(spawnData.alienType, spawnData.position);
        
        // Ajustar timer para el siguiente
        if (this.spawnQueue.length > 0) {
          this.spawnQueue[0].delay -= this.spawnTimer;
        }
        this.spawnTimer = 0;
      }
    }
    
    // Spawn del jefe cuando todos los aliens han sido eliminados
    if (!this.bossSpawned && this.spawnQueue.length === 0 && this.aliens.length === 0 && !this.boss) {
      this.spawnBoss();
    }
  }

  private spawnAlien(alienType: AlienType, position: THREE.Vector3) {
    const alien = new Alien3D(this.scene, position, alienType, false);
    this.aliens.push(alien);
    console.log(`Spawned alien, total active: ${this.aliens.length}`);
  }

  private spawnBoss() {
    console.log(`Spawning boss for level ${this.level}`);
    this.bossSpawned = true;
    
    // Seleccionar tipo de alien para el jefe
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
    console.log(`Boss spawned with ${bossHP} HP`);
  }

  public removeAlien(alien: Alien3D) {
    const index = this.aliens.indexOf(alien);
    if (index !== -1) {
      this.aliens.splice(index, 1);
      alien.dispose();
      this.aliensDestroyed++;
      console.log(`Alien removed, destroyed: ${this.aliensDestroyed}, remaining: ${this.aliens.length}`);
    }
  }

  public removeBoss() {
    if (this.boss) {
      this.boss.dispose();
      this.boss = null;
      console.log('Boss removed');
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
      console.log('Wave completed!');
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
  }
}