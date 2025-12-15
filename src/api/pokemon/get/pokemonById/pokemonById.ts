import { apiClient } from '@/api/client';
import type { GetPokemonByIdRequest } from './pokemonById.request';
import type { GetPokemonByIdResponse } from './pokemonById.response';

export const getPokemonById = async (
  request: GetPokemonByIdRequest
): Promise<GetPokemonByIdResponse> => {
  const { nameOrId } = request;

  const response = await apiClient.get<GetPokemonByIdResponse>(
    `/pokemon/${nameOrId}`
  );

  return response.data;
};
