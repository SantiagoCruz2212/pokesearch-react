import { apiClient } from '@/api/client';
import type { GetPokemonsWithDetailsRequest } from './pokemonsWithDetails.request';
import type { GetPokemonsWithDetailsResponse } from './pokemonsWithDetails.response';
import type { Pokemon } from '@/types/pokemon';

/**
 * Get paginated list of Pokemon with full details in a single optimized call
 * Internally fetches the list and all details, but exposed as one API call to the consumer
 */
export const getPokemonsWithDetails = async (
  params: GetPokemonsWithDetailsRequest = {}
): Promise<GetPokemonsWithDetailsResponse> => {
  const { limit = 20, offset = 0 } = params;

  // Step 1: Get the paginated list
  const listResponse = await apiClient.get<{
    count: number;
    next: string | null;
    previous: string | null;
    results: { name: string; url: string }[];
  }>('/pokemon', {
    params: { limit, offset },
  });

  // Step 2: Fetch all Pokemon details in parallel
  const detailsPromises = listResponse.data.results.map((pokemon) =>
    apiClient.get<Pokemon>(`/pokemon/${pokemon.name}`)
  );

  const detailsResponses = await Promise.all(detailsPromises);
  const pokemonWithDetails = detailsResponses.map((response) => response.data);

  // Return combined response
  return {
    count: listResponse.data.count,
    next: listResponse.data.next,
    previous: listResponse.data.previous,
    results: pokemonWithDetails,
  };
};
