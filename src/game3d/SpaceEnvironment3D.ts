import * as THREE from 'three';

export class SpaceEnvironment3D {
  private scene: THREE.Scene;
  private stars: THREE.Points;
  private nebulas: THREE.Mesh[] = [];
  private planets: THREE.Mesh[] = [];
  private asteroids: THREE.Mesh[] = [];
  private time = 0;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.createAdvancedStarField();
    this.createRealisticNebulas();
    this.createDistantPlanets();
    this.createAsteroidField();
    this.createAdvancedLighting();
  }

  private createAdvancedStarField() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
      // Create realistic star distribution in a sphere
      const radius = 200 + Math.random() * 300;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Realistic star colors and sizes based on stellar classification
      const color = new THREE.Color();
      const starType = Math.random();
      
      if (starType < 0.4) {
        // Red dwarf stars (most common)
        color.setHSL(0.05, 0.8, 0.6);
        sizes[i] = 0.5 + Math.random() * 1;
      } else if (starType < 0.7) {
        // Sun-like yellow stars
        color.setHSL(0.15, 0.9, 0.9);
        sizes[i] = 1 + Math.random() * 2;
      } else if (starType < 0.85) {
        // Blue giants
        color.setHSL(0.6, 0.9, 0.95);
        sizes[i] = 2 + Math.random() * 3;
      } else if (starType < 0.95) {
        // White stars
        color.setHSL(0, 0, 0.95);
        sizes[i] = 1.5 + Math.random() * 2;
      } else {
        // Red giants (rare)
        color.setHSL(0, 0.9, 0.7);
        sizes[i] = 3 + Math.random() * 4;
      }
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const starMaterial = new THREE.PointsMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: false
    });
    
    this.stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(this.stars);
  }

  private createRealisticNebulas() {
    // Create multiple realistic nebula layers
    const nebulaConfigs = [
      { color: 0x4a0e4e, opacity: 0.08, scale: [300, 200, 100], position: [-150, 50, -200] },
      { color: 0x1a237e, opacity: 0.06, scale: [250, 180, 80], position: [100, -30, -180] },
      { color: 0x0d47a1, opacity: 0.05, scale: [200, 150, 60], position: [-80, 80, -160] },
      { color: 0x1565c0, opacity: 0.04, scale: [180, 120, 50], position: [120, -60, -140] },
      { color: 0x283593, opacity: 0.07, scale: [220, 160, 70], position: [0, 100, -220] }
    ];

    nebulaConfigs.forEach((config, index) => {
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshBasicMaterial({
        color: config.color,
        transparent: true,
        opacity: config.opacity,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(config.position[0], config.position[1], config.position[2]);
      mesh.scale.set(config.scale[0], config.scale[1], config.scale[2]);
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.rotation.z = Math.random() * Math.PI;
      
      this.nebulas.push(mesh);
      this.scene.add(mesh);
    });
  }

  private createDistantPlanets() {
    // Add realistic distant planets
    const planetConfigs = [
      { size: 8, color: 0x8b4513, position: [-200, 50, -300], rings: false },
      { size: 12, color: 0x4169e1, position: [250, -80, -350], rings: true },
      { size: 6, color: 0x228b22, position: [-150, 120, -280], rings: false },
      { size: 15, color: 0xffa500, position: [180, -40, -400], rings: true }
    ];

    planetConfigs.forEach(config => {
      // Planet body
      const geometry = new THREE.SphereGeometry(config.size, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: config.color,
        transparent: true,
        opacity: 0.4,
        emissive: new THREE.Color(config.color).multiplyScalar(0.1)
      });
      
      const planet = new THREE.Mesh(geometry, material);
      planet.position.set(config.position[0], config.position[1], config.position[2]);
      
      // Add rings if specified
      if (config.rings) {
        const ringGeometry = new THREE.RingGeometry(config.size * 1.5, config.size * 2.2, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xaaaaaa,
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide
        });
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
        planet.add(rings);
      }
      
      this.planets.push(planet);
      this.scene.add(planet);
    });
  }

  private createAsteroidField() {
    // Create a distant asteroid field
    for (let i = 0; i < 50; i++) {
      const size = 0.5 + Math.random() * 2;
      const geometry = new THREE.DodecahedronGeometry(size);
      const material = new THREE.MeshPhongMaterial({
        color: 0x666666,
        transparent: true,
        opacity: 0.6
      });
      
      const asteroid = new THREE.Mesh(geometry, material);
      asteroid.position.set(
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 200,
        -100 - Math.random() * 200
      );
      asteroid.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      this.asteroids.push(asteroid);
      this.scene.add(asteroid);
    }
  }

  private createAdvancedLighting() {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    this.scene.add(ambientLight);
    
    // Main directional light (distant star)
    const directionalLight = new THREE.DirectionalLight(0x4080ff, 0.8);
    directionalLight.position.set(50, 50, 50);
    this.scene.add(directionalLight);
    
    // Colored point lights for atmosphere
    const pointLight1 = new THREE.PointLight(0xff4080, 0.5, 200);
    pointLight1.position.set(-100, 50, 50);
    this.scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x40ff80, 0.4, 150);
    pointLight2.position.set(100, -50, 30);
    this.scene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(0x8040ff, 0.3, 100);
    pointLight3.position.set(0, 100, -50);
    this.scene.add(pointLight3);
  }

  public update(deltaTime: number) {
    this.time += deltaTime;
    
    // Slow star rotation for depth
    this.stars.rotation.y += deltaTime * 0.005;
    this.stars.rotation.x += deltaTime * 0.002;
    
    // Animate nebulas with subtle movement
    this.nebulas.forEach((nebula, index) => {
      nebula.rotation.z += deltaTime * 0.01 * (index + 1);
      nebula.rotation.y += deltaTime * 0.005 * (index + 1);
      
      // Subtle opacity pulsing
      const baseOpacity = [0.08, 0.06, 0.05, 0.04, 0.07][index];
      nebula.material.opacity = baseOpacity + Math.sin(this.time * 0.5 + index) * 0.02;
    });
    
    // Rotate planets
    this.planets.forEach((planet, index) => {
      planet.rotation.y += deltaTime * 0.1 * (index + 1);
      planet.rotation.x += deltaTime * 0.05 * (index + 1);
      
      // Subtle orbital movement
      const orbitSpeed = 0.02 * (index + 1);
      planet.position.x += Math.sin(this.time * orbitSpeed) * 0.5;
      planet.position.z += Math.cos(this.time * orbitSpeed) * 0.3;
    });
    
    // Rotate asteroids
    this.asteroids.forEach((asteroid, index) => {
      asteroid.rotation.x += deltaTime * 0.5 * (index % 3 + 1);
      asteroid.rotation.y += deltaTime * 0.3 * (index % 2 + 1);
      asteroid.rotation.z += deltaTime * 0.4 * (index % 4 + 1);
    });
    
    // Twinkling stars effect
    const starMaterial = this.stars.material as THREE.PointsMaterial;
    starMaterial.opacity = 0.8 + Math.sin(this.time * 2) * 0.1;
  }
}