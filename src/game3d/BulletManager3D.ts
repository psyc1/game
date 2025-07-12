import * as THREE from 'three';

interface Bullet3D {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  isPlayer: boolean;
  trail: THREE.Points;
}

export class BulletManager3D {
  private scene: THREE.Scene;
  private bullets: Bullet3D[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public createPlayerBullet(position: THREE.Vector3) {
    // Main bullet
    const geometry = new THREE.CylinderGeometry(0.02, 0.05, 0.3, 6);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      emissive: 0x004444
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.rotation.x = Math.PI / 2;
    
    this.scene.add(mesh);
    
    // Create trail effect
    const trail = this.createTrail(0x00ffff);
    mesh.add(trail);
    
    const bullet: Bullet3D = {
      mesh,
      velocity: new THREE.Vector3(0, 15, 0),
      isPlayer: true,
      trail
    };
    
    this.bullets.push(bullet);
  }

  public createEnemyBullet(position: THREE.Vector3) {
    const geometry = new THREE.SphereGeometry(0.08, 6, 6);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff4444,
      emissive: 0x440000
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    
    this.scene.add(mesh);
    
    // Create trail effect
    const trail = this.createTrail(0xff4444);
    mesh.add(trail);
    
    const bullet: Bullet3D = {
      mesh,
      velocity: new THREE.Vector3(0, -10, 0),
      isPlayer: false,
      trail
    };
    
    this.bullets.push(bullet);
  }

  private createTrail(color: number): THREE.Points {
    const trailGeometry = new THREE.BufferGeometry();
    const trailCount = 10;
    const positions = new Float32Array(trailCount * 3);
    
    for (let i = 0; i < trailCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = -i * 0.1;
      positions[i * 3 + 2] = 0;
    }
    
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const trailMaterial = new THREE.PointsMaterial({
      color: color,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    return new THREE.Points(trailGeometry, trailMaterial);
  }

  public update(deltaTime: number) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      
      // Move bullet
      bullet.mesh.position.add(bullet.velocity.clone().multiplyScalar(deltaTime));
      
      // Update trail
      this.updateTrail(bullet);
      
      // Remove bullets that are off screen
      if (bullet.mesh.position.y > 15 || bullet.mesh.position.y < -15) {
        this.removeBullet(bullet);
      }
    }
  }

  private updateTrail(bullet: Bullet3D) {
    const positions = bullet.trail.geometry.attributes.position.array as Float32Array;
    
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
    
    bullet.trail.geometry.attributes.position.needsUpdate = true;
  }

  public removeBullet(bullet: Bullet3D) {
    const index = this.bullets.indexOf(bullet);
    if (index !== -1) {
      this.bullets.splice(index, 1);
      this.scene.remove(bullet.mesh);
    }
  }

  public getPlayerBullets(): Bullet3D[] {
    return this.bullets.filter(bullet => bullet.isPlayer);
  }

  public getEnemyBullets(): Bullet3D[] {
    return this.bullets.filter(bullet => !bullet.isPlayer);
  }
}