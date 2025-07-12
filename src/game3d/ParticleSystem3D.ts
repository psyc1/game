import * as THREE from 'three';

interface Particle3D {
  mesh: THREE.Points;
  velocity: THREE.Vector3[];
  life: number;
  maxLife: number;
  positions: Float32Array;
  colors: Float32Array;
}

export class ParticleSystem3D {
  private scene: THREE.Scene;
  private particles: Particle3D[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public createExplosion(position: THREE.Vector3, color: string = '#ff4444') {
    const particleCount = 30;
    const geometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities: THREE.Vector3[] = [];
    
    const baseColor = new THREE.Color(color);
    
    for (let i = 0; i < particleCount; i++) {
      // Initial positions at explosion center
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;
      
      // Random velocities in all directions
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5
      );
      velocities.push(velocity);
      
      // Color variation
      const particleColor = baseColor.clone();
      particleColor.offsetHSL(
        (Math.random() - 0.5) * 0.2,
        0,
        (Math.random() - 0.5) * 0.3
      );
      
      colors[i * 3] = particleColor.r;
      colors[i * 3 + 1] = particleColor.g;
      colors[i * 3 + 2] = particleColor.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending
    });
    
    const mesh = new THREE.Points(geometry, material);
    this.scene.add(mesh);
    
    const particle: Particle3D = {
      mesh,
      velocity: velocities,
      life: 1.5,
      maxLife: 1.5,
      positions,
      colors
    };
    
    this.particles.push(particle);
  }

  public createPowerUpEffect(position: THREE.Vector3) {
    const particleCount = 20;
    const geometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities: THREE.Vector3[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;
      
      // Spiral upward motion
      const angle = (i / particleCount) * Math.PI * 2;
      const velocity = new THREE.Vector3(
        Math.cos(angle) * 2,
        3 + Math.random() * 2,
        Math.sin(angle) * 2
      );
      velocities.push(velocity);
      
      // Golden color
      const color = new THREE.Color();
      color.setHSL(0.15, 0.8, 0.6 + Math.random() * 0.4);
      
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
      opacity: 1,
      blending: THREE.AdditiveBlending
    });
    
    const mesh = new THREE.Points(geometry, material);
    this.scene.add(mesh);
    
    const particle: Particle3D = {
      mesh,
      velocity: velocities,
      life: 2,
      maxLife: 2,
      positions,
      colors
    };
    
    this.particles.push(particle);
  }

  public update(deltaTime: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // Update particle positions
      for (let j = 0; j < particle.velocity.length; j++) {
        const vel = particle.velocity[j];
        
        particle.positions[j * 3] += vel.x * deltaTime;
        particle.positions[j * 3 + 1] += vel.y * deltaTime;
        particle.positions[j * 3 + 2] += vel.z * deltaTime;
        
        // Apply gravity
        vel.y -= 5 * deltaTime;
        
        // Apply drag
        vel.multiplyScalar(0.98);
      }
      
      particle.mesh.geometry.attributes.position.needsUpdate = true;
      
      // Update life and opacity
      particle.life -= deltaTime;
      const opacity = particle.life / particle.maxLife;
      (particle.mesh.material as THREE.PointsMaterial).opacity = opacity;
      
      // Remove dead particles
      if (particle.life <= 0) {
        this.scene.remove(particle.mesh);
        this.particles.splice(i, 1);
      }
    }
  }
}