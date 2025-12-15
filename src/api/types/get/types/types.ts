import { apiClient } from '@/api/client';
import type { GetTypesRequest } from './types.request';
import type { GetTypesResponse } from './types.response';

/**
 * Get all Pokemon types from the API
 * @param params - Optional limit and offset for pagination
 */
export const getTypes = async (
  params: GetTypesRequest = {}
): Promise<GetTypesResponse> => {
  const { limit = 20, offset = 0 } = params;

  const response = await apiClient.get<GetTypesResponse>('/type', {
    params: { limit, offset },
  });

  return response.data;
};
