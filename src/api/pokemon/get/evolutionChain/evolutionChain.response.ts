export interface ChainLink {
  species: {
    name: string;
    url: string;
  };
  evolution_details: {
    min_level?: number;
    trigger: {
      name: string;
    };
    item?: {
      name: string;
    };
  }[];
  evolves_to: ChainLink[];
}

export interface EvolutionChain {
  id: number;
  chain: ChainLink;
}
