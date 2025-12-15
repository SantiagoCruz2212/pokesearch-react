import { apiClient } from '@/api/client';
import type { GetPokemonsRequest } from './pokemons.request';
import type { GetPokemonsResponse } from './pokemons.response';

export const getPokemons = async (
  params: GetPokemonsRequest = {}
): Promise<GetPokemonsResponse> => {
  const { limit = 20, offset = 0 } = params;

  const response = await apiClient.get<GetPokemonsResponse>('/pokemon', {
    params: { limit, offset },
  });

  return response.data;
};
