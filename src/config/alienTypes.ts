export interface AlienType {
  id: string;
  name: string;
  hp: number;
  size: number;
  color: string;
  shape: 'circle' | 'oval' | 'triangle' | 'diamond' | 'hexagon';
  score: number;
  speed: number;
}

// Tamaño base: 1.0, con aumento general del 20% = 1.2
// Cada alien es 10% más grande que el anterior
const BASE_SIZE = 1.2; // Aumento general del 20%

export const alienTypes: AlienType[] = [
  {
    id: 'alien1',
    name: 'Scout',
    hp: 1,
    size: BASE_SIZE, // 1.2
    color: '#ff4444', // Rojo
    shape: 'circle',
    score: 10,
    speed: 1.0
  },
  {
    id: 'alien2',
    name: 'Warrior',
    hp: 1,
    size: BASE_SIZE * 1.1, // 1.32
    color: '#8b5cf6', // Púrpura
    shape: 'oval',
    score: 15,
    speed: 0.9
  },
  {
    id: 'alien3',
    name: 'Hunter',
    hp: 1,
    size: BASE_SIZE * 1.1 * 1.1, // 1.45
    color: '#f97316', // Naranja
    shape: 'triangle',
    score: 20,
    speed: 1.2
  },
  {
    id: 'alien4',
    name: 'Guardian',
    hp: 2,
    size: BASE_SIZE * 1.1 * 1.1 * 1.1, // 1.60
    color: '#06b6d4', // Cian
    shape: 'diamond',
    score: 30,
    speed: 0.8
  },
  {
    id: 'alien5',
    name: 'Commander',
    hp: 3,
    size: BASE_SIZE * 1.1 * 1.1 * 1.1 * 1.1, // 1.76
    color: '#ec4899', // Magenta
    shape: 'hexagon',
    score: 50,
    speed: 0.7
  }
];