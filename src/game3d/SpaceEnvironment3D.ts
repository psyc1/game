import * as THREE from 'three';

export class SpaceEnvironment3D {
  private scene: THREE.Scene;
  private stars: THREE.Points;
  private nebulas: THREE.Mesh[] = [];
  private planets: THREE.Mesh[] = [];
  private asteroids: THREE.Mesh[] = [];
  private time = 0;
  private spaceShips: THREE.Mesh[] = [];
  private energyFields: THREE.Mesh[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.createRealisticStarField();
    this.createSpaceNebulas();
    this.createDistantPlanets();
    this.createAsteroidField();
    this.createSpaceShips();
    this.createEnergyFields();
    this.createAdvancedLighting();
  }

  private createRealisticStarField() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 5000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
      // Distribución esférica realista
      const radius = 300 + Math.random() * 500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Colores estelares realistas
      const color = new THREE.Color();
      const starType = Math.random();
      
      if (starType < 0.3) {
        // Enanas rojas
        color.setHSL(0.02, 0.9, 0.7);
        sizes[i] = 0.8 + Math.random() * 1.2;
      } else if (starType < 0.6) {
        // Estrellas tipo Sol
        color.setHSL(0.12, 0.8, 0.9);
        sizes[i] = 1.2 + Math.random() * 1.8;
      } else if (starType < 0.8) {
        // Gigantes azules
        color.setHSL(0.65, 0.9, 0.95);
        sizes[i] = 2.0 + Math.random() * 3.0;
      } else if (starType < 0.95) {
        // Estrellas blancas
        color.setHSL(0, 0, 0.98);
        sizes[i] = 1.5 + Math.random() * 2.5;
      } else {
        // Supergigantes rojas
        color.setHSL(0.05, 0.95, 0.8);
        sizes[i] = 4.0 + Math.random() * 6.0;
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

  private createSpaceNebulas() {
    const nebulaConfigs = [
      { color: 0x6a0dad, opacity: 0.15, scale: [400, 300, 150], position: [-200, 80, -300] },
      { color: 0x4169e1, opacity: 0.12, scale: [350, 250, 120], position: [150, -50, -250] },
      { color: 0x8a2be2, opacity: 0.10, scale: [300, 200, 100], position: [-100, 120, -200] },
      { color: 0x9370db, opacity: 0.08, scale: [250, 180, 80], position: [200, -80, -180] },
      { color: 0x483d8b, opacity: 0.14, scale: [320, 220, 110], position: [0, 150, -280] }
    ];

    nebulaConfigs.forEach((config, index) => {
      const geometry = new THREE.SphereGeometry(1, 64, 64);
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
    const planetConfigs = [
      { size: 12, color: 0x8b4513, position: [-300, 80, -400], rings: false, moons: 1 },
      { size: 18, color: 0x4169e1, position: [350, -120, -450], rings: true, moons: 2 },
      { size: 8, color: 0x228b22, position: [-200, 180, -350], rings: false, moons: 0 },
      { size: 22, color: 0xffa500, position: [250, -60, -500], rings: true, moons: 3 }
    ];

    planetConfigs.forEach(config => {
      const group = new THREE.Group();
      
      // Planeta principal
      const geometry = new THREE.SphereGeometry(config.size, 64, 64);
      const material = new THREE.MeshPhongMaterial({
        color: config.color,
        transparent: true,
        opacity: 0.6,
        emissive: new THREE.Color(config.color).multiplyScalar(0.1),
        shininess: 30
      });
      
      const planet = new THREE.Mesh(geometry, material);
      group.add(planet);
      
      // Anillos si los tiene
      if (config.rings) {
        const ringGeometry = new THREE.RingGeometry(config.size * 1.8, config.size * 2.8, 128);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xcccccc,
          transparent: true,
          opacity: 0.4,
          side: THREE.DoubleSide
        });
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.3;
        group.add(rings);
      }
      
      // Lunas
      for (let i = 0; i < config.moons; i++) {
        const moonSize = config.size * 0.1 + Math.random() * config.size * 0.05;
        const moonGeometry = new THREE.SphereGeometry(moonSize, 16, 16);
        const moonMaterial = new THREE.MeshPhongMaterial({
          color: 0x888888,
          transparent: true,
          opacity: 0.5
        });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        
        const distance = config.size * (3 + i * 1.5);
        const angle = (i / config.moons) * Math.PI * 2;
        moon.position.set(
          Math.cos(angle) * distance,
          (Math.random() - 0.5) * config.size * 0.5,
          Math.sin(angle) * distance
        );
        group.add(moon);
      }
      
      group.position.set(config.position[0], config.position[1], config.position[2]);
      this.planets.push(group);
      this.scene.add(group);
    });
  }

  private createAsteroidField() {
    for (let i = 0; i < 100; i++) {
      const size = 0.5 + Math.random() * 3;
      const geometry = new THREE.DodecahedronGeometry(size);
      const material = new THREE.MeshPhongMaterial({
        color: 0x666666,
        transparent: true,
        opacity: 0.7,
        shininess: 10
      });
      
      const asteroid = new THREE.Mesh(geometry, material);
      asteroid.position.set(
        (Math.random() - 0.5) * 600,
        (Math.random() - 0.5) * 300,
        -150 - Math.random() * 300
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

  private createSpaceShips() {
    for (let i = 0; i < 5; i++) {
      const shipGeometry = new THREE.ConeGeometry(2, 8, 6);
      const shipMaterial = new THREE.MeshPhongMaterial({
        color: 0x444444,
        transparent: true,
        opacity: 0.3,
        emissive: 0x002244
      });
      
      const ship = new THREE.Mesh(shipGeometry, shipMaterial);
      ship.position.set(
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 200,
        -100 - Math.random() * 200
      );
      ship.rotation.x = Math.PI / 2;
      
      this.spaceShips.push(ship);
      this.scene.add(ship);
    }
  }

  private createEnergyFields() {
    for (let i = 0; i < 8; i++) {
      const fieldGeometry = new THREE.SphereGeometry(5 + Math.random() * 10, 16, 16);
      const fieldMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.8, 0.5),
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending
      });
      
      const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
      field.position.set(
        (Math.random() - 0.5) * 500,
        (Math.random() - 0.5) * 250,
        -80 - Math.random() * 150
      );
      
      this.energyFields.push(field);
      this.scene.add(field);
    }
  }

  private createAdvancedLighting() {
    // Luz ambiental suave
    const ambientLight = new THREE.AmbientLight(0x404080, 0.4);
    this.scene.add(ambientLight);
    
    // Luz direccional principal
    const directionalLight = new THREE.DirectionalLight(0x8080ff, 1.0);
    directionalLight.position.set(100, 100, 100);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
    
    // Luces de colores para atmósfera
    const pointLight1 = new THREE.PointLight(0xff4080, 0.6, 300);
    pointLight1.position.set(-150, 80, 80);
    this.scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x40ff80, 0.5, 250);
    pointLight2.position.set(150, -80, 60);
    this.scene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(0x8040ff, 0.4, 200);
    pointLight3.position.set(0, 150, -80);
    this.scene.add(pointLight3);
  }

  public update(deltaTime: number) {
    this.time += deltaTime;
    
    // Rotación lenta de estrellas
    this.stars.rotation.y += deltaTime * 0.002;
    this.stars.rotation.x += deltaTime * 0.001;
    
    // Animación de nebulosas
    this.nebulas.forEach((nebula, index) => {
      nebula.rotation.z += deltaTime * 0.005 * (index + 1);
      nebula.rotation.y += deltaTime * 0.003 * (index + 1);
      
      const baseOpacity = [0.15, 0.12, 0.10, 0.08, 0.14][index];
      nebula.material.opacity = baseOpacity + Math.sin(this.time * 0.3 + index) * 0.03;
    });
    
    // Rotación de planetas
    this.planets.forEach((planet, index) => {
      planet.rotation.y += deltaTime * 0.05 * (index + 1);
      
      // Movimiento orbital sutil
      const orbitSpeed = 0.01 * (index + 1);
      planet.position.x += Math.sin(this.time * orbitSpeed) * 0.3;
      planet.position.z += Math.cos(this.time * orbitSpeed) * 0.2;
    });
    
    // Rotación de asteroides
    this.asteroids.forEach((asteroid, index) => {
      asteroid.rotation.x += deltaTime * 0.3 * (index % 3 + 1);
      asteroid.rotation.y += deltaTime * 0.2 * (index % 2 + 1);
      asteroid.rotation.z += deltaTime * 0.25 * (index % 4 + 1);
    });
    
    // Movimiento de naves espaciales
    this.spaceShips.forEach((ship, index) => {
      ship.position.x += Math.sin(this.time * 0.1 + index) * 0.5;
      ship.position.y += Math.cos(this.time * 0.15 + index) * 0.3;
      ship.rotation.z += deltaTime * 0.1;
    });
    
    // Pulsación de campos de energía
    this.energyFields.forEach((field, index) => {
      const scale = 1 + Math.sin(this.time * 2 + index) * 0.3;
      field.scale.setScalar(scale);
      field.rotation.x += deltaTime * 0.2;
      field.rotation.y += deltaTime * 0.15;
    });
    
    // Efecto de parpadeo en estrellas
    const starMaterial = this.stars.material as THREE.PointsMaterial;
    starMaterial.opacity = 0.85 + Math.sin(this.time * 1.5) * 0.1;
  }
}