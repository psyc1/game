import * as THREE from 'three';
import { EnemyType } from '../config/enemyTypes';

export class Enemy3D {
  private mesh: THREE.Group;
  private enemyType: EnemyType;
  private animationTime = 0;
  private health: number;
  private maxHealth: number;
  private movementOffset: number;

  constructor(scene: THREE.Scene, position: THREE.Vector3, enemyType: EnemyType) {
    this.enemyType = enemyType;
    this.health = enemyType.health;
    this.maxHealth = enemyType.health;
    this.movementOffset = Math.random() * Math.PI * 2;
    
    this.mesh = new THREE.Group();
    this.createEnemyMesh();
    this.mesh.position.copy(position);
    
    scene.add(this.mesh);
  }

  private createEnemyMesh() {
    const color = new THREE.Color(this.enemyType.color);
    
    // Create different shapes based on enemy type
    let bodyGeometry: THREE.BufferGeometry;
    
    switch (this.enemyType.shape) {
      case 'triangle':
        bodyGeometry = new THREE.ConeGeometry(0.4, 0.8, 3);
        break;
      case 'diamond':
        bodyGeometry = new THREE.OctahedronGeometry(0.5);
        break;
      case 'hexagon':
        bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 6);
        break;
      case 'octagon':
        bodyGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 8);
        break;
      case 'sphere':
        bodyGeometry = new THREE.SphereGeometry(0.4, 8, 8);
        break;
      default:
        bodyGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.4);
    }
    
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color.clone().multiplyScalar(0.3),
      shininess: 100
    });
    
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.scale.setScalar(this.enemyType.size);
    this.mesh.add(body);
    
    // Add glow effect
    const glowGeometry = bodyGeometry.clone();
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.scale.setScalar(this.enemyType.size * 1.3);
    this.mesh.add(glow);

    // Add health indicator for multi-hit enemies
    if (this.maxHealth > 1) {
      this.createHealthIndicator();
    }

    // Add engine trails for some enemy types
    if (this.enemyType.id === 'interceptor' || this.enemyType.id === 'fighter') {
      this.createEngineTrails();
    }
  }

  private createHealthIndicator() {
    const geometry = new THREE.RingGeometry(0.3, 0.35, 8);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff4444,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    
    const healthRing = new THREE.Mesh(geometry, material);
    healthRing.position.y = 0.8;
    healthRing.rotation.x = Math.PI / 2;
    this.mesh.add(healthRing);
  }

  private createEngineTrails() {
    const trailGeometry = new THREE.CylinderGeometry(0.05, 0.1, 0.5, 6);
    const trailMaterial = new THREE.MeshBasicMaterial({
      color: this.enemyType.color,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    const leftTrail = new THREE.Mesh(trailGeometry, trailMaterial);
    leftTrail.position.set(-0.3, -0.5, 0);
    this.mesh.add(leftTrail);
    
    const rightTrail = new THREE.Mesh(trailGeometry, trailMaterial);
    rightTrail.position.set(0.3, -0.5, 0);
    this.mesh.add(rightTrail);
  }

  public update(deltaTime: number) {
    this.animationTime += deltaTime;
    
    // Movement based on pattern
    const baseSpeed = this.enemyType.speed * deltaTime * 2;
    
    switch (this.enemyType.movementPattern) {
      case 'linear':
        this.mesh.position.y -= baseSpeed;
        // Gentle floating
        this.mesh.position.x += Math.sin(this.animationTime + this.movementOffset) * deltaTime * 0.3;
        break;
        
      case 'zigzag':
        this.mesh.position.y -= baseSpeed * 0.8;
        this.mesh.position.x += Math.sin(this.animationTime * 3 + this.movementOffset) * deltaTime * 2;
        break;
        
      case 'sine':
        this.mesh.position.y -= baseSpeed * 0.9;
        this.mesh.position.x += Math.sin(this.animationTime * 2 + this.movementOffset) * deltaTime * 1.5;
        this.mesh.position.z += Math.cos(this.animationTime * 2 + this.movementOffset) * deltaTime * 0.5;
        break;
        
      case 'spiral':
        this.mesh.position.y -= baseSpeed * 0.7;
        const radius = 1.5;
        this.mesh.position.x += Math.cos(this.animationTime * 2 + this.movementOffset) * deltaTime * radius;
        this.mesh.position.z += Math.sin(this.animationTime * 2 + this.movementOffset) * deltaTime * radius * 0.5;
        break;
        
      case 'aggressive':
        // Move faster and more directly toward player
        this.mesh.position.y -= baseSpeed * 1.5;
        // Slight homing behavior
        if (this.mesh.position.x > 0) {
          this.mesh.position.x -= deltaTime * 0.5;
        } else {
          this.mesh.position.x += deltaTime * 0.5;
        }
        break;
        
      default:
        this.mesh.position.y -= baseSpeed;
    }
    
    // Rotation animation
    this.mesh.rotation.y += deltaTime * 2;
    this.mesh.rotation.z = Math.sin(this.animationTime * 3) * 0.1;
    
    // Pulsing effect
    const scale = this.enemyType.size * (1 + Math.sin(this.animationTime * 4) * 0.1);
    this.mesh.scale.setScalar(scale);
  }

  public takeDamage(damage: number): boolean {
    this.health -= damage;
    
    // Update health indicator color
    if (this.maxHealth > 1) {
      const healthPercentage = this.health / this.maxHealth;
      const healthRing = this.mesh.children.find(child => 
        child instanceof THREE.Mesh && child.geometry instanceof THREE.RingGeometry
      ) as THREE.Mesh;
      
      if (healthRing) {
        const material = healthRing.material as THREE.MeshBasicMaterial;
        if (healthPercentage > 0.6) {
          material.color.setHex(0x00ff00);
        } else if (healthPercentage > 0.3) {
          material.color.setHex(0xffff00);
        } else {
          material.color.setHex(0xff0000);
        }
      }
    }
    
    return this.health <= 0;
  }

  public getScore(): number {
    return this.enemyType.score;
  }

  public getDamage(): number {
    return this.enemyType.damage;
  }

  public getColor(): string {
    return this.enemyType.color;
  }

  public get position(): THREE.Vector3 {
    return this.mesh.position;
  }

  public dispose() {
    if (this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
    }
  }
}