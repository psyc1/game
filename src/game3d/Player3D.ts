import * as THREE from 'three';
import { BulletManager3D } from './BulletManager3D';

export class Player3D {
  private mesh: THREE.Group;
  private initialPosition: THREE.Vector3;
  private shootCooldown = 0;
  private maxShootCooldown = 0.15;
  private thrusterParticles: THREE.Points;

  constructor(scene: THREE.Scene) {
    this.mesh = new THREE.Group();
    this.createPlayerMesh();
    this.createThrusterEffect();
    
    this.mesh.position.set(0, -6, 0);
    this.initialPosition = this.mesh.position.clone();
    
    scene.add(this.mesh);
  }

  private createPlayerMesh() {
    // Main body
    const bodyGeometry = new THREE.ConeGeometry(0.3, 1.2, 6);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff88,
      emissive: 0x004422,
      shininess: 100
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.x = Math.PI;
    this.mesh.add(body);
    
    // Wings
    const wingGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.3);
    const wingMaterial = new THREE.MeshPhongMaterial({
      color: 0x0088ff,
      emissive: 0x002244
    });
    
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(-0.4, -0.2, 0);
    this.mesh.add(leftWing);
    
    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(0.4, -0.2, 0);
    this.mesh.add(rightWing);
    
    // Cockpit
    const cockpitGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const cockpitMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      emissive: 0x444444
    });
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.position.set(0, 0.2, 0);
    this.mesh.add(cockpit);
    
    // Engine glow
    const glowGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.set(0, -0.8, 0);
    this.mesh.add(glow);
  }

  private createThrusterEffect() {
    const particleCount = 50;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 1] = -1 - Math.random() * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
      
      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.1, 1, 0.5 + Math.random() * 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    this.thrusterParticles = new THREE.Points(geometry, material);
    this.mesh.add(this.thrusterParticles);
  }

  public update(deltaTime: number) {
    // Update shoot cooldown
    if (this.shootCooldown > 0) {
      this.shootCooldown -= deltaTime;
    }
    
    // Keep player within bounds
    const bounds = 8;
    this.mesh.position.x = Math.max(-bounds, Math.min(bounds, this.mesh.position.x));
    this.mesh.position.y = Math.max(-7, Math.min(-2, this.mesh.position.y));
    
    // Animate thruster particles
    const positions = this.thrusterParticles.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] -= deltaTime * 5; // Move particles down
      if (positions[i + 1] < -3) {
        positions[i + 1] = -1;
        positions[i] = (Math.random() - 0.5) * 0.2;
        positions[i + 2] = (Math.random() - 0.5) * 0.2;
      }
    }
    this.thrusterParticles.geometry.attributes.position.needsUpdate = true;
    
    // Subtle ship animation
    this.mesh.rotation.z = Math.sin(Date.now() * 0.001) * 0.05;
  }

  public move(x: number, y: number) {
    // Movimiento más suave y controlado
    this.mesh.position.x += x * 0.3; // Reducir velocidad de movimiento
    this.mesh.position.y += y * 0.3;
    
    // Tilt ship based on movement
    this.mesh.rotation.z = -x * 0.5; // Menos inclinación
  }

  public shoot(bulletManager: BulletManager3D) {
    if (this.shootCooldown <= 0) {
      const bulletPosition = this.mesh.position.clone();
      bulletPosition.y += 0.5;
      
      bulletManager.createPlayerBullet(bulletPosition);
      this.shootCooldown = this.maxShootCooldown;
    }
  }

  public reset() {
    this.mesh.position.copy(this.initialPosition);
    this.mesh.rotation.set(0, 0, 0);
  }

  public get position(): THREE.Vector3 {
    return this.mesh.position;
  }
}