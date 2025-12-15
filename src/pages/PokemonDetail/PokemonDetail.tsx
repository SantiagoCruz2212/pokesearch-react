import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  IoHeart,
  IoHeartOutline,
  IoAdd,
  IoRemove,
  IoLocationSharp,
  IoGitNetwork,
} from "react-icons/io5";
import toast from "react-hot-toast";
import { Pokemon } from "@/types/pokemon";
import {
  getPokemonById,
  getPokemonEncounters,
  getPokemonSpecies,
  getEvolutionChain,
  type PokemonEncounter,
  type ChainLink,
} from "@/api";
import { getPokemonImage } from "@/utils/pokemon";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useTeamStore } from "@/store/useTeamStore";
import { TYPE_NAME_MAP } from "@/constants/typeFilters";
import { getTypeEffectiveness } from "@/constants/typeEffectiveness";
import TeamFullModal from "@/components/TeamFullModal/TeamFullModal";

const PokemonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [encounters, setEncounters] = useState<PokemonEncounter[]>([]);
  const [evolutionChain, setEvolutionChain] = useState<
    Array<{ name: string; id: number }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [loadingEncounters, setLoadingEncounters] = useState(true);
  const [loadingEvolution, setLoadingEvolution] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const {
    team,
    addToTeam,
    removeFromTeam,
    isInTeam,
    isTeamFull,
    replaceInTeam,
  } = useTeamStore();

  useEffect(() => {
    const fetchPokemon = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getPokemonById({ nameOrId: id });
        setPokemon(data);
      } catch (err) {
        setError("No se pudo cargar la información del Pokémon");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);

  useEffect(() => {
    const fetchEncounters = async () => {
      if (!id) return;

      try {
        setLoadingEncounters(true);
        const data = await getPokemonEncounters({ nameOrId: id });
        setEncounters(data);
      } catch (err) {
        console.error("Error fetching encounters:", err);
        setEncounters([]);
      } finally {
        setLoadingEncounters(false);
      }
    };

    fetchEncounters();
  }, [id]);

  useEffect(() => {
    const fetchEvolutionChain = async () => {
      if (!id) return;

      try {
        setLoadingEvolution(true);
        // First get the species to get the evolution chain URL
        const species = await getPokemonSpecies({ nameOrId: id });

        // Extract the evolution chain ID from the URL
        const chainId = parseInt(
          species.evolution_chain.url.split("/").slice(-2, -1)[0]
        );

        // Get the evolution chain
        const chain = await getEvolutionChain({ id: chainId });

        // Flatten the evolution chain
        const flattenChain = (
          link: ChainLink
        ): Array<{ name: string; id: number }> => {
          // Extract ID from species URL (e.g., "https://pokeapi.co/api/v2/pokemon-species/1/" -> 1)
          const speciesId = parseInt(
            link.species.url.split("/").slice(-2, -1)[0]
          );
          const evolutions = [{ name: link.species.name, id: speciesId }];
          link.evolves_to.forEach((evolution) => {
            evolutions.push(...flattenChain(evolution));
          });
          return evolutions;
        };

        const evolutionData = flattenChain(chain.chain);
        setEvolutionChain(evolutionData);
      } catch (err) {
        console.error("Error fetching evolution chain:", err);
        setEvolutionChain([]);
      } finally {
        setLoadingEvolution(false);
      }
    };

    fetchEvolutionChain();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-500 text-lg">
          {error || "Pokémon no encontrado"}
        </p>
        <button
          onClick={() => navigate("/inicio")}
          className="px-6 py-2 bg-primary rounded-lg font-medium hover:bg-yellow-400 transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  const isFav = isFavorite(pokemon.id);
  const inTeam = isInTeam(pokemon.id);
  const imageUrl = getPokemonImage(pokemon);
  const paddedId = String(pokemon.id).padStart(3, "0");

  // Calculate type effectiveness
  const pokemonTypes = pokemon.types.map((t) => t.type.name);
  const typeEffectiveness = getTypeEffectiveness(pokemonTypes);

  const handleToggleTeam = () => {
    if (inTeam) {
      removeFromTeam(pokemon.id);
      toast.success(`${pokemon.name} removido del equipo`);
    } else {
      const success = addToTeam(pokemon.id);
      if (!success && isTeamFull()) {
        setShowTeamModal(true);
      } else if (success) {
        toast.success(`${pokemon.name} agregado al equipo`);
      }
    }
  };

  const handleReplace = (oldPokemonId: number) => {
    replaceInTeam(oldPokemonId, pokemon.id);
    toast.success(`${pokemon.name} agregado al equipo`);
  };

  const getStatColor = (statName: string) => {
    const colors: Record<string, string> = {
      hp: "bg-red-500",
      attack: "bg-orange-500",
      defense: "bg-yellow-500",
      "special-attack": "bg-blue-500",
      "special-defense": "bg-green-500",
      speed: "bg-pink-500",
    };
    return colors[statName] || "bg-gray-500";
  };

  const getStatLabel = (statName: string) => {
    const labels: Record<string, string> = {
      hp: "HP",
      attack: "ATK",
      defense: "DEF",
      "special-attack": "SP.ATK",
      "special-defense": "SP.DEF",
      speed: "SPD",
    };
    return labels[statName] || statName.toUpperCase();
  };

  const formatLocationName = (locationName: string) => {
    return locationName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="flex flex-1 justify-center py-5 px-4 md:px-10 lg:px-20">
      <div className="flex flex-col max-w-[1200px] flex-1 gap-6">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 px-4 py-2">
          <Link
            to="/inicio"
            className="text-gray-500 text-sm font-medium hover:text-primary transition-colors"
          >
            Inicio
          </Link>
          <span className="text-gray-400 text-sm font-medium">/</span>
          <span className="text-gray-900 text-sm font-medium">
            {pokemon.name}
          </span>
        </div>

        {/* Header Section */}
        <div className="flex flex-wrap justify-between items-end gap-4 px-4">
          <div>
            <p className="text-gray-500 text-lg font-bold tracking-wider mb-1">
              #{paddedId}
            </p>
            <h1 className="text-gray-900 text-4xl md:text-5xl font-black tracking-tight capitalize">
              {pokemon.name}
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => toggleFavorite(pokemon.id)}
              className="flex items-center gap-2 px-6 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 font-bold transition-all"
            >
              {isFav ? (
                <IoHeart className="w-5 h-5 text-red-500" />
              ) : (
                <IoHeartOutline className="w-5 h-5" />
              )}
              <span>Favorito</span>
            </button>
            <button
              onClick={handleToggleTeam}
              className={`flex items-center justify-center size-12 rounded-xl font-bold transition-all shadow-lg ${
                inTeam
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-primary hover:bg-yellow-300 shadow-primary/20"
              }`}
              title={inTeam ? "Remover del equipo" : "Agregar al equipo"}
            >
              {inTeam ? (
                <IoRemove className="w-6 h-6 text-white" />
              ) : (
                <IoAdd className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4">
          {/* Left Column */}
          <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
            {/* Hero Image Card */}
            <div className="relative w-full aspect-square bg-white rounded-3xl p-8 flex items-center justify-center shadow-sm border border-gray-100 overflow-hidden group">
              <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-100 via-transparent to-transparent"></div>
              <img
                alt={pokemon.name}
                className="w-full h-full object-contain z-10 drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                src={imageUrl}
              />
              <div className="absolute top-6 left-6 flex gap-2">
                {pokemon.types.map((type) => (
                  <div
                    key={type.type.name}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-black shadow-sm"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {TYPE_NAME_MAP[type.type.name] || type.type.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Abilities Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4">Habilidades</h3>
              <div className="space-y-2">
                {pokemon.abilities.map((ability, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <p className="text-sm font-medium capitalize">
                      {ability.ability.name.replace("-", " ")}
                      {ability.is_hidden && (
                        <span className="ml-2 text-xs text-gray-500">
                          (Oculta)
                        </span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Encounters Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <IoLocationSharp className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold">Ubicaciones</h3>
              </div>

              {loadingEncounters ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : encounters.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">
                    No se encontraron ubicaciones para este Pokémon
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {encounters.slice(0, 10).map((encounter, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 rounded-lg bg-gray-50 border border-gray-100"
                    >
                      <p className="text-sm font-medium">
                        {formatLocationName(encounter.location_area.name)}
                      </p>
                    </div>
                  ))}
                  {encounters.length > 10 && (
                    <p className="text-xs text-gray-500 text-center pt-2">
                      Y {encounters.length - 10} ubicaciones más...
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
            {/* Physical Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
                <p className="text-gray-500 text-xs font-bold uppercase mb-1">
                  Altura
                </p>
                <p className="font-bold text-lg">
                  {(pokemon.height / 10).toFixed(1)} m
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
                <p className="text-gray-500 text-xs font-bold uppercase mb-1">
                  Peso
                </p>
                <p className="font-bold text-lg">
                  {(pokemon.weight / 10).toFixed(1)} kg
                </p>
              </div>
              {/* <div className="bg-white dark:bg-[#2f2e18] p-4 rounded-xl border border-gray-100 dark:border-[#3e3d28] text-center">
                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase mb-1">
                  Experiencia
                </p>
                <p className="font-bold text-lg">
                  {pokemon.base_experience || 'N/A'}
                </p>
              </div> */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
                <p className="text-gray-500 text-xs font-bold uppercase mb-1">
                  Habilidad
                </p>
                <p
                  className="font-bold text-sm truncate capitalize"
                  title={pokemon.abilities[0]?.ability.name}
                >
                  {pokemon.abilities[0]?.ability.name.replace("-", " ") ||
                    "N/A"}
                </p>
              </div>
            </div>

            {/* Type Effectiveness */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4">Efectividad de Tipo</h3>

              {/* Strong Against */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-gray-700 mb-3">
                  Fuerte contra
                </h4>
                {typeEffectiveness.strongAgainst.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {typeEffectiveness.strongAgainst.map((type) => (
                      <div
                        key={type}
                        className={`px-3 py-1.5 rounded-lg ${"bg-gray-100"} border border-gray-200`}
                      >
                        <span
                          className={`text-xs font-bold uppercase tracking-wider ${"text-gray-600"}`}
                        >
                          {TYPE_NAME_MAP[type] || type}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Ninguna ventaja especial
                  </p>
                )}
              </div>

              {/* Weak Against */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-3">
                  Débil contra
                </h4>
                {typeEffectiveness.weakAgainst.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {typeEffectiveness.weakAgainst.map((type) => (
                      <div
                        key={type}
                        className={`px-3 py-1.5 rounded-lg ${"bg-gray-100"} border border-gray-200`}
                      >
                        <span
                          className={`text-xs font-bold uppercase tracking-wider ${"text-gray-600"}`}
                        >
                          {TYPE_NAME_MAP[type] || type}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Ninguna debilidad especial
                  </p>
                )}
              </div>
            </div>

            {/* Base Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-6">Estadísticas Base</h3>
              <div className="space-y-4">
                {pokemon.stats.map((stat) => {
                  const percentage = Math.min(
                    (stat.base_stat / 255) * 100,
                    100
                  );
                  return (
                    <div
                      key={stat.stat.name}
                      className="flex items-center gap-4"
                    >
                      <span className="w-20 text-sm font-bold text-gray-500">
                        {getStatLabel(stat.stat.name)}
                      </span>
                      <span className="w-12 text-sm font-bold text-right">
                        {stat.base_stat}
                      </span>
                      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getStatColor(
                            stat.stat.name
                          )} rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Evolution Chain Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <IoGitNetwork className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold">Evoluciones</h3>
              </div>

              {loadingEvolution ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : evolutionChain.length <= 1 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">
                    Este Pokémon no evoluciona
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2">
                  {evolutionChain.map((evolution, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/pokemon/${evolution.name}`)}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all min-w-[100px]"
                      >
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.id}.png`}
                          alt={evolution.name}
                          className="w-16 h-16 object-contain"
                          onError={(e) => {
                            e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png`;
                          }}
                        />
                        <p className="text-xs font-medium capitalize text-center">
                          {evolution.name}
                        </p>
                      </button>
                      {index < evolutionChain.length - 1 && (
                        <span className="text-2xl text-gray-400 font-bold">
                          →
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Team Full Modal */}
        <TeamFullModal
          isOpen={showTeamModal}
          onClose={() => setShowTeamModal(false)}
          teamIds={team}
          newPokemon={pokemon}
          onReplace={handleReplace}
        />
      </div>
    </div>
  );
};

export default PokemonDetail;
