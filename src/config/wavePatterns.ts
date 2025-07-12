import { AlienType, alienTypes } from './alienTypes';

export interface WaveComposition {
  alienType: AlienType;
  count: number;
}

export interface WavePattern {
  wave: number;
  composition: WaveComposition[];
  formation: 'line' | 'double_line' | 'v_formation' | 'random_grid' | 'shield_formation';
  description: string;
}

export const wavePatterns: WavePattern[] = [
  {
    wave: 1,
    composition: [
      { alienType: alienTypes[0], count: 5 } // 5 x Alien 1 (rojos)
    ],
    formation: 'line',
    description: 'Oleada de reconocimiento - Scouts rojos en línea'
  },
  {
    wave: 2,
    composition: [
      { alienType: alienTypes[0], count: 7 }, // 7 x Alien 1
      { alienType: alienTypes[1], count: 2 }  // 2 x Alien 2 (púrpuras)
    ],
    formation: 'double_line',
    description: 'Formación defensiva - Púrpuras protegidos atrás'
  },
  {
    wave: 3,
    composition: [
      { alienType: alienTypes[0], count: 8 }, // 8 x Alien 1
      { alienType: alienTypes[1], count: 4 }, // 4 x Alien 2
      { alienType: alienTypes[2], count: 1 }  // 1 x Alien 3 (naranja)
    ],
    formation: 'v_formation',
    description: 'Ataque en V - Hunter naranja liderando'
  },
  {
    wave: 4,
    composition: [
      { alienType: alienTypes[0], count: 5 }, // 5 x Alien 1
      { alienType: alienTypes[1], count: 5 }, // 5 x Alien 2
      { alienType: alienTypes[2], count: 3 }, // 3 x Alien 3
      { alienType: alienTypes[3], count: 1 }  // 1 x Alien 4 (cian, 2 HP)
    ],
    formation: 'random_grid',
    description: 'Caos organizado - Primer Guardian resistente'
  },
  {
    wave: 5,
    composition: [
      { alienType: alienTypes[1], count: 10 }, // 10 x Alien 2
      { alienType: alienTypes[2], count: 5 },  // 5 x Alien 3
      { alienType: alienTypes[3], count: 3 },  // 3 x Alien 4
      { alienType: alienTypes[4], count: 1 }   // 1 x Alien 5 (magenta, 3 HP)
    ],
    formation: 'shield_formation',
    description: 'Formación de élite - Commander magenta protegido'
  }
];

// Función para obtener el patrón de oleada basado en el nivel
export function getWavePattern(level: number): WavePattern {
  const basePatterns = wavePatterns.length;
  const patternIndex = (level - 1) % basePatterns;
  const pattern = wavePatterns[patternIndex];
  
  // Escalar dificultad basada en el nivel
  const difficultyMultiplier = 1 + Math.floor((level - 1) / basePatterns) * 0.5;
  
  return {
    ...pattern,
    composition: pattern.composition.map(comp => ({
      ...comp,
      count: Math.ceil(comp.count * difficultyMultiplier)
    }))
  };
}