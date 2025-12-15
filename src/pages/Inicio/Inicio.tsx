import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoAlertCircle, IoArrowUpCircle } from "react-icons/io5";
import toast from "react-hot-toast";
import SearchInput from "@/components/SearchInput/SearchInput";
import TypeFilter from "@/components/TypeFilter/TypeFilter";
import PokemonGrid from "@/components/PokemonGrid/PokemonGrid";
import TeamFullModal from "@/components/TeamFullModal/TeamFullModal";
import { usePokemon } from "@/hooks/usePokemon";
import { useFavorites } from "@/hooks/useFavorites";
import { useDebounce } from "@/hooks/useDebounce";
import { useTeamStore } from "@/store/useTeamStore";
import { Pokemon } from "@/types/pokemon";

const Inicio = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");
  const [offset, setOffset] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [pendingPokemon, setPendingPokemon] = useState<Pokemon | null>(null);
  const limit = 20;
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Debounce search term to avoid excessive API calls
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Fetch Pokemon data
  const { pokemon, loading, error, hasMore, resetPokemon } = usePokemon({
    searchQuery: debouncedSearch,
    selectedType,
    limit,
    offset,
  });
  const isInitialLoading = loading && pokemon.length === 0;

  // Manage favorites
  const { favorites, toggleFavorite } = useFavorites();

  // Manage team
  const { team, addToTeam, removeFromTeam, isInTeam, isTeamFull, replaceInTeam } = useTeamStore();

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setSearchTerm(""); // Clear search when changing type
  };

  // Auto-select "Todos" when user starts typing in search
  useEffect(() => {
    if (searchTerm.trim()) {
      setSelectedType("Todos");
    }
  }, [searchTerm]);

  // Reset pagination when search/type changes
  useEffect(() => {
    setOffset(0);
    resetPokemon();
  }, [debouncedSearch, selectedType, resetPokemon]);

  // Infinite scroll observer
  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore && !loading) {
          setOffset((prev) => prev + limit);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, limit]);

  // Show floating scroll-to-top button after scrolling down a bit
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    handleScroll(); // initialize on mount
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePokemonClick = (pokemon: Pokemon) => {
    navigate(`/pokemon/${pokemon.id}`);
  };

  const handleToggleTeam = (pokemon: Pokemon) => {
    if (isInTeam(pokemon.id)) {
      removeFromTeam(pokemon.id);
      toast.success(`${pokemon.name} removido del equipo`);
    } else {
      const success = addToTeam(pokemon.id);
      if (!success && isTeamFull()) {
        setPendingPokemon(pokemon);
        setShowTeamModal(true);
      } else if (success) {
        toast.success(`${pokemon.name} agregado al equipo`);
      }
    }
  };

  const handleReplace = (oldPokemonId: number) => {
    if (pendingPokemon) {
      replaceInTeam(oldPokemonId, pendingPokemon.id);
      toast.success(`${pendingPokemon.name} agregado al equipo`);
      setPendingPokemon(null);
    }
  };

  return (
    <div className="container mx-auto">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-4 py-8 md:py-12">
        <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-gray-900">
          Encuentra tu{" "}
          <span className="text-[#dcb300] relative inline-block">Pokémon</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl font-normal">
          Explora el mundo Pokémon buscando por nombre o filtrando por tipo para
          descubrir estadísticas, evoluciones y más.
        </p>
      </section>

      {/* Search Bar */}
      <SearchInput value={searchTerm} onChange={setSearchTerm} />

      {/* Type Filters */}
      <div className="mt-6">
        <TypeFilter
          selectedType={selectedType}
          onTypeSelect={handleTypeSelect}
        />
      </div>

      {/* Loading State */}
      {isInitialLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <IoAlertCircle className="w-24 h-24 text-red-500 mb-4" />
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      )}

      {/* Pokemon Grid */}
      {!isInitialLoading && !error && (
        <div className="mt-8">
          <PokemonGrid
            pokemon={pokemon}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onPokemonClick={handlePokemonClick}
            team={team}
            onToggleTeam={handleToggleTeam}
          />
        </div>
      )}

      {/* Infinite scroll loader */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {loading ? (
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          ) : null}
        </div>
      )}

      {/* Floating scroll-to-top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Volver arriba"
          className="fixed bottom-6 right-6 bg-primary text-white rounded-full shadow-lg p-3 hover:opacity-90 transition-opacity"
        >
          <IoArrowUpCircle className="w-8 h-8" />
        </button>
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

export default Inicio;
