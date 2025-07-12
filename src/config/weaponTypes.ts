export interface WeaponConfig {
  id: string;
  name: string;
  level: number;
  damage: number;
  fireRate: number;
  bulletSpeed: number;
  bulletCount: number;
  spread: number;
  color: number;
  size: number;
  trail: boolean;
  hasLaser: boolean;
  hasMissiles: boolean;
  missileCount: number;
  description: string;
}

export const weaponConfigs: WeaponConfig[] = [
  {
    id: 'basic',
    name: 'Disparo Básico',
    level: 0,
    damage: 10,
    fireRate: 0.3,
    bulletSpeed: 15,
    bulletCount: 1,
    spread: 0,
    color: 0x00ffff,
    size: 0.05,
    trail: true,
    hasLaser: false,
    hasMissiles: false,
    missileCount: 0,
    description: 'Disparo simple y confiable'
  },
  {
    id: 'double',
    name: 'Disparo Doble',
    level: 1,
    damage: 8,
    fireRate: 0.35,
    bulletSpeed: 15,
    bulletCount: 2,
    spread: 0.3,
    color: 0x00ff88,
    size: 0.04,
    trail: true,
    hasLaser: false,
    hasMissiles: false,
    missileCount: 0,
    description: 'Dos disparos simultáneos'
  },
  {
    id: 'triple',
    name: 'Disparo Triple',
    level: 2,
    damage: 7,
    fireRate: 0.4,
    bulletSpeed: 15,
    bulletCount: 3,
    spread: 0.4,
    color: 0x88ff00,
    size: 0.04,
    trail: true,
    hasLaser: false,
    hasMissiles: false,
    missileCount: 0,
    description: 'Tres disparos en formación'
  },
  {
    id: 'spread',
    name: 'Abanico',
    level: 3,
    damage: 5,
    fireRate: 0.5,
    bulletSpeed: 12,
    bulletCount: 5,
    spread: 0.8,
    color: 0xffaa00,
    size: 0.03,
    trail: false,
    hasLaser: false,
    hasMissiles: false,
    missileCount: 0,
    description: 'Cinco disparos en abanico'
  },
  {
    id: 'spread_missile_center',
    name: 'Abanico + Misil Central',
    level: 4,
    damage: 5,
    fireRate: 0.6,
    bulletSpeed: 12,
    bulletCount: 5,
    spread: 0.8,
    color: 0xff8800,
    size: 0.03,
    trail: false,
    hasLaser: false,
    hasMissiles: true,
    missileCount: 1,
    description: 'Abanico con misil central'
  },
  {
    id: 'spread_missile_right',
    name: 'Abanico + Misil Derecho',
    level: 5,
    damage: 5,
    fireRate: 0.6,
    bulletSpeed: 12,
    bulletCount: 5,
    spread: 0.8,
    color: 0xff4400,
    size: 0.03,
    trail: false,
    hasLaser: false,
    hasMissiles: true,
    missileCount: 1,
    description: 'Abanico con misil lateral derecho'
  },
  {
    id: 'spread_missile_left',
    name: 'Abanico + Misil Izquierdo',
    level: 6,
    damage: 5,
    fireRate: 0.6,
    bulletSpeed: 12,
    bulletCount: 5,
    spread: 0.8,
    color: 0xff0088,
    size: 0.03,
    trail: false,
    hasLaser: false,
    hasMissiles: true,
    missileCount: 1,
    description: 'Abanico con misil lateral izquierdo'
  },
  {
    id: 'spread_missiles_dual',
    name: 'Abanico + 2 Misiles',
    level: 7,
    damage: 5,
    fireRate: 0.7,
    bulletSpeed: 12,
    bulletCount: 5,
    spread: 0.8,
    color: 0x8800ff,
    size: 0.03,
    trail: false,
    hasLaser: false,
    hasMissiles: true,
    missileCount: 2,
    description: 'Abanico con misiles laterales'
  },
  {
    id: 'spread_missiles_triple',
    name: 'Abanico + 3 Misiles',
    level: 8,
    damage: 5,
    fireRate: 0.8,
    bulletSpeed: 12,
    bulletCount: 5,
    spread: 0.8,
    color: 0x4400ff,
    size: 0.03,
    trail: false,
    hasLaser: false,
    hasMissiles: true,
    missileCount: 3,
    description: 'Abanico con tres misiles'
  },
  {
    id: 'ultimate',
    name: 'Arsenal Completo + Láseres',
    level: 9,
    damage: 5,
    fireRate: 1.0,
    bulletSpeed: 12,
    bulletCount: 5,
    spread: 0.8,
    color: 0x0088ff,
    size: 0.03,
    trail: false,
    hasLaser: true,
    hasMissiles: true,
    missileCount: 3,
    description: 'Armamento completo con láseres'
  }
];