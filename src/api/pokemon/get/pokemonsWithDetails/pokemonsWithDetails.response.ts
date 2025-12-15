import type { Pokemon } from '@/types/pokemon';

export interface GetPokemonsWithDetailsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}
