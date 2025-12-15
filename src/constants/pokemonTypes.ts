export const POKEMON_TYPES = [
  { name: 'Todos', color: 'bg-gray-400 hover:bg-gray-500' },
  { name: 'normal', color: 'bg-gray-400 hover:bg-gray-500' },
  { name: 'fire', color: 'bg-red-500 hover:bg-red-600' },
  { name: 'water', color: 'bg-blue-500 hover:bg-blue-600' },
  { name: 'electric', color: 'bg-yellow-400 hover:bg-yellow-500' },
  { name: 'grass', color: 'bg-green-500 hover:bg-green-600' },
  { name: 'ice', color: 'bg-cyan-400 hover:bg-cyan-500' },
  { name: 'fighting', color: 'bg-red-700 hover:bg-red-800' },
  { name: 'poison', color: 'bg-purple-500 hover:bg-purple-600' },
  { name: 'ground', color: 'bg-yellow-600 hover:bg-yellow-700' },
  { name: 'flying', color: 'bg-indigo-400 hover:bg-indigo-500' },
  { name: 'psychic', color: 'bg-pink-500 hover:bg-pink-600' },
  { name: 'bug', color: 'bg-lime-500 hover:bg-lime-600' },
  { name: 'rock', color: 'bg-yellow-700 hover:bg-yellow-800' },
  { name: 'ghost', color: 'bg-purple-700 hover:bg-purple-800' },
  { name: 'dragon', color: 'bg-indigo-700 hover:bg-indigo-800' },
  { name: 'dark', color: 'bg-gray-800 hover:bg-gray-900' },
  { name: 'steel', color: 'bg-gray-500 hover:bg-gray-600' },
  { name: 'fairy', color: 'bg-pink-300 hover:bg-pink-400' },
] as const;

export type PokemonType = typeof POKEMON_TYPES[number]['name'];
