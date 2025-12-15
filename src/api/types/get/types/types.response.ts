export interface PokemonTypeResult {
  name: string;
  url: string;
}

export interface GetTypesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonTypeResult[];
}
