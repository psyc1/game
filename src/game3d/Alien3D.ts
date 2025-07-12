import * as THREE from 'three';
import { AlienType } from '../config/alienTypes';

export class Alien3D {
  private mesh: THREE.Group;
  private alienType: AlienType;
  private currentHP: number;
  private maxHP: number;
  private animationTime = 0;
  private movementOffset: number;
  private healthIndicator?: THREE.Mesh;

  constructor(scene: THREE.Scene, position: THREE.Vector3, alienType: AlienType) {
    this.alienType = alienType;
    this.currentHP = alienType.hp;
    this.maxHP = alienType.hp;
    this.movementOffset = Math.random() * Math.PI * 2;
    
    this.mesh = new THREE.Group();
    this.createAlienMesh();
    this.mesh.position.copy(position);
    
    scene.add(this.mesh);
  }

  private createAlienMesh() {
    const color = new THREE.Color(this.alienType.color);
    
    // Crear geometría según la forma
    let bodyGeometry: THREE.BufferGeometry;
    
    switch (this.alienType.shape) {
      case 'circle':
        bodyGeometry = new THREE.SphereGeometry(0.4, 12, 12);
        break;
      case 'oval':
        bodyGeometry = new THREE.SphereGeometry(0.4, 12, 8);
        bodyGeometry.scale(1, 0.7, 1);
        break;
      case 'triangle':
        bodyGeometry = new THREE.ConeGeometry(0.4, 0.8, 3);
        break;
      case 'diamond':
        bodyGeometry = new THREE.OctahedronGeometry(0.4);
        break;
      case 'hexagon':
        bodyGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 6);
        break;
      default:
        bodyGeometry = new THREE.SphereGeometry(0.4, 12, 12);
    }
    
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color.clone().multiplyScalar(0.2),
      shininess: 100
    });
    
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.scale.setScalar(this.alienType.size);
    this.mesh.add(body);
    
    // Efecto de brillo
    const glowGeometry = bodyGeometry.clone();
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.scale.setScalar(this.alienType.size * 1.2);
    this.mesh.add(glow);

    // Indicador de vida para aliens con más de 1 HP
    if (this.maxHP > 1) {
      this.createHealthIndicator();
    }
  }

  private createHealthIndicator() {
    const geometry = new THREE.RingGeometry(0.3, 0.35, 8);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    
    this.healthIndicator = new THREE.Mesh(geometry, material);
    this.healthIndicator.position.y = 0.6 * this.alienType.size;
    this.healthIndicator.rotation.x = Math.PI / 2;
    this.mesh.add(this.healthIndicator);
  }

  private updateHealthIndicator() {
    if (!this.healthIndicator) return;
    
    const healthPercentage = this.currentHP / this.maxHP;
    const material = this.healthIndicator.material as THREE.MeshBasicMaterial;
    
    if (healthPercentage > 0.6) {
      material.color.setHex(0x00ff00); // Verde
    } else if (healthPercentage > 0.3) {
      material.color.setHex(0xffff00); // Amarillo
    } else {
      material.color.setHex(0xff0000); // Rojo
    }
  }

  public update(deltaTime: number) {
    this.animationTime += deltaTime;
    
    // Movimiento hacia abajo con flotación suave
    const baseSpeed = this.alienType.speed * deltaTime * 1.5;
    this.mesh.position.y -= baseSpeed;
    
    // Movimiento de flotación lateral suave
    this.mesh.position.x += Math.sin(this.animationTime * 2 + this.movementOffset) * deltaTime * 0.5;
    
    // Rotación suave
    this.mesh.rotation.y += deltaTime * 1;
    this.mesh.rotation.z = Math.sin(this.animationTime * 3) * 0.1;
    
    // Efecto de pulsación
    const scale = this.alienType.size * (1 + Math.sin(this.animationTime * 4) * 0.05);
    this.mesh.scale.setScalar(scale);
  }

  public takeDamage(damage: number): boolean {
    this.currentHP -= damage;
    this.updateHealthIndicator();
    
    // Efecto visual de daño
    const material = this.mesh.children[0] as THREE.Mesh;
    if (material && material.material) {
      const mat = material.material as THREE.MeshPhongMaterial;
      mat.emissiveIntensity = 0.5;
      setTimeout(() => {
        mat.emissiveIntensity = 0.2;
      }, 100);
    }
    
    return this.currentHP <= 0;
  }

  public getScore(): number {
    return this.alienType.score;
  }

  public getDamage(): number {
    return 10; // Daño estándar por contacto
  }

  public getColor(): string {
    return this.alienType.color;
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