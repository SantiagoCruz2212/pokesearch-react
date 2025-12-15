import type { Pokemon } from '@/types/pokemon';

/**
 * Get the best available Pokemon sprite URL
 * Priority: official-artwork > dream_world > front_default
 */
export const getPokemonImage = (pokemon: Pokemon): string => {
  return (
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.other?.dream_world?.front_default ||
    pokemon.sprites.front_default ||
    ''
  );
};
