// Type effectiveness data for Pokemon types
export const TYPE_EFFECTIVENESS = {
  normal: {
    strongAgainst: [],
    weakAgainst: ['fighting'],
    immuneTo: ['ghost'],
  },
  fighting: {
    strongAgainst: ['normal', 'ice', 'rock', 'dark', 'steel'],
    weakAgainst: ['flying', 'psychic', 'fairy'],
    immuneTo: [],
  },
  flying: {
    strongAgainst: ['fighting', 'bug', 'grass'],
    weakAgainst: ['electric', 'ice', 'rock'],
    immuneTo: ['ground'],
  },
  poison: {
    strongAgainst: ['grass', 'fairy'],
    weakAgainst: ['ground', 'psychic'],
    immuneTo: [],
  },
  ground: {
    strongAgainst: ['poison', 'rock', 'steel', 'fire', 'electric'],
    weakAgainst: ['water', 'grass', 'ice'],
    immuneTo: ['electric'],
  },
  rock: {
    strongAgainst: ['flying', 'bug', 'fire', 'ice'],
    weakAgainst: ['fighting', 'ground', 'steel', 'water', 'grass'],
    immuneTo: [],
  },
  bug: {
    strongAgainst: ['grass', 'psychic', 'dark'],
    weakAgainst: ['flying', 'rock', 'fire'],
    immuneTo: [],
  },
  ghost: {
    strongAgainst: ['ghost', 'psychic'],
    weakAgainst: ['ghost', 'dark'],
    immuneTo: ['normal', 'fighting'],
  },
  steel: {
    strongAgainst: ['ice', 'rock', 'fairy'],
    weakAgainst: ['fighting', 'ground', 'fire'],
    immuneTo: ['poison'],
  },
  fire: {
    strongAgainst: ['bug', 'steel', 'grass', 'ice'],
    weakAgainst: ['ground', 'rock', 'water'],
    immuneTo: [],
  },
  water: {
    strongAgainst: ['ground', 'rock', 'fire'],
    weakAgainst: ['grass', 'electric'],
    immuneTo: [],
  },
  grass: {
    strongAgainst: ['ground', 'rock', 'water'],
    weakAgainst: ['flying', 'poison', 'bug', 'fire', 'ice'],
    immuneTo: [],
  },
  electric: {
    strongAgainst: ['flying', 'water'],
    weakAgainst: ['ground'],
    immuneTo: [],
  },
  psychic: {
    strongAgainst: ['fighting', 'poison'],
    weakAgainst: ['bug', 'ghost', 'dark'],
    immuneTo: [],
  },
  ice: {
    strongAgainst: ['flying', 'ground', 'grass', 'dragon'],
    weakAgainst: ['fighting', 'rock', 'steel', 'fire'],
    immuneTo: [],
  },
  dragon: {
    strongAgainst: ['dragon'],
    weakAgainst: ['ice', 'dragon', 'fairy'],
    immuneTo: [],
  },
  dark: {
    strongAgainst: ['ghost', 'psychic'],
    weakAgainst: ['fighting', 'bug', 'fairy'],
    immuneTo: ['psychic'],
  },
  fairy: {
    strongAgainst: ['fighting', 'dragon', 'dark'],
    weakAgainst: ['poison', 'steel'],
    immuneTo: ['dragon'],
  },
} as const;

// Helper function to get combined effectiveness for dual-type Pokemon
export const getTypeEffectiveness = (types: string[]) => {
  const strongAgainst = new Set<string>();
  const weakAgainst = new Set<string>();

  types.forEach((type) => {
    const effectiveness = TYPE_EFFECTIVENESS[type as keyof typeof TYPE_EFFECTIVENESS];
    if (effectiveness) {
      effectiveness.strongAgainst.forEach((t) => strongAgainst.add(t));
      effectiveness.weakAgainst.forEach((t) => weakAgainst.add(t));
    }
  });

  return {
    strongAgainst: Array.from(strongAgainst),
    weakAgainst: Array.from(weakAgainst),
  };
};
