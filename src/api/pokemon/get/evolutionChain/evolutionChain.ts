import axios from 'axios';
import type { GetEvolutionChainRequest } from './evolutionChain.request';
import type { EvolutionChain } from './evolutionChain.response';

/**
 * Get Pokemon evolution chain
 * @param params - Evolution chain ID
 */
export const getEvolutionChain = async ({
  id,
}: GetEvolutionChainRequest): Promise<EvolutionChain> => {
  // Note: Evolution chain uses a different URL format
  const response = await axios.get<EvolutionChain>(
    `https://pokeapi.co/api/v2/evolution-chain/${id}`
  );

  return response.data;
};
