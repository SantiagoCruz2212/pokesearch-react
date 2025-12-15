import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface TeamState {
  team: number[]; // Array of Pokemon IDs
  addToTeam: (pokemonId: number) => boolean;
  removeFromTeam: (pokemonId: number) => void;
  replaceInTeam: (oldPokemonId: number, newPokemonId: number) => void;
  isInTeam: (pokemonId: number) => boolean;
  clearTeam: () => void;
  isTeamFull: () => boolean;
}

const MAX_TEAM_SIZE = 6;

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      team: [],

      addToTeam: (pokemonId: number) => {
        const { team, isInTeam, isTeamFull } = get();

        // Don't add if already in team
        if (isInTeam(pokemonId)) {
          return true;
        }

        // Don't add if team is full
        if (isTeamFull()) {
          return false;
        }

        set({ team: [...team, pokemonId] });
        return true;
      },

      removeFromTeam: (pokemonId: number) => {
        set((state) => ({
          team: state.team.filter((id) => id !== pokemonId),
        }));
      },

      replaceInTeam: (oldPokemonId: number, newPokemonId: number) => {
        set((state) => ({
          team: state.team.map((id) => (id === oldPokemonId ? newPokemonId : id)),
        }));
      },

      isInTeam: (pokemonId: number) => {
        return get().team.includes(pokemonId);
      },

      clearTeam: () => {
        set({ team: [] });
      },

      isTeamFull: () => {
        return get().team.length >= MAX_TEAM_SIZE;
      },
    }),
    {
      name: 'pokemon-team',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
