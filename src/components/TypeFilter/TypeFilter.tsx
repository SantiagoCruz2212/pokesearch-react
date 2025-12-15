import { useRef, useState, useEffect } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useTypes } from "@/hooks/useTypes";

interface TypeFilterProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
}

const TypeFilter = ({ selectedType, onTypeSelect }: TypeFilterProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Fetch types from API
  const { types, loading } = useTypes();

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    const newScrollLeft =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    e.preventDefault();
    container.scrollLeft += e.deltaY;
    checkScroll();
  };

  return (
    <section className="w-full relative">
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Type Filters */}
      {!loading && (
        <>
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-0 bottom-4 z-10 flex items-center justify-center w-10 bg-gradient-to-r from-[#f8f8f5] to-transparent"
              aria-label="Scroll left"
            >
              <div className="bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-colors">
                <IoChevronBack className="w-4 h-4" />
              </div>
            </button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            onWheel={handleWheel}
            className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {types.map((type) => {
              const isSelected = selectedType === type.name;
              const Icon = type.IconComponent;

              return (
                <button
                  key={type.name}
                  onClick={() => onTypeSelect(type.name)}
                  className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-transform hover:scale-105 active:scale-95 ${
                    isSelected
                      ? "bg-primary shadow-sm"
                      : "bg-white border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isSelected ? "text-black" : type.color}`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-black font-bold" : ""
                    }`}
                  >
                    {type.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-0 bottom-4 z-10 flex items-center justify-center w-10 bg-gradient-to-l from-[#f8f8f5] to-transparent"
              aria-label="Scroll right"
            >
              <div className="bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-colors">
                <IoChevronForward className="w-4 h-4" />
              </div>
            </button>
          )}
        </>
      )}
    </section>
  );
};

export default TypeFilter;
