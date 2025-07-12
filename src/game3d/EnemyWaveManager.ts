import * as THREE from 'three';
import { Enemy3D } from './Enemy3D';
import { enemyTypes, EnemyType } from '../config/enemyTypes';

interface WaveFormation {
  enemies: Array<{
    type: EnemyType;
    position: THREE.Vector3;
    delay: number;
  }>;
}

export class EnemyWaveManager {
  private scene: THREE.Scene;
  private enemies: Enemy3D[] = [];
  private level = 1;
  private spawnTimer = 0;
  private currentWave: WaveFormation | null = null;
  private waveIndex = 0;
  private enemiesSpawned = 0;
  private totalEnemiesForLevel = 200;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public startWave(level: number) {
    this.level = level;
    this.spawnTimer = 0;
    this.waveIndex = 0;
    this.enemiesSpawned = 0;
    this.totalEnemiesForLevel = 200;
    
    // Clear existing enemies
    this.enemies.forEach(enemy => enemy.dispose());
    this.enemies = [];
    
    this.generateNextWave();
  }

  private generateNextWave(): void {
    if (this.enemiesSpawned >= this.totalEnemiesForLevel) {
      this.currentWave = null;
      return;
    }

    // Determine available enemy types based on level
    let availableTypes = [enemyTypes[0]]; // Scout always available
    if (this.level > 2) availableTypes.push(enemyTypes[1]); // Fighter
    if (this.level > 5) availableTypes.push(enemyTypes[2]); // Interceptor
    if (this.level > 8) availableTypes.push(enemyTypes[3]); // Destroyer
    if (this.level > 12) availableTypes.push(enemyTypes[4]); // Battleship

    // Generate wave formation
    const formations = ['line', 'v_formation', 'diamond', 'scattered', 'swarm'];
    const formation = formations[Math.floor(Math.random() * formations.length)];
    
    const waveSize = Math.min(8 + Math.floor(this.level / 3), 15);
    const remainingEnemies = this.totalEnemiesForLevel - this.enemiesSpawned;
    const actualWaveSize = Math.min(waveSize, remainingEnemies);
    
    this.currentWave = this.createFormation(formation, actualWaveSize, availableTypes);
  }

  private createFormation(type: string, size: number, availableTypes: EnemyType[]): WaveFormation {
    const enemies: WaveFormation['enemies'] = [];
    
    switch (type) {
      case 'line':
        for (let i = 0; i < size; i++) {
          const x = (i - size / 2) * 1.5;
          const enemyType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
          enemies.push({
            type: enemyType,
            position: new THREE.Vector3(x, 12, 0),
            delay: i * 0.3
          });
        }
        break;

      case 'v_formation':
        for (let i = 0; i < size; i++) {
          const side = i % 2 === 0 ? 1 : -1;
          const distance = Math.floor(i / 2) + 1;
          const x = side * distance * 1.2;
          const y = 12 + distance * 0.5;
          const enemyType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
          enemies.push({
            type: enemyType,
            position: new THREE.Vector3(x, y, 0),
            delay: i * 0.2
          });
        }
        break;

      case 'diamond':
        const rows = Math.ceil(Math.sqrt(size));
        for (let i = 0; i < size; i++) {
          const row = Math.floor(i / rows);
          const col = i % rows;
          const x = (col - rows / 2) * 1.5;
          const y = 12 + row * 1.5;
          const enemyType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
          enemies.push({
            type: enemyType,
            position: new THREE.Vector3(x, y, 0),
            delay: (row + col) * 0.15
          });
        }
        break;

      case 'swarm':
        for (let i = 0; i < size; i++) {
          const angle = (i / size) * Math.PI * 2;
          const radius = 2 + Math.random() * 3;
          const x = Math.cos(angle) * radius;
          const y = 12 + Math.sin(angle) * radius * 0.5;
          const z = (Math.random() - 0.5) * 2;
          const enemyType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
          enemies.push({
            type: enemyType,
            position: new THREE.Vector3(x, y, z),
            delay: Math.random() * 1.5
          });
        }
        break;

      default: // scattered
        for (let i = 0; i < size; i++) {
          const x = (Math.random() - 0.5) * 14;
          const y = 12 + Math.random() * 4;
          const z = (Math.random() - 0.5) * 3;
          const enemyType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
          enemies.push({
            type: enemyType,
            position: new THREE.Vector3(x, y, z),
            delay: Math.random() * 2
          });
        }
    }

    return { enemies };
  }

  public update(deltaTime: number) {
    // Update existing enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(deltaTime);
      
      // Remove enemies that escaped
      if (enemy.position.y < -10) {
        this.removeEnemyEscaped(enemy);
      }
    }
    
    // Spawn enemies from current wave
    if (this.currentWave && this.waveIndex < this.currentWave.enemies.length) {
      this.spawnTimer += deltaTime;
      
      const nextEnemy = this.currentWave.enemies[this.waveIndex];
      if (this.spawnTimer >= nextEnemy.delay) {
        this.spawnEnemy(nextEnemy.type, nextEnemy.position);
        this.waveIndex++;
        this.spawnTimer = 0;
      }
    } else if (this.currentWave && this.waveIndex >= this.currentWave.enemies.length) {
      // Current wave finished, generate next wave after delay
      this.spawnTimer += deltaTime;
      if (this.spawnTimer >= 3) { // 3 second delay between waves
        this.generateNextWave();
        this.spawnTimer = 0;
        this.waveIndex = 0;
      }
    }
  }

  private spawnEnemy(enemyType: EnemyType, position: THREE.Vector3) {
    if (this.enemiesSpawned >= this.totalEnemiesForLevel) return;
    
    const enemy = new Enemy3D(this.scene, position, enemyType);
    this.enemies.push(enemy);
    this.enemiesSpawned++;
  }

  public removeEnemy(enemy: Enemy3D) {
    const index = this.enemies.indexOf(enemy);
    if (index !== -1) {
      this.enemies.splice(index, 1);
      enemy.dispose();
    }
  }

  private removeEnemyEscaped(enemy: Enemy3D) {
    this.removeEnemy(enemy);
    // Notify game that enemy escaped
    if (typeof window !== 'undefined' && (window as any).gameStore) {
      (window as any).gameStore.getState().enemyEscaped();
    }
  }

  public getEnemies(): Enemy3D[] {
    return this.enemies;
  }

  public isWaveComplete(): boolean {
    return this.enemiesSpawned >= this.totalEnemiesForLevel && this.enemies.length === 0;
  }

  public getProgress(): { spawned: number; total: number; remaining: number } {
    return {
      spawned: this.enemiesSpawned,
      total: this.totalEnemiesForLevel,
      remaining: this.enemies.length
    };
  }
}