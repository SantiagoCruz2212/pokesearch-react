import { useEffect, useState } from 'react';
import { getTypes } from '@/api';
import { IconType } from 'react-icons';
import {
  IoGrid,
  IoFlame,
  IoWater,
  IoLeaf,
  IoFlash,
  IoBulb,
  IoSparkles,
  IoSkull,
  IoFitness,
  IoAirplane,
  IoSnow,
  IoBug,
  IoShield,
  IoMoon,
  IoEye,
} from 'react-icons/io5';
import { GiStoneBlock, GiMountains, GiSpikedDragonHead } from 'react-icons/gi';

interface TypeOption {
  name: string;
  englishName: string;
  IconComponent: IconType;
  color: string;
  bgColor: string;
}

// Icon mapping for each type
const TYPE_ICON_MAP: Record<string, IconType> = {
  fire: IoFlame,
  water: IoWater,
  grass: IoLeaf,
  electric: IoFlash,
  psychic: IoBulb,
  rock: GiStoneBlock,
  fairy: IoSparkles,
  poison: IoSkull,
  fighting: IoFitness,
  ground: GiMountains,
  flying: IoAirplane,
  normal: IoGrid,
  bug: IoBug,
  ghost: IoEye,
  steel: IoShield,
  dragon: GiSpikedDragonHead,
  dark: IoMoon,
  ice: IoSnow,
};

// Color mapping for each type
const TYPE_COLOR_MAP: Record<string, { color: string; bgColor: string }> = {
  fire: { color: 'text-orange-500', bgColor: 'bg-orange-100' },
  water: { color: 'text-blue-500', bgColor: 'bg-blue-100' },
  grass: { color: 'text-green-500', bgColor: 'bg-green-100' },
  electric: { color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
  psychic: { color: 'text-purple-500', bgColor: 'bg-purple-100' },
  rock: { color: 'text-gray-500', bgColor: 'bg-gray-100' },
  fairy: { color: 'text-pink-400', bgColor: 'bg-pink-100' },
  poison: { color: 'text-purple-700', bgColor: 'bg-purple-100' },
  fighting: { color: 'text-red-700', bgColor: 'bg-red-100' },
  ground: { color: 'text-amber-700', bgColor: 'bg-amber-100' },
  flying: { color: 'text-indigo-400', bgColor: 'bg-indigo-100' },
  normal: { color: 'text-gray-400', bgColor: 'bg-gray-100' },
  bug: { color: 'text-lime-500', bgColor: 'bg-lime-100' },
  ghost: { color: 'text-indigo-700', bgColor: 'bg-indigo-100' },
  steel: { color: 'text-gray-400', bgColor: 'bg-gray-100' },
  dragon: { color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  dark: { color: 'text-gray-800', bgColor: 'bg-gray-200' },
  ice: { color: 'text-cyan-400', bgColor: 'bg-cyan-100' },
};

// Spanish translation mapping
const TYPE_SPANISH_MAP: Record<string, string> = {
  fire: 'Fuego',
  water: 'Agua',
  grass: 'Planta',
  electric: 'Eléctrico',
  psychic: 'Psíquico',
  rock: 'Roca',
  fairy: 'Hada',
  poison: 'Veneno',
  fighting: 'Lucha',
  ground: 'Tierra',
  flying: 'Volador',
  normal: 'Normal',
  bug: 'Bicho',
  ghost: 'Fantasma',
  steel: 'Acero',
  dragon: 'Dragón',
  dark: 'Siniestro',
  ice: 'Hielo',
};

export const useTypes = () => {
  const [types, setTypes] = useState<TypeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        setLoading(true);
        const response = await getTypes({ limit: 100 });

        // Filter out shadow and unknown types and map to our format
        const mappedTypes: TypeOption[] = response.results
          .filter((type) => type.name !== 'shadow' && type.name !== 'unknown')
          .map((type) => ({
            name: TYPE_SPANISH_MAP[type.name] || type.name,
            englishName: type.name,
            IconComponent: TYPE_ICON_MAP[type.name] || IoGrid,
            color: TYPE_COLOR_MAP[type.name]?.color || 'text-gray-400',
            bgColor: TYPE_COLOR_MAP[type.name]?.bgColor || 'bg-gray-100',
          }));

        // Add "Todos" option at the beginning
        const allTypes: TypeOption[] = [
          {
            name: 'Todos',
            englishName: 'all',
            IconComponent: IoGrid,
            color: 'text-black',
            bgColor: 'bg-primary',
          },
          ...mappedTypes,
        ];

        setTypes(allTypes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching types');
        console.error('Error fetching types:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, []);

  return { types, loading, error };
};
