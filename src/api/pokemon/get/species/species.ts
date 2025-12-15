import { apiClient } from '@/api/client';
import type { GetSpeciesRequest } from './species.request';
import type { PokemonSpecies } from './species.response';

/**
 * Get Pokemon species information
 * @param params - Pokemon name or ID
 */
export const getPokemonSpecies = async ({
  nameOrId,
}: GetSpeciesRequest): Promise<PokemonSpecies> => {
  const response = await apiClient.get<PokemonSpecies>(
    `/pokemon-species/${nameOrId}`
  );

  return response.data;
};
