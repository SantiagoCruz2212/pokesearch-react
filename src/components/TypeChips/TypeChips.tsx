import { POKEMON_TYPES, PokemonType } from '@/constants/pokemonTypes';

interface TypeChipsProps {
  selectedType: PokemonType;
  onTypeSelect: (type: PokemonType) => void;
}

const TypeChips = ({ selectedType, onTypeSelect }: TypeChipsProps) => {
  return (
    <div className="w-full max-w-5xl mx-auto mb-8">
      <div className="flex flex-wrap gap-2 justify-center">
        {POKEMON_TYPES.map((type) => (
          <button
            key={type.name}
            onClick={() => onTypeSelect(type.name)}
            className={`px-4 py-2 rounded-full text-white font-medium transition-all transform hover:scale-105 ${
              type.color
            } ${
              selectedType === type.name
                ? 'ring-4 ring-offset-2 ring-primary scale-105'
                : ''
            }`}
          >
            {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TypeChips;
