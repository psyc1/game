import * as THREE from 'three';
import { Alien3D } from './Alien3D';
import { getWavePattern, WavePattern } from '../config/wavePatterns';
import { AlienType } from '../config/alienTypes';

export class WaveManager {
  private scene: THREE.Scene;
  private aliens: Alien3D[] = [];
  private currentWave: WavePattern | null = null;
  private spawnQueue: Array<{ alienType: AlienType; position: THREE.Vector3; delay: number }> = [];
  private spawnTimer = 0;
  private level = 1;
  private aliensDestroyed = 0;
  private totalAliensInWave = 0;
  private waveStarted = false;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public startWave(level: number) {
    console.log(`Starting wave for level ${level}`);
    this.level = level;
    this.aliensDestroyed = 0;
    this.waveStarted = true;
    
    // Limpiar aliens existentes
    this.aliens.forEach(alien => alien.dispose());
    this.aliens = [];
    
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
    let actualTotal = 0;
    
    // Contar total de aliens
    this.currentWave.composition.forEach(comp => {
      actualTotal += comp.count;
    });
    
    console.log(`Wave composition total: ${actualTotal}, Required: ${this.totalAliensInWave}`);
    
    // Generar posiciones según la formación
    const positions = this.generateFormationPositions();
    let positionIndex = 0;
    
    // Crear cola de spawn con delays más rápidos
    this.currentWave.composition.forEach(comp => {
      for (let i = 0; i < comp.count; i++) {
        if (positionIndex < positions.length) {
          this.spawnQueue.push({
            alienType: comp.alienType,
            position: positions[positionIndex],
            delay: positionIndex * 0.1 // Reducido de 0.3 a 0.1 segundos
          });
          positionIndex++;
        }
      }
    });
    
    console.log(`Spawn queue created with ${this.spawnQueue.length} aliens`);
  }

  private generateFormationPositions(): THREE.Vector3[] {
    if (!this.currentWave) return [];
    
    const positions: THREE.Vector3[] = [];
    const totalAliens = this.totalAliensInWave;
    
    switch (this.currentWave.formation) {
      case 'line':
        // Línea horizontal
        for (let i = 0; i < totalAliens; i++) {
          const x = (i - totalAliens / 2) * 1.5;
          positions.push(new THREE.Vector3(x, 12, 0));
        }
        break;
        
      case 'double_line':
        // Dos líneas
        const aliensPerRow = Math.ceil(totalAliens / 2);
        for (let i = 0; i < totalAliens; i++) {
          const row = Math.floor(i / aliensPerRow);
          const col = i % aliensPerRow;
          const x = (col - aliensPerRow / 2) * 1.5;
          const y = 12 + row * 1.5;
          positions.push(new THREE.Vector3(x, y, 0));
        }
        break;
        
      case 'v_formation':
        // Formación en V
        for (let i = 0; i < totalAliens; i++) {
          const side = i % 2 === 0 ? 1 : -1;
          const distance = Math.floor(i / 2) + 1;
          const x = side * distance * 1.2;
          const y = 12 + distance * 0.3;
          positions.push(new THREE.Vector3(x, y, 0));
        }
        break;
        
      case 'random_grid':
        // Rejilla aleatoria
        for (let i = 0; i < totalAliens; i++) {
          const x = (Math.random() - 0.5) * 12;
          const y = 12 + Math.random() * 3;
          positions.push(new THREE.Vector3(x, y, 0));
        }
        break;
        
      case 'shield_formation':
        // Formación de escudo (débiles al frente)
        const rows = Math.ceil(Math.sqrt(totalAliens));
        for (let i = 0; i < totalAliens; i++) {
          const row = Math.floor(i / rows);
          const col = i % rows;
          const x = (col - rows / 2) * 1.5;
          const y = 12 + row * 1.2;
          positions.push(new THREE.Vector3(x, y, 0));
        }
        break;
        
      default:
        // Línea por defecto
        for (let i = 0; i < totalAliens; i++) {
          const x = (i - totalAliens / 2) * 1.5;
          positions.push(new THREE.Vector3(x, 12, 0));
        }
    }
    
    return positions;
  }

  public update(deltaTime: number) {
    if (!this.waveStarted) return;
    
    // Actualizar aliens existentes
    for (let i = this.aliens.length - 1; i >= 0; i--) {
      const alien = this.aliens[i];
      alien.update(deltaTime);
      
      // Remover aliens que escaparon
      if (alien.position.y < -10) {
        this.removeAlienEscaped(alien);
      }
    }
    
    // Procesar cola de spawn más rápido
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
  }

  private spawnAlien(alienType: AlienType, position: THREE.Vector3) {
    const alien = new Alien3D(this.scene, position, alienType);
    this.aliens.push(alien);
    console.log(`Spawned alien, total active: ${this.aliens.length}`);
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

  private removeAlienEscaped(alien: Alien3D) {
    this.removeAlien(alien);
    // Notificar escape al game store
    if (typeof window !== 'undefined' && (window as any).gameStore) {
      (window as any).gameStore.getState().enemyEscaped();
    }
  }

  public getAliens(): Alien3D[] {
    return this.aliens;
  }

  public isWaveComplete(): boolean {
    // Wave is complete when all aliens are spawned AND destroyed
    const allAliensSpawned = this.spawnQueue.length === 0;
    const noAliensRemaining = this.aliens.length === 0;
    const waveComplete = allAliensSpawned && noAliensRemaining && this.waveStarted;
    
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
    this.aliens.forEach(alien => alien.dispose());
    this.aliens = [];
    this.spawnQueue = [];
  }
}