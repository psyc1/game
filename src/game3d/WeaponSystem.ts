import * as THREE from 'three';
import { weaponConfigs } from '../config/weaponTypes';

export class WeaponSystem {
  private scene: THREE.Scene;
  private bullets: Array<{
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    damage: number;
    trail?: THREE.Points;
    type: 'bullet' | 'missile' | 'laser';
  }> = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public fire(position: THREE.Vector3, weaponLevel: number, audioManager?: any) {
    const config = weaponConfigs[weaponLevel] || weaponConfigs[0];
    
    // Fire spread bullets
    for (let i = 0; i < config.bulletCount; i++) {
      const bullet = this.createBullet(config, 'bullet');
      
      // Calculate spread
      let spreadAngle = 0;
      if (config.bulletCount > 1) {
        const totalSpread = config.spread;
        const angleStep = totalSpread / (config.bulletCount - 1);
        spreadAngle = -totalSpread / 2 + (i * angleStep);
      }
      
      // Position bullet
      bullet.mesh.position.copy(position);
      if (config.bulletCount > 1) {
        bullet.mesh.position.x += Math.sin(spreadAngle) * 0.5;
      }
      
      // Set velocity with spread
      const velocity = new THREE.Vector3(
        Math.sin(spreadAngle) * config.bulletSpeed * 0.3,
        config.bulletSpeed,
        0
      );
      bullet.velocity = velocity;
      
      this.scene.add(bullet.mesh);
      this.bullets.push(bullet);
    }
    
    // Fire missiles if weapon has them
    if (config.hasMissiles) {
      this.fireMissiles(position, config, audioManager);
    }
    
    // Fire lasers if weapon has them
    if (config.hasLaser) {
      this.fireLasers(position, config, audioManager);
    }
    
    // Play appropriate sound
    if (audioManager) {
      if (config.hasMissiles) {
        audioManager.playMissile();
      } else if (config.hasLaser) {
        audioManager.playLaser();
      } else {
        audioManager.playShoot();
      }
    }
  }

  private fireMissiles(position: THREE.Vector3, config: any, audioManager?: any) {
    const missilePositions = this.getMissilePositions(config.missileCount, position);
    
    missilePositions.forEach(missilePos => {
      const missile = this.createBullet(config, 'missile');
      missile.mesh.position.copy(missilePos);
      missile.velocity = new THREE.Vector3(0, config.bulletSpeed * 0.8, 0);
      missile.damage = config.damage * 3; // Missiles do more damage
      
      this.scene.add(missile.mesh);
      this.bullets.push(missile);
    });
  }

  private fireLasers(position: THREE.Vector3, config: any, audioManager?: any) {
    // Create laser beams (instant hit)
    const laserPositions = [
      position.clone().add(new THREE.Vector3(-0.8, 0, 0)),
      position.clone(),
      position.clone().add(new THREE.Vector3(0.8, 0, 0))
    ];
    
    laserPositions.forEach(laserPos => {
      const laser = this.createLaserBeam(laserPos, config);
      this.scene.add(laser.mesh);
      this.bullets.push(laser);
    });
  }

  private getMissilePositions(count: number, basePosition: THREE.Vector3): THREE.Vector3[] {
    const positions: THREE.Vector3[] = [];
    
    switch (count) {
      case 1:
        positions.push(basePosition.clone());
        break;
      case 2:
        positions.push(basePosition.clone().add(new THREE.Vector3(-0.6, 0, 0)));
        positions.push(basePosition.clone().add(new THREE.Vector3(0.6, 0, 0)));
        break;
      case 3:
        positions.push(basePosition.clone().add(new THREE.Vector3(-0.6, 0, 0)));
        positions.push(basePosition.clone());
        positions.push(basePosition.clone().add(new THREE.Vector3(0.6, 0, 0)));
        break;
    }
    
    return positions;
  }

  private createBullet(config: any, type: 'bullet' | 'missile' | 'laser') {
    let geometry: THREE.BufferGeometry;
    let material: THREE.Material;
    
    switch (type) {
      case 'missile':
        geometry = new THREE.CylinderGeometry(0.03, 0.06, 0.4, 6);
        material = new THREE.MeshBasicMaterial({
          color: 0xff4400,
          emissive: 0xff2200,
          emissiveIntensity: 0.5
        });
        break;
        
      case 'laser':
        geometry = new THREE.CylinderGeometry(0.01, 0.02, 0.6, 8);
        material = new THREE.MeshBasicMaterial({
          color: 0xff0088,
          emissive: 0xff0088,
          emissiveIntensity: 0.8
        });
        break;
        
      default: // bullet
        geometry = new THREE.SphereGeometry(config.size, 8, 8);
        material = new THREE.MeshBasicMaterial({
          color: config.color,
          emissive: config.color,
          emissiveIntensity: 0.5
        });
    }
    
    const mesh = new THREE.Mesh(geometry, material);
    
    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(config.size * 2, 8, 8);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: config.color,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    mesh.add(glow);
    
    return {
      mesh,
      velocity: new THREE.Vector3(),
      damage: config.damage,
      trail: config.trail ? this.createTrail(config.color) : undefined,
      type
    };
  }

  private createLaserBeam(position: THREE.Vector3, config: any) {
    const geometry = new THREE.CylinderGeometry(0.02, 0.02, 20, 8);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0088,
      emissive: 0xff0088,
      emissiveIntensity: 1.0,
      transparent: true,
      opacity: 0.8
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.position.y += 10; // Center the laser beam
    
    // Laser beams are instant and last briefly
    setTimeout(() => {
      this.scene.remove(mesh);
    }, 100);
    
    return {
      mesh,
      velocity: new THREE.Vector3(0, 0, 0), // Lasers don't move
      damage: config.damage * 2, // Lasers do more damage
      type: 'laser' as const
    };
  }

  private createTrail(color: number): THREE.Points {
    const trailGeometry = new THREE.BufferGeometry();
    const trailCount = 8;
    const positions = new Float32Array(trailCount * 3);
    
    for (let i = 0; i < trailCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = -i * 0.1;
      positions[i * 3 + 2] = 0;
    }
    
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const trailMaterial = new THREE.PointsMaterial({
      color: color,
      size: 0.03,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    return new THREE.Points(trailGeometry, trailMaterial);
  }

  public update(deltaTime: number) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      
      // Move bullet (except lasers)
      if (bullet.type !== 'laser') {
        bullet.mesh.position.add(bullet.velocity.clone().multiplyScalar(deltaTime));
      }
      
      // Update trail if exists
      if (bullet.trail) {
        this.updateTrail(bullet.trail);
      }
      
      // Remove bullets that are off screen
      if (bullet.mesh.position.y > 15 || bullet.mesh.position.y < -15) {
        this.removeBullet(i);
      }
    }
  }

  private updateTrail(trail: THREE.Points) {
    const positions = trail.geometry.attributes.position.array as Float32Array;
    
    // Shift trail positions
    for (let i = positions.length - 3; i >= 3; i -= 3) {
      positions[i] = positions[i - 3];
      positions[i + 1] = positions[i - 2];
      positions[i + 2] = positions[i - 1];
    }
    
    // Set new head position
    positions[0] = 0;
    positions[1] = 0;
    positions[2] = 0;
    
    trail.geometry.attributes.position.needsUpdate = true;
  }

  public removeBullet(index: number) {
    const bullet = this.bullets[index];
    if (bullet) {
      this.scene.remove(bullet.mesh);
      if (bullet.trail) {
        this.scene.remove(bullet.trail);
      }
      this.bullets.splice(index, 1);
    }
  }

  public getBullets() {
    return this.bullets;
  }

  public checkCollision(bulletIndex: number, targetPosition: THREE.Vector3, threshold: number = 0.5): boolean {
    const bullet = this.bullets[bulletIndex];
    if (!bullet) return false;
    
    const distance = bullet.mesh.position.distanceTo(targetPosition);
    return distance < threshold;
  }
}