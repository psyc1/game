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
    this.createAdvancedPlayerMesh();
    this.createThrusterEffect();
    
    this.mesh.position.set(0, -6, 0);
    this.initialPosition = this.mesh.position.clone();
    
    scene.add(this.mesh);
  }

  private createAdvancedPlayerMesh() {
    // Cuerpo principal de la nave - más detallado
    const bodyGeometry = new THREE.ConeGeometry(0.4, 1.5, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff88,
      emissive: 0x004422,
      shininess: 100,
      metalness: 0.8
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.x = Math.PI;
    this.mesh.add(body);
    
    // Alas principales más grandes
    const wingGeometry = new THREE.BoxGeometry(1.2, 0.15, 0.4);
    const wingMaterial = new THREE.MeshPhongMaterial({
      color: 0x0088ff,
      emissive: 0x002244,
      metalness: 0.7
    });
    
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(-0.6, -0.2, 0);
    this.mesh.add(leftWing);
    
    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(0.6, -0.2, 0);
    this.mesh.add(rightWing);
    
    // Alas traseras
    const rearWingGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.3);
    const leftRearWing = new THREE.Mesh(rearWingGeometry, wingMaterial);
    leftRearWing.position.set(-0.4, -0.8, 0);
    this.mesh.add(leftRearWing);
    
    const rightRearWing = new THREE.Mesh(rearWingGeometry, wingMaterial);
    rightRearWing.position.set(0.4, -0.8, 0);
    this.mesh.add(rightRearWing);
    
    // Cabina del piloto más grande
    const cockpitGeometry = new THREE.SphereGeometry(0.25, 12, 12);
    const cockpitMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      emissive: 0x444444,
      metalness: 0.9
    });
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.position.set(0, 0.3, 0);
    this.mesh.add(cockpit);
    
    // Motores laterales
    const engineGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.6, 8);
    const engineMaterial = new THREE.MeshPhongMaterial({
      color: 0x666666,
      emissive: 0x222222,
      metalness: 0.8
    });
    
    const leftEngine = new THREE.Mesh(engineGeometry, engineMaterial);
    leftEngine.position.set(-0.5, -0.5, 0);
    this.mesh.add(leftEngine);
    
    const rightEngine = new THREE.Mesh(engineGeometry, engineMaterial);
    rightEngine.position.set(0.5, -0.5, 0);
    this.mesh.add(rightEngine);
    
    // Cañones de armas
    const cannonGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.8, 6);
    const cannonMaterial = new THREE.MeshPhongMaterial({
      color: 0xff4400,
      emissive: 0x441100,
      metalness: 0.9
    });
    
    const leftCannon = new THREE.Mesh(cannonGeometry, cannonMaterial);
    leftCannon.position.set(-0.3, 0.5, 0);
    this.mesh.add(leftCannon);
    
    const rightCannon = new THREE.Mesh(cannonGeometry, cannonMaterial);
    rightCannon.position.set(0.3, 0.5, 0);
    this.mesh.add(rightCannon);
    
    // Resplandor del motor principal
    const glowGeometry = new THREE.SphereGeometry(0.3, 12, 12);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.set(0, -1.2, 0);
    this.mesh.add(glow);
  }

  private createThrusterEffect() {
    const particleCount = 80;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.4;
      positions[i * 3 + 1] = -1.5 - Math.random() * 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
      
      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.2, 1, 0.5 + Math.random() * 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    
    this.thrusterParticles = new THREE.Points(geometry, material);
    this.mesh.add(this.thrusterParticles);
  }

  public update(deltaTime: number) {
    if (this.shootCooldown > 0) {
      this.shootCooldown -= deltaTime;
    }
    
    // Mantener jugador dentro del área de juego (entre paneles)
    const bounds = 5; // Área más pequeña entre paneles
    this.mesh.position.x = Math.max(-bounds, Math.min(bounds, this.mesh.position.x));
    this.mesh.position.y = Math.max(-7, Math.min(-2, this.mesh.position.y));
    
    // Animar partículas del motor
    const positions = this.thrusterParticles.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] -= deltaTime * 8;
      if (positions[i + 1] < -4) {
        positions[i + 1] = -1.5;
        positions[i] = (Math.random() - 0.5) * 0.4;
        positions[i + 2] = (Math.random() - 0.5) * 0.4;
      }
    }
    this.thrusterParticles.geometry.attributes.position.needsUpdate = true;
    
    // Animación sutil de la nave
    this.mesh.rotation.z = Math.sin(Date.now() * 0.002) * 0.03;
  }

  public move(x: number, y: number) {
    this.mesh.position.x += x * 0.4;
    this.mesh.position.y += y * 0.4;
    
    // Inclinación basada en movimiento
    this.mesh.rotation.z = -x * 0.3;
  }

  public shoot(bulletManager: BulletManager3D) {
    if (this.shootCooldown <= 0) {
      const bulletPosition = this.mesh.position.clone();
      bulletPosition.y += 0.8;
      
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