export interface LocationArea {
  name: string;
  url: string;
}

export interface VersionDetail {
  max_chance: number;
  version: {
    name: string;
    url: string;
  };
}

export interface EncounterDetail {
  chance: number;
  condition_values: any[];
  max_level: number;
  method: {
    name: string;
    url: string;
  };
  min_level: number;
}

export interface PokemonEncounter {
  location_area: LocationArea;
  version_details: {
    max_chance: number;
    encounter_details: EncounterDetail[];
    version: {
      name: string;
      url: string;
    };
  }[];
}

export type GetEncountersResponse = PokemonEncounter[];
