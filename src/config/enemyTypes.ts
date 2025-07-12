export interface EnemyType {
  id: string;
  name: string;
  health: number;
  damage: number;
  speed: number;
  score: number;
  color: string;
  size: number;
  shape: 'triangle' | 'diamond' | 'hexagon' | 'octagon' | 'sphere';
  movementPattern: 'linear' | 'zigzag' | 'sine' | 'spiral' | 'aggressive';
}

export const enemyTypes: EnemyType[] = [
  {
    id: 'scout',
    name: 'Scout',
    health: 1,
    damage: 5,
    speed: 1.2,
    score: 10,
    color: '#ff6b6b',
    size: 0.6,
    shape: 'triangle',
    movementPattern: 'linear'
  },
  {
    id: 'fighter',
    name: 'Fighter',
    health: 2,
    damage: 8,
    speed: 1.0,
    score: 20,
    color: '#4ecdc4',
    size: 0.8,
    shape: 'diamond',
    movementPattern: 'zigzag'
  },
  {
    id: 'interceptor',
    name: 'Interceptor',
    health: 1,
    damage: 6,
    speed: 1.8,
    score: 15,
    color: '#45b7d1',
    size: 0.5,
    shape: 'triangle',
    movementPattern: 'aggressive'
  },
  {
    id: 'destroyer',
    name: 'Destroyer',
    health: 4,
    damage: 12,
    speed: 0.6,
    score: 40,
    color: '#f39c12',
    size: 1.2,
    shape: 'hexagon',
    movementPattern: 'sine'
  },
  {
    id: 'battleship',
    name: 'Battleship',
    health: 6,
    damage: 20,
    speed: 0.4,
    score: 80,
    color: '#9b59b6',
    size: 1.5,
    shape: 'octagon',
    movementPattern: 'spiral'
  }
];