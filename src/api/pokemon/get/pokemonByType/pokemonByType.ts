import { apiClient } from '@/api/client';
import type { GetPokemonByTypeRequest } from './pokemonByType.request';
import type { GetPokemonByTypeResponse } from './pokemonByType.response';

export const getPokemonByType = async (
  request: GetPokemonByTypeRequest
): Promise<GetPokemonByTypeResponse> => {
  const { type } = request;

  const response = await apiClient.get<GetPokemonByTypeResponse>(`/type/${type}`);

  return response.data;
};
