import { create } from "zustand";
import { Pokemon } from "@/types/pokemon";

interface PokemonState {
  pokemon: Pokemon[];
  loading: boolean;
  error: string | null;
  selectedType: string;
  searchQuery: string;
  currentPage: number;
  hasMore: boolean;

  // Actions
  setPokemon: (pokemon: Pokemon[]) => void;
  appendPokemon: (pokemon: Pokemon[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedType: (type: string) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
  resetState: () => void;
}

const initialState = {
  pokemon: [],
  loading: false,
  error: null,
  selectedType: "Todos",
  searchQuery: "",
  currentPage: 1,
  hasMore: true,
};

/**
 * Zustand store for managing Pokemon data and UI state
 */
export const usePokemonStore = create<PokemonState>((set) => ({
  ...initialState,

  setPokemon: (pokemon) => set({ pokemon }),

  appendPokemon: (pokemon) =>
    set((state) => ({
      pokemon: [...state.pokemon, ...pokemon],
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setSelectedType: (selectedType) => set({ selectedType }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setCurrentPage: (currentPage) => set({ currentPage }),

  setHasMore: (hasMore) => set({ hasMore }),

  resetState: () => set(initialState),
}));
