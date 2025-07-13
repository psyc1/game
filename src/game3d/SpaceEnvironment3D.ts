import * as THREE from 'three';

export class SpaceEnvironment3D {
  private scene: THREE.Scene;
  private stars: THREE.Points;
  private nebulas: THREE.Mesh[] = [];
  private planets: THREE.Mesh[] = [];
  private time = 0;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.createRealisticStarField();
    this.createDistantNebulas();
    this.createDistantPlanets();
    this.createSpaceLighting();
  }

  private createRealisticStarField() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1500;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
      // Distribución en una esfera lejana
      const radius = 100 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Colores estelares realistas
      const color = new THREE.Color();
      const starType = Math.random();
      
      if (starType < 0.4) {
        // Estrellas blancas/azules
        color.setHSL(0.6, 0.3, 0.9);
        sizes[i] = 1.0 + Math.random() * 1.5;
      } else if (starType < 0.7) {
        // Estrellas amarillas
        color.setHSL(0.15, 0.5, 0.8);
        sizes[i] = 0.8 + Math.random() * 1.2;
      } else {
        // Estrellas rojas
        color.setHSL(0.02, 0.8, 0.7);
        sizes[i] = 0.6 + Math.random() * 1.0;
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
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: false
    });
    
    this.stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(this.stars);
  }

  private createDistantNebulas() {
    const nebulaConfigs = [
      { color: 0x4a0e4e, opacity: 0.08, scale: [80, 60, 40], position: [-60, 20, -80] },
      { color: 0x1e3a8a, opacity: 0.06, scale: [70, 50, 30], position: [50, -15, -70] },
      { color: 0x7c2d12, opacity: 0.05, scale: [60, 40, 25], position: [-30, 40, -60] }
    ];

    nebulaConfigs.forEach((config) => {
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
      
      this.nebulas.push(mesh);
      this.scene.add(mesh);
    });
  }

  private createDistantPlanets() {
    const planetConfigs = [
      { size: 8, color: 0x8b4513, position: [-80, 30, -120] },
      { size: 12, color: 0x4169e1, position: [90, -40, -150] },
      { size: 6, color: 0x228b22, position: [-50, 60, -100] }
    ];

    planetConfigs.forEach(config => {
      const geometry = new THREE.SphereGeometry(config.size, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: config.color,
        transparent: true,
        opacity: 0.4,
        emissive: new THREE.Color(config.color).multiplyScalar(0.1)
      });
      
      const planet = new THREE.Mesh(geometry, material);
      planet.position.set(config.position[0], config.position[1], config.position[2]);
      
      this.planets.push(planet);
      this.scene.add(planet);
    });
  }

  private createSpaceLighting() {
    // Luz ambiental suave
    const ambientLight = new THREE.AmbientLight(0x404080, 0.3);
    this.scene.add(ambientLight);
    
    // Luz direccional principal
    const directionalLight = new THREE.DirectionalLight(0x8080ff, 0.8);
    directionalLight.position.set(50, 50, 50);
    this.scene.add(directionalLight);
    
    // Luces de colores sutiles
    const pointLight1 = new THREE.PointLight(0xff4080, 0.3, 100);
    pointLight1.position.set(-40, 20, 20);
    this.scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x40ff80, 0.2, 80);
    pointLight2.position.set(40, -20, 15);
    this.scene.add(pointLight2);
  }

  public update(deltaTime: number) {
    this.time += deltaTime;
    
    // Rotación muy lenta de estrellas
    this.stars.rotation.y += deltaTime * 0.001;
    
    // Animación sutil de nebulosas
    this.nebulas.forEach((nebula, index) => {
      nebula.rotation.z += deltaTime * 0.002 * (index + 1);
      const baseOpacity = [0.08, 0.06, 0.05][index];
      nebula.material.opacity = baseOpacity + Math.sin(this.time * 0.2 + index) * 0.02;
    });
    
    // Rotación lenta de planetas
    this.planets.forEach((planet, index) => {
      planet.rotation.y += deltaTime * 0.02 * (index + 1);
    });
  }
}