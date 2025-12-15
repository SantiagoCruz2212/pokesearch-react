import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { Pokemon } from '@/types/pokemon';
import { getPokemonById } from '@/api';
import { getPokemonImage } from '@/utils/pokemon';
import { TYPE_NAME_MAP } from '@/constants/typeFilters';

interface TeamFullModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamIds: number[];
  newPokemon: Pokemon;
  onReplace: (oldPokemonId: number) => void;
}

const TeamFullModal = ({
  isOpen,
  onClose,
  teamIds,
  newPokemon,
  onReplace,
}: TeamFullModalProps) => {
  const [teamPokemon, setTeamPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!isOpen) return;

      setLoading(true);
      try {
        const pokemonPromises = teamIds.map((id) =>
          getPokemonById({ nameOrId: id })
        );
        const pokemon = await Promise.all(pokemonPromises);
        setTeamPokemon(pokemon);
      } catch (error) {
        console.error('Error fetching team Pokemon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [isOpen, teamIds]);

  if (!isOpen) return null;

  const handleReplace = (oldPokemonId: number) => {
    onReplace(oldPokemonId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold">Equipo Completo</h2>
            <p className="text-sm text-gray-500 mt-1">
              Tu equipo ya tiene 6 Pokémon. Selecciona uno para reemplazar.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <IoClose className="w-6 h-6" />
          </button>
        </div>

        {/* New Pokemon to Add */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-500 mb-3">
            Pokémon a agregar:
          </p>
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-primary shadow-sm">
            <img
              src={getPokemonImage(newPokemon)}
              alt={newPokemon.name}
              className="w-16 h-16 object-contain"
            />
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-400">
                #{newPokemon.id.toString().padStart(3, '0')}
              </p>
              <h3 className="text-lg font-bold capitalize">{newPokemon.name}</h3>
              <div className="flex gap-1.5 mt-1">
                {newPokemon.types.map((typeInfo) => (
                  <span
                    key={typeInfo.type.name}
                    className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium"
                  >
                    {TYPE_NAME_MAP[typeInfo.type.name] || typeInfo.type.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Current Team */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-sm font-medium text-gray-500 mb-3">
            Selecciona un Pokémon para reemplazar:
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {teamPokemon.map((pokemon) => (
                <button
                  key={pokemon.id}
                  onClick={() => handleReplace(pokemon.id)}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all group"
                >
                  <img
                    src={getPokemonImage(pokemon)}
                    alt={pokemon.name}
                    className="w-14 h-14 object-contain group-hover:scale-110 transition-transform"
                  />
                  <div className="flex-1 text-left">
                    <p className="text-xs font-bold text-gray-400">
                      #{pokemon.id.toString().padStart(3, '0')}
                    </p>
                    <h4 className="text-base font-bold capitalize">{pokemon.name}</h4>
                    <div className="flex gap-1 mt-1">
                      {pokemon.types.map((typeInfo) => (
                        <span
                          key={typeInfo.type.name}
                          className="inline-flex items-center rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-medium"
                        >
                          {TYPE_NAME_MAP[typeInfo.type.name] || typeInfo.type.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs font-medium text-gray-400 group-hover:text-red-500 transition-colors">
                    Reemplazar
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamFullModal;
