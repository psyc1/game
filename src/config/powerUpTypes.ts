export interface PowerUpType {
  id: string;
  name: string;
  color: string;
  effect: 'weapon' | 'health' | 'shield';
  value: number;
  description: string;
}

export const powerUpTypes: PowerUpType[] = [
  {
    id: 'weapon_upgrade',
    name: 'Weapon Upgrade',
    color: '#ffd700',
    effect: 'weapon',
    value: 1,
    description: 'Evoluciona tu arma al siguiente nivel'
  },
  {
    id: 'health_pack',
    name: 'Health Pack',
    color: '#00ff00',
    effect: 'health',
    value: 25,
    description: 'Restaura 25% de vida'
  },
  {
    id: 'shield_boost',
    name: 'Shield Boost',
    color: '#00bfff',
    effect: 'shield',
    value: 30,
    description: 'Restaura 30% de escudo'
  }
];