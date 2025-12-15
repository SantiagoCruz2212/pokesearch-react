import { IoSearchCircle } from 'react-icons/io5';
import { Pokemon } from '@/types/pokemon';
import PokemonCard from '../PokemonCard/PokemonCard';

interface PokemonGridProps {
  pokemon: Pokemon[];
  favorites: number[];
  onToggleFavorite: (pokemonId: number) => void;
  onPokemonClick?: (pokemon: Pokemon) => void;
  team?: number[];
  onToggleTeam?: (pokemon: Pokemon) => void;
}

const PokemonGrid = ({
  pokemon,
  favorites,
  onToggleFavorite,
  onPokemonClick,
  team = [],
  onToggleTeam,
}: PokemonGridProps) => {
  if (pokemon.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <IoSearchCircle className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No se encontraron Pokémon
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
          Intenta con otro nombre o filtro
        </p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {pokemon.map((p) => (
        <PokemonCard
          key={p.id}
          pokemon={p}
          isFavorite={favorites.includes(p.id)}
          onToggleFavorite={onToggleFavorite}
          onClick={onPokemonClick}
          inTeam={team.includes(p.id)}
          onToggleTeam={onToggleTeam}
        />
      ))}
    </section>
  );
};

export default PokemonGrid;
