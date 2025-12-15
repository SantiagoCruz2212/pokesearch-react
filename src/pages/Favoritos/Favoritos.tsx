import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoHeartOutline } from "react-icons/io5";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useTeamStore } from "@/store/useTeamStore";
import { getPokemonById } from "@/api";
import { Pokemon } from "@/types/pokemon";
import PokemonGrid from "@/components/PokemonGrid/PokemonGrid";
import TeamFullModal from "@/components/TeamFullModal/TeamFullModal";

const Favoritos = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, clearFavorites } = useFavoritesStore();
  const { team, addToTeam, replaceInTeam, isTeamFull } = useTeamStore();
  const [favoritePokemon, setFavoritePokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [pendingPokemon, setPendingPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (favorites.length === 0) {
        setFavoritePokemon([]);
        return;
      }

      setLoading(true);
      try {
        const pokemonPromises = favorites.map((id) =>
          getPokemonById({ nameOrId: id })
        );
        const pokemon = await Promise.all(pokemonPromises);
        setFavoritePokemon(pokemon);
      } catch (error) {
        console.error("Error fetching favorite Pokemon:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites]);

  const handlePokemonClick = (pokemon: Pokemon) => {
    navigate(`/pokemon/${pokemon.id}`);
  };

  const handleAddToTeam = (pokemon: Pokemon) => {
    const success = addToTeam(pokemon.id);
    if (!success && isTeamFull()) {
      setPendingPokemon(pokemon);
      setShowTeamModal(true);
    }
  };

  const handleReplace = (oldPokemonId: number) => {
    if (pendingPokemon) {
      replaceInTeam(oldPokemonId, pendingPokemon.id);
      setPendingPokemon(null);
    }
  };

  return (
    <div className="container mx-auto">
      {/* Header */}
      <section className="flex flex-col items-center text-center gap-4 py-8 md:py-12">
        <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-gray-900">
          Mis Pokémon{" "}
          <span className="text-[#dcb300] dark:text-primary relative inline-block">
            Favoritos
          </span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl font-normal">
          Aquí encuentras todos los Pokémon que has marcado como favoritos
        </p>

        {favorites.length > 0 && (
          <button
            onClick={clearFavorites}
            className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Limpiar todos los favoritos
          </button>
        )}
      </section>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && favorites.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <IoHeartOutline className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No tienes Pokémon favoritos aún
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            Explora y marca tus Pokémon favoritos desde la página de inicio
          </p>
        </div>
      )}

      {/* Pokemon Grid */}
      {!loading && favorites.length > 0 && (
        <div className="mt-8">
          <PokemonGrid
            pokemon={favoritePokemon}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onPokemonClick={handlePokemonClick}
            team={team}
            onToggleTeam={handleAddToTeam}
          />
        </div>
      )}

      {/* Team Full Modal */}
      {pendingPokemon && (
        <TeamFullModal
          isOpen={showTeamModal}
          onClose={() => {
            setShowTeamModal(false);
            setPendingPokemon(null);
          }}
          teamIds={team}
          newPokemon={pendingPokemon}
          onReplace={handleReplace}
        />
      )}
    </div>
  );
};

export default Favoritos;
