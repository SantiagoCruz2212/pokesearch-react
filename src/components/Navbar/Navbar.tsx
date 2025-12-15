import { NavLink } from "react-router-dom";
import { IoEllipse } from "react-icons/io5";

const Navbar = () => {
  const navLinks = [
    { path: "/inicio", label: "Inicio" },
    { path: "/favoritos", label: "Favoritos" },
    { path: "/equipo", label: "Equipo" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e5e5e0] bg-white/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center size-8 rounded-full bg-primary text-black">
            <IoEllipse className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight">
            PokéSearch
          </h2>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? "text-primary" : "hover:text-primary"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
