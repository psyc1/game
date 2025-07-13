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
  private isBoss: boolean;

  constructor(scene: THREE.Scene, position: THREE.Vector3, alienType: AlienType, isBoss: boolean = false) {
    this.alienType = alienType;
    this.currentHP = alienType.hp;
    this.maxHP = alienType.hp;
    this.movementOffset = Math.random() * Math.PI * 2;
    this.isBoss = isBoss;
    
    this.mesh = new THREE.Group();
    this.createAlienMesh();
    this.mesh.position.copy(position);
    
    scene.add(this.mesh);
  }

  private createAlienMesh() {
    const color = new THREE.Color(this.alienType.color);
    const size = this.isBoss ? this.alienType.size * 3 : this.alienType.size;
    
    // Crear cuerpo principal del alien
    this.createAlienBody(color, size);
    
    // Agregar detalles según el tipo
    this.addAlienDetails(color, size);
    
    // Efecto de brillo
    this.addGlowEffect(color, size);
    
    // Indicador de vida para aliens con más de 1 HP o jefes
    if (this.maxHP > 1 || this.isBoss) {
      this.createHealthIndicator(size);
    }
  }

  private createAlienBody(color: THREE.Color, size: number) {
    let bodyGeometry: THREE.BufferGeometry;
    
    switch (this.alienType.shape) {
      case 'circle':
        // Alien esférico con tentáculos
        bodyGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        break;
      case 'oval':
        // Alien ovalado tipo medusa
        bodyGeometry = new THREE.SphereGeometry(0.4, 16, 12);
        bodyGeometry.scale(1, 0.7, 1.2);
        break;
      case 'triangle':
        // Alien triangular tipo nave
        bodyGeometry = new THREE.ConeGeometry(0.4, 0.8, 6);
        break;
      case 'diamond':
        // Alien cristalino
        bodyGeometry = new THREE.OctahedronGeometry(0.4);
        break;
      case 'hexagon':
        // Alien hexagonal tipo insecto
        bodyGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 6);
        break;
      default:
        bodyGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    }
    
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color.clone().multiplyScalar(0.3),
      shininess: 100,
      transparent: true,
      opacity: 0.9
    });
    
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.scale.setScalar(size);
    this.mesh.add(body);
  }

  private addAlienDetails(color: THREE.Color, size: number) {
    // Ojos alienígenas
    this.addAlienEyes(color, size);
    
    // Tentáculos o apéndices según el tipo
    if (this.alienType.shape === 'circle' || this.alienType.shape === 'oval') {
      this.addTentacles(color, size);
    }
    
    // Alas para aliens triangulares
    if (this.alienType.shape === 'triangle') {
      this.addWings(color, size);
    }
    
    // Cristales para aliens diamante
    if (this.alienType.shape === 'diamond') {
      this.addCrystals(color, size);
    }
    
    // Patas para aliens hexagonales
    if (this.alienType.shape === 'hexagon') {
      this.addLegs(color, size);
    }
  }

  private addAlienEyes(color: THREE.Color, size: number) {
    const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const eyeMaterial = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      emissive: 0x440000,
      shininess: 200
    });
    
    // Ojo izquierdo
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15 * size, 0.2 * size, 0.3 * size);
    this.mesh.add(leftEye);
    
    // Ojo derecho
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15 * size, 0.2 * size, 0.3 * size);
    this.mesh.add(rightEye);
    
    // Ojo central para jefes
    if (this.isBoss) {
      const centerEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      centerEye.position.set(0, 0.3 * size, 0.35 * size);
      centerEye.scale.setScalar(1.5);
      this.mesh.add(centerEye);
    }
  }

  private addTentacles(color: THREE.Color, size: number) {
    const tentacleCount = this.isBoss ? 8 : 4;
    
    for (let i = 0; i < tentacleCount; i++) {
      const tentacleGeometry = new THREE.CylinderGeometry(0.02, 0.05, 0.6, 6);
      const tentacleMaterial = new THREE.MeshPhongMaterial({
        color: color.clone().multiplyScalar(0.8),
        emissive: color.clone().multiplyScalar(0.1)
      });
      
      const tentacle = new THREE.Mesh(tentacleGeometry, tentacleMaterial);
      const angle = (i / tentacleCount) * Math.PI * 2;
      tentacle.position.set(
        Math.cos(angle) * 0.3 * size,
        -0.4 * size,
        Math.sin(angle) * 0.3 * size
      );
      tentacle.rotation.z = angle;
      tentacle.scale.setScalar(size);
      this.mesh.add(tentacle);
    }
  }

  private addWings(color: THREE.Color, size: number) {
    const wingGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.3);
    const wingMaterial = new THREE.MeshPhongMaterial({
      color: color.clone().multiplyScalar(0.7),
      transparent: true,
      opacity: 0.8
    });
    
    // Ala izquierda
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(-0.4 * size, 0, 0);
    leftWing.scale.setScalar(size);
    this.mesh.add(leftWing);
    
    // Ala derecha
    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(0.4 * size, 0, 0);
    rightWing.scale.setScalar(size);
    this.mesh.add(rightWing);
  }

  private addCrystals(color: THREE.Color, size: number) {
    const crystalCount = this.isBoss ? 6 : 3;
    
    for (let i = 0; i < crystalCount; i++) {
      const crystalGeometry = new THREE.OctahedronGeometry(0.1);
      const crystalMaterial = new THREE.MeshPhongMaterial({
        color: color.clone().offsetHSL(0.1, 0, 0.2),
        emissive: color.clone().multiplyScalar(0.2),
        transparent: true,
        opacity: 0.8
      });
      
      const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
      const angle = (i / crystalCount) * Math.PI * 2;
      crystal.position.set(
        Math.cos(angle) * 0.5 * size,
        Math.sin(angle * 2) * 0.2 * size,
        Math.sin(angle) * 0.5 * size
      );
      crystal.scale.setScalar(size);
      this.mesh.add(crystal);
    }
  }

  private addLegs(color: THREE.Color, size: number) {
    const legCount = 6;
    
    for (let i = 0; i < legCount; i++) {
      const legGeometry = new THREE.CylinderGeometry(0.03, 0.06, 0.5, 6);
      const legMaterial = new THREE.MeshPhongMaterial({
        color: color.clone().multiplyScalar(0.6),
        emissive: color.clone().multiplyScalar(0.1)
      });
      
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      const angle = (i / legCount) * Math.PI * 2;
      leg.position.set(
        Math.cos(angle) * 0.4 * size,
        -0.5 * size,
        Math.sin(angle) * 0.4 * size
      );
      leg.rotation.z = Math.cos(angle) * 0.3;
      leg.scale.setScalar(size);
      this.mesh.add(leg);
    }
  }

  private addGlowEffect(color: THREE.Color, size: number) {
    const glowGeometry = new THREE.SphereGeometry(0.6, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: this.isBoss ? 0.4 : 0.2,
      blending: THREE.AdditiveBlending
    });
    
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.scale.setScalar(size);
    this.mesh.add(glow);
  }

  private createHealthIndicator(size: number) {
    const geometry = new THREE.RingGeometry(0.4, 0.5, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    
    this.healthIndicator = new THREE.Mesh(geometry, material);
    this.healthIndicator.position.y = 0.8 * size;
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
    
    // Movimiento hacia abajo
    const baseSpeed = this.alienType.speed * deltaTime * (this.isBoss ? 0.5 : 1.5);
    this.mesh.position.y -= baseSpeed;
    
    // Movimiento lateral para aliens normales
    if (!this.isBoss) {
      this.mesh.position.x += Math.sin(this.animationTime * 2 + this.movementOffset) * deltaTime * 0.5;
    }
    
    // Rotación y animaciones
    this.mesh.rotation.y += deltaTime * (this.isBoss ? 0.5 : 1);
    this.mesh.rotation.z = Math.sin(this.animationTime * 3) * 0.1;
    
    // Efecto de pulsación
    const scale = (this.isBoss ? this.alienType.size * 3 : this.alienType.size) * (1 + Math.sin(this.animationTime * 4) * 0.05);
    this.mesh.scale.setScalar(scale);
    
    // Animación especial para jefes
    if (this.isBoss) {
      this.mesh.position.x = Math.sin(this.animationTime * 0.5) * 2;
      this.mesh.position.z = Math.cos(this.animationTime * 0.3) * 1;
    }
  }

  public takeDamage(damage: number): boolean {
    this.currentHP -= damage;
    this.updateHealthIndicator();
    
    // Efecto visual de daño
    const material = this.mesh.children[0] as THREE.Mesh;
    if (material && material.material) {
      const mat = material.material as THREE.MeshPhongMaterial;
      mat.emissiveIntensity = 0.8;
      setTimeout(() => {
        mat.emissiveIntensity = 0.3;
      }, 100);
    }
    
    return this.currentHP <= 0;
  }

  public getScore(): number {
    return this.isBoss ? this.alienType.score * 10 : this.alienType.score;
  }

  public getDamage(): number {
    return this.isBoss ? 25 : 10;
  }

  public getColor(): string {
    return this.alienType.color;
  }

  public get position(): THREE.Vector3 {
    return this.mesh.position;
  }

  public get isBossAlien(): boolean {
    return this.isBoss;
  }

  public dispose() {
    if (this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
    }
  }
}