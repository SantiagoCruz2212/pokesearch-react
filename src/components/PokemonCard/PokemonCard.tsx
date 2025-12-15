import { IoHeart, IoHeartOutline, IoAdd, IoRemove } from "react-icons/io5";
import { Pokemon } from "@/types/pokemon";
import { TYPE_NAME_MAP } from "@/constants/typeFilters";
import { getPokemonImage } from "@/utils/pokemon";

interface PokemonCardProps {
  pokemon: Pokemon;
  isFavorite: boolean;
  onToggleFavorite: (pokemonId: number) => void;
  onClick?: (pokemon: Pokemon) => void;
  inTeam?: boolean;
  onToggleTeam?: (pokemon: Pokemon) => void;
}

const getTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    fire: "bg-orange-100 text-orange-700",
    water: "bg-blue-100 text-blue-700",
    grass: "bg-green-100 text-green-700",
    electric: "bg-yellow-100 text-yellow-700",
    psychic: "bg-purple-100 text-purple-700",
    rock: "bg-gray-100 text-gray-700",
    fairy: "bg-pink-100 text-pink-700",
    poison: "bg-purple-100 text-purple-700",
    fighting: "bg-red-100 text-red-700",
    ground: "bg-amber-100 text-amber-700",
    flying: "bg-indigo-100 text-indigo-700",
    normal: "bg-gray-100 text-gray-700",
    bug: "bg-lime-100 text-lime-700",
    ghost: "bg-indigo-100 text-indigo-700",
    steel: "bg-gray-100 text-gray-700",
    dragon: "bg-indigo-100 text-indigo-700",
    dark: "bg-gray-200 text-gray-800",
    ice: "bg-cyan-100 text-cyan-700",
  };
  return colorMap[type] || "bg-gray-100 text-gray-700";
};

const PokemonCard = ({
  pokemon,
  isFavorite,
  onToggleFavorite,
  onClick,
  inTeam = false,
  onToggleTeam,
}: PokemonCardProps) => {
  const imageUrl = getPokemonImage(pokemon);

  const handleClick = () => {
    onClick?.(pokemon);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(pokemon.id);
  };

  const handleToggleTeam = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleTeam?.(pokemon);
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      {/* Action Buttons Container */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        {/* Toggle Team Button */}
        {onToggleTeam && (
          <button
            onClick={handleToggleTeam}
            className={`p-1.5 rounded-full transition-all ${
              inTeam
                ? "bg-green-500 hover:bg-green-600"
                : "bg-primary hover:bg-yellow-300"
            }`}
            title={inTeam ? "Remover del equipo" : "Agregar al equipo"}
          >
            {inTeam ? (
              <IoRemove className="w-5 h-5 text-white" />
            ) : (
              <IoAdd className="w-5 h-5 text-black" />
            )}
          </button>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`p-1.5 rounded-full bg-white/70 hover:bg-white transition-colors ${
            isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-500"
          }`}
        >
          {isFavorite ? (
            <IoHeart className="w-5 h-5" />
          ) : (
            <IoHeartOutline className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="p-6 pb-0 flex items-center justify-center bg-gray-50 aspect-[4/3]">
        <img
          src={imageUrl}
          alt={pokemon.name}
          className="w-32 h-32 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
        />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <p className="text-xs font-bold text-gray-400">
          #{pokemon.id.toString().padStart(3, "0")}
        </p>
        <h3 className="text-lg font-bold text-gray-900 leading-none capitalize">
          {pokemon.name}
        </h3>
        <div className="flex gap-1.5 mt-1">
          {pokemon.types.map((typeInfo) => (
            <span
              key={typeInfo.type.name}
              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getTypeColor(
                typeInfo.type.name
              )}`}
            >
              {TYPE_NAME_MAP[typeInfo.type.name] || typeInfo.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
