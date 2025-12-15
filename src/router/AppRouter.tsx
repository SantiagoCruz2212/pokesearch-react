import { Route, Routes } from "react-router-dom";
import routes from "./routes";
import Layout from "@/components/Layout/Layout";

export const AppRouter = () => {
  const routeElement = (route: (typeof routes)[0]) => {
    return (
      <Layout>
        <route.component />
      </Layout>
    );
  };

  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={routeElement(route)}
        />
      ))}
    </Routes>
  );
};
