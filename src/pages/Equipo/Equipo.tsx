import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose, IoAdd, IoTrash } from "react-icons/io5";
import { useTeamStore } from "@/store/useTeamStore";
import { getPokemonById } from "@/api";
import { getPokemonImage } from "@/utils/pokemon";
import { Pokemon } from "@/types/pokemon";
import { TYPE_NAME_MAP } from "@/constants/typeFilters";

const Equipo = () => {
  const navigate = useNavigate();
  const { team, removeFromTeam, clearTeam } = useTeamStore();
  const [teamPokemon, setTeamPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      if (team.length === 0) {
        setTeamPokemon([]);
        return;
      }

      setLoading(true);
      try {
        const pokemonPromises = team.map((id) =>
          getPokemonById({ nameOrId: id })
        );
        const pokemon = await Promise.all(pokemonPromises);
        setTeamPokemon(pokemon);
      } catch (error) {
        console.error("Error fetching team Pokemon:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [team]);

  const getTypeColor = (typeName: string) => {
    const colors: Record<string, string> = {
      fire: "bg-orange-500",
      water: "bg-blue-500",
      grass: "bg-green-500",
      electric: "bg-yellow-400",
      psychic: "bg-purple-500",
      rock: "bg-gray-500",
      fairy: "bg-pink-400",
      poison: "bg-purple-700",
      fighting: "bg-red-700",
      ground: "bg-amber-700",
      flying: "bg-indigo-400",
      normal: "bg-gray-400",
      bug: "bg-lime-500",
      ghost: "bg-indigo-700",
      steel: "bg-gray-400",
      dragon: "bg-indigo-600",
      dark: "bg-gray-800",
      ice: "bg-cyan-400",
    };
    return colors[typeName] || "bg-gray-500";
  };

  const calculateAverageAttack = () => {
    if (teamPokemon.length === 0) return 0;
    const totalAttack = teamPokemon.reduce((sum, pokemon) => {
      const attackStat = pokemon.stats.find((s) => s.stat.name === "attack");
      return sum + (attackStat?.base_stat || 0);
    }, 0);
    return Math.round(totalAttack / teamPokemon.length);
  };

  const getUniqueTypes = () => {
    const types = new Set<string>();
    teamPokemon.forEach((pokemon) => {
      pokemon.types.forEach((typeInfo) => {
        types.add(typeInfo.type.name);
      });
    });
    return Array.from(types);
  };

  const uniqueTypes = getUniqueTypes();
  const averageAttack = calculateAverageAttack();

  // Create 6 slots array
  const slots = Array(6)
    .fill(null)
    .map((_, index) => teamPokemon[index] || null);

  return (
    <div className="container mx-auto py-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
            Gestión de Equipo de Combate
          </h1>
          <p className="text-gray-500 text-lg">
            Arma tu equipo ideal para el competitivo. Tu selección se sincroniza
            automáticamente con el almacenamiento de tu navegador.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={clearTeam}
            disabled={team.length === 0}
            className="flex items-center gap-2 px-4 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
          >
            <IoTrash className="text-lg" />
            Limpiar
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {/* Members */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 font-medium text-sm">Miembros</p>
          </div>
          <p className="text-3xl font-bold">
            {team.length}{" "}
            <span className="text-gray-400 text-xl font-normal">/ 6</span>
          </p>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${(team.length / 6) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Average Attack */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 font-medium text-sm">Media Ataque</p>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold">{averageAttack}</p>
          </div>
          <p className="text-xs text-gray-400 mt-1">Promedio del equipo</p>
        </div>

        {/* Type Coverage */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 font-medium text-sm">Cobertura Tipos</p>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {uniqueTypes.slice(0, 6).map((type) => (
              <span
                key={type}
                className={`size-3 rounded-full ${getTypeColor(type)}`}
                title={TYPE_NAME_MAP[type] || type}
              ></span>
            ))}
            {Array(6 - Math.min(uniqueTypes.length, 6))
              .fill(null)
              .map((_, i) => (
                <span
                  key={`empty-${i}`}
                  className="size-3 rounded-full bg-gray-300"
                ></span>
              ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {uniqueTypes.length} tipos cubiertos
          </p>
        </div>
      </div>

      {/* Active Team Slots */}
      <h3 className="text-xl font-bold mb-5">Equipo Activo</h3>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {slots.map((pokemon, index) => (
            <div key={index}>
              {pokemon ? (
                <div className="group relative bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={() => removeFromTeam(pokemon.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 rounded p-1 transition-colors"
                    >
                      <IoClose className="w-4 h-4" />
                    </button>
                  </div>
                  <div
                    className="aspect-square rounded-lg bg-gray-50 mb-3 flex items-center justify-center relative overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/pokemon/${pokemon.id}`)}
                  >
                    <img
                      src={getPokemonImage(pokemon)}
                      alt={pokemon.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-bold leading-none capitalize truncate">
                      {pokemon.name}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {pokemon.types.map((typeInfo) => (
                        <span
                          key={typeInfo.type.name}
                          className={`px-2 py-0.5 rounded text-xs font-bold text-white ${getTypeColor(
                            typeInfo.type.name
                          )}`}
                        >
                          {TYPE_NAME_MAP[typeInfo.type.name] ||
                            typeInfo.type.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 min-h-[220px] cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                  onClick={() => navigate("/inicio")}
                >
                  <div className="size-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IoAdd className="w-6 h-6 text-gray-400 group-hover:text-primary" />
                  </div>
                  <p className="text-gray-500 font-medium text-sm group-hover:text-primary">
                    Vacío
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {team.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border border-gray-200 p-8">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <IoAdd className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">Tu equipo está vacío</h3>
          <p className="text-gray-500 mb-6 max-w-md">
            Comienza a armar tu equipo de combate explorando el Pokédex y
            agregando Pokémon con el botón "+".
          </p>
          <button
            onClick={() => navigate("/inicio")}
            className="px-6 py-3 bg-primary text-black rounded-lg font-bold hover:bg-yellow-300 transition-colors"
          >
            Explorar Pokédex
          </button>
        </div>
      )}
    </div>
  );
};

export default Equipo;
