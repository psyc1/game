import * as THREE from 'three';
import { powerUpTypes, PowerUpType } from '../config/powerUpTypes';

interface PowerUp {
  mesh: THREE.Group;
  type: PowerUpType;
  rotationSpeed: number;
  floatOffset: number;
}

export class PowerUpManager {
  private scene: THREE.Scene;
  private powerUps: PowerUp[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public update(deltaTime: number) {
    // Update existing power-ups
    this.powerUps.forEach(powerUp => {
      // Move downward slowly
      powerUp.mesh.position.y -= deltaTime * 1.5;
      
      // Rotate for visual effect
      powerUp.mesh.rotation.y += powerUp.rotationSpeed * deltaTime;
      
      // Floating animation
      powerUp.floatOffset += deltaTime * 3;
      powerUp.mesh.position.y += Math.sin(powerUp.floatOffset) * deltaTime * 0.3;
      
      // Pulsing scale effect
      const scale = 1 + Math.sin(powerUp.floatOffset * 2) * 0.1;
      powerUp.mesh.scale.setScalar(scale);
    });
    
    // Remove power-ups that are off screen
    this.powerUps = this.powerUps.filter(powerUp => {
      if (powerUp.mesh.position.y < -10) {
        this.scene.remove(powerUp.mesh);
        return false;
      }
      return true;
    });
  }

  public spawnRandomPowerUp() {
    const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    
    // Random spawn position at top of screen
    const spawnX = (Math.random() - 0.5) * 12;
    const spawnY = 10;
    const spawnZ = (Math.random() - 0.5) * 2;
    
    const powerUp = this.createPowerUpMesh(randomType);
    powerUp.mesh.position.set(spawnX, spawnY, spawnZ);
    
    this.scene.add(powerUp.mesh);
    this.powerUps.push(powerUp);
  }

  private createPowerUpMesh(type: PowerUpType): PowerUp {
    const group = new THREE.Group();
    
    // Main crystal shape based on type
    let geometry: THREE.BufferGeometry;
    
    switch (type.effect) {
      case 'weapon':
        geometry = new THREE.OctahedronGeometry(0.3);
        break;
      case 'health':
        geometry = new THREE.SphereGeometry(0.25, 8, 8);
        break;
      case 'shield':
        geometry = new THREE.CylinderGeometry(0.2, 0.3, 0.4, 6);
        break;
      default:
        geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    }
    
    const color = new THREE.Color(type.color);
    
    const material = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color.clone().multiplyScalar(0.4),
      transparent: true,
      opacity: 0.9,
      shininess: 100
    });
    
    const crystal = new THREE.Mesh(geometry, material);
    group.add(crystal);
    
    // Outer glow
    const glowGeometry = new THREE.SphereGeometry(0.5);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    group.add(glow);
    
    // Energy ring effect
    const ringGeometry = new THREE.RingGeometry(0.4, 0.6, 16);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
    
    // Particle effect
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 20;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 0.8 + Math.random() * 0.4;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: color,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particles);
    
    return {
      mesh: group,
      type: type,
      rotationSpeed: 2 + Math.random() * 2,
      floatOffset: Math.random() * Math.PI * 2
    };
  }

  public checkCollisions(playerPosition: THREE.Vector3): PowerUpType | null {
    for (let i = this.powerUps.length - 1; i >= 0; i--) {
      const powerUp = this.powerUps[i];
      const distance = powerUp.mesh.position.distanceTo(playerPosition);
      
      if (distance < 0.8) {
        // Collision detected
        const type = powerUp.type;
        
        // Remove power-up
        this.scene.remove(powerUp.mesh);
        this.powerUps.splice(i, 1);
        
        return type;
      }
    }
    
    return null;
  }

  public getPowerUps(): PowerUp[] {
    return this.powerUps;
  }
}