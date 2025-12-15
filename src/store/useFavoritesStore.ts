import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FavoritesState {
  favorites: number[];
  addFavorite: (pokemonId: number) => void;
  removeFavorite: (pokemonId: number) => void;
  toggleFavorite: (pokemonId: number) => void;
  isFavorite: (pokemonId: number) => boolean;
  clearFavorites: () => void;
}

/**
 * Zustand store for managing favorite Pokemon
 * Persisted to localStorage automatically
 */
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (pokemonId: number) =>
        set((state) => {
          if (state.favorites.includes(pokemonId)) {
            return state;
          }
          return { favorites: [...state.favorites, pokemonId] };
        }),

      removeFavorite: (pokemonId: number) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== pokemonId),
        })),

      toggleFavorite: (pokemonId: number) => {
        const { favorites, addFavorite, removeFavorite } = get();
        if (favorites.includes(pokemonId)) {
          removeFavorite(pokemonId);
        } else {
          addFavorite(pokemonId);
        }
      },

      isFavorite: (pokemonId: number) => {
        return get().favorites.includes(pokemonId);
      },

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'pokemon-favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
