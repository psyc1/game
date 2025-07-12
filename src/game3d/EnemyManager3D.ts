import * as THREE from 'three';
import { Enemy3D } from './Enemy3D';
import { NivelConfig } from '../config/nivelesConfig';
import { enemigosTipos } from '../config/enemigosTipos';

export class EnemyManager3D {
  private scene: THREE.Scene;
  private enemies: Enemy3D[] = [];
  private spawnTimer = 0;
  private spawnInterval = 2; // Spawn every 2 seconds
  private currentLevel: NivelConfig | null = null;
  private enemiesSpawned = 0;
  private maxEnemiesForLevel = 0;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public createLevel(levelConfig: NivelConfig) {
    // Clear existing enemies
    this.enemies.forEach(enemy => enemy.dispose());
    this.enemies = [];
    
    this.currentLevel = levelConfig;
    this.enemiesSpawned = 0;
    this.maxEnemiesForLevel = Math.floor(
      Math.random() * (levelConfig.cantidadEnemigosRango[1] - levelConfig.cantidadEnemigosRango[0] + 1) + 
      levelConfig.cantidadEnemigosRango[0]
    );
    
    // Adjust spawn rate based on level
    this.spawnInterval = Math.max(0.5, 2 - (levelConfig.nivel - 1) * 0.02);
  }

  public update(deltaTime: number) {
    // Update existing enemies
    this.enemies.forEach(enemy => {
      enemy.update(deltaTime);
    });
    
    // Remove enemies that are too far down or destroyed
    this.enemies = this.enemies.filter(enemy => {
      if (enemy.position.y < -10) {
        enemy.dispose();
        return false;
      }
      return true;
    });
    
    // Spawn new enemies if level is active
    if (this.currentLevel && this.enemiesSpawned < this.maxEnemiesForLevel) {
      this.spawnTimer += deltaTime;
      
      if (this.spawnTimer >= this.spawnInterval) {
        this.spawnRandomEnemy();
        this.spawnTimer = 0;
      }
    }
  }

  private spawnRandomEnemy() {
    if (!this.currentLevel) return;
    
    // Random enemy type from allowed types
    const allowedTypes = this.currentLevel.tiposEnemigosPermitidos;
    const typeId = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
    const enemyType = enemigosTipos.find(type => type.id === typeId) || enemigosTipos[0];
    
    // Random spawn position at top of screen
    const spawnX = (Math.random() - 0.5) * 16; // Random X between -8 and 8
    const spawnY = 10; // Start above screen
    const spawnZ = (Math.random() - 0.5) * 4; // Some depth variation
    
    const spawnPosition = new THREE.Vector3(spawnX, spawnY, spawnZ);
    const enemy = new Enemy3D(this.scene, spawnPosition, enemyType);
    
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

  public getEnemies(): Enemy3D[] {
    return this.enemies;
  }

  public isEmpty(): boolean {
    return this.enemiesSpawned >= this.maxEnemiesForLevel && this.enemies.length === 0;
  }

  public isLevelComplete(): boolean {
    return this.isEmpty();
  }
}