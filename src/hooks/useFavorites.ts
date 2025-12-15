import { useFavoritesStore } from '@/store/useFavoritesStore';

interface UseFavoritesReturn {
  favorites: number[];
  isFavorite: (pokemonId: number) => boolean;
  toggleFavorite: (pokemonId: number) => void;
  addFavorite: (pokemonId: number) => void;
  removeFavorite: (pokemonId: number) => void;
  clearFavorites: () => void;
}

/**
 * Custom hook to manage favorite Pokemon using Zustand store
 * This provides a clean API wrapper around the Zustand store
 */
export function useFavorites(): UseFavoritesReturn {
  const {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
  } = useFavoritesStore();

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
  };
}
