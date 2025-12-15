import { apiClient } from '@/api/client';
import type { GetEncountersRequest } from './encounters.request';
import type { GetEncountersResponse } from './encounters.response';

/**
 * Get Pokemon encounter locations
 * @param params - Pokemon name or ID
 */
export const getPokemonEncounters = async ({
  nameOrId,
}: GetEncountersRequest): Promise<GetEncountersResponse> => {
  const response = await apiClient.get<GetEncountersResponse>(
    `/pokemon/${nameOrId}/encounters`
  );

  return response.data;
};
