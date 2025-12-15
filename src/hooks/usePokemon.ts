import { useEffect, useCallback } from "react";
import { Pokemon } from "@/types/pokemon";
import {
  getPokemonById,
  getPokemonByType,
  getPokemonsWithDetails,
} from "@/api";
import { SPANISH_TO_ENGLISH_TYPE } from "@/constants/typeFilters";
import { usePokemonStore } from "@/store/usePokemonStore";

interface UsePokemonParams {
  searchQuery?: string;
  selectedType?: string;
  limit?: number;
  offset?: number;
}

interface UsePokemonReturn {
  pokemon: Pokemon[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  fetchPokemon: () => Promise<void>;
  resetPokemon: () => void;
}

/**
 * Custom hook to fetch and manage Pokemon data using Zustand store
 */
export function usePokemon({
  searchQuery = "",
  selectedType = "Todos",
  limit = 20,
  offset = 0,
}: UsePokemonParams = {}): UsePokemonReturn {
  const {
    pokemon,
    loading,
    error,
    hasMore,
    setPokemon,
    appendPokemon,
    setLoading,
    setError,
    setHasMore,
    resetState,
  } = usePokemonStore();

  const fetchPokemon = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let pokemonData: Pokemon[] = [];
      const isDefaultList =
        !searchQuery.trim() && (!selectedType || selectedType === "Todos");

      // If there's a search query, search for specific Pokemon
      if (searchQuery.trim()) {
        try {
          const result = await getPokemonById({
            nameOrId: searchQuery.toLowerCase(),
          });
          pokemonData = [result];
        } catch (error) {
          pokemonData = [];
        }
        setHasMore(false);
      }
      // If a type is selected (and not "Todos"), fetch by type
      else if (selectedType && selectedType !== "Todos") {
        const englishType =
          SPANISH_TO_ENGLISH_TYPE[selectedType] || selectedType.toLowerCase();
        const typeData = await getPokemonByType({ type: englishType });

        // Calculate pagination
        const startIndex = offset;
        const endIndex = offset + limit;
        const paginatedPokemon = typeData.pokemon.slice(startIndex, endIndex);

        // Fetch details for each Pokemon in the current page
        const detailsPromises = paginatedPokemon
          .map((p) => getPokemonById({ nameOrId: p.pokemon.name }));
        pokemonData = await Promise.all(detailsPromises);

        // Check if there are more Pokemon of this type
        setHasMore(endIndex < typeData.pokemon.length);
      }
      // Otherwise, fetch paginated list with details (optimized single call)
      else {
        const response = await getPokemonsWithDetails({ limit, offset });
        pokemonData = response.results;
        setHasMore(response.next !== null);
      }

      // Append to existing list if we're paginating (offset > 0)
      // This applies to both default list and type filtering
      const isTypeFiltering = selectedType && selectedType !== "Todos";
      if ((isDefaultList || isTypeFiltering) && offset > 0) {
        appendPokemon(pokemonData);
      } else {
        setPokemon(pokemonData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching Pokemon");
      setPokemon([]);
    } finally {
      setLoading(false);
    }
  }, [
    searchQuery,
    selectedType,
    limit,
    offset,
    setPokemon,
    appendPokemon,
    setLoading,
    setError,
    setHasMore,
  ]);

  const resetPokemon = useCallback(() => {
    resetState();
  }, [resetState]);

  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  return {
    pokemon,
    loading,
    error,
    hasMore,
    fetchPokemon,
    resetPokemon,
  };
}
