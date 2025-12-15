import { IoSearch } from "react-icons/io5";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput = ({
  value,
  onChange,
  placeholder = "Busca un Pokémon por su nombre o ID (ej. Pikachu o 25)...",
}: SearchInputProps) => {
  return (
    <section className="w-full max-w-3xl mx-auto">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <IoSearch className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="block w-full rounded-xl border-0 py-4 pl-12 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-lg sm:leading-6 bg-white transition-shadow"
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          <kbd className="hidden sm:inline-flex items-center rounded border border-gray-200 px-2 font-sans text-xs text-gray-400">
            ⌘K
          </kbd>
        </div>
      </div>
    </section>
  );
};

export default SearchInput;
