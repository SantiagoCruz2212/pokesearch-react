import Inicio from "@/pages/Inicio/Inicio";
import Favoritos from "@/pages/Favoritos/Favoritos";
import Equipo from "@/pages/Equipo/Equipo";
import PokemonDetail from "@/pages/PokemonDetail/PokemonDetail";

const routes = [
  {
    path: "/",
    component: Inicio,
    name: "Inicio",
    exact: true,
    private: false,
    icon: null,
    enabled: true,
    routeEnabled: true,
    layout: true,
  },
  {
    path: "/inicio",
    component: Inicio,
    name: "Inicio",
    exact: true,
    private: false,
    icon: null,
    enabled: true,
    routeEnabled: true,
    layout: true,
  },
  {
    path: "/favoritos",
    component: Favoritos,
    name: "Favoritos",
    exact: true,
    private: false,
    icon: null,
    enabled: true,
    routeEnabled: true,
    layout: true,
  },
  {
    path: "/equipo",
    component: Equipo,
    name: "Equipo",
    exact: true,
    private: false,
    icon: null,
    enabled: true,
    routeEnabled: true,
    layout: true,
  },
  {
    path: "/pokemon/:id",
    component: PokemonDetail,
    name: "Pokemon Detail",
    exact: true,
    private: false,
    icon: null,
    enabled: true,
    routeEnabled: true,
    layout: true,
  },
];

export default routes;
