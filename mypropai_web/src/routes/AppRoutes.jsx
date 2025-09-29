import { Routes, Route } from "react-router-dom";

// Pages
import Index from "../pages/Index";
import Aboutus from "../pages/Aboutus";
import Forlocal from "../pages/Forlocal";
import Plans from "../pages/Plans";

// Components
import HomeHeader from "../components/common/HomeHeader";
import PageHeader from "../components/common/PageHeader";

// Route groups
import AuthRoutes from "./AuthRoutes";
import PropertyRoutes from "./PropertyRoutes";

const staticRoutes = [
  { path: "/", element: <Index /> },
  { path: "/about-us", element: <Aboutus /> },
  { path: "/subscription-plans", element: <Plans /> },
  { path: "/local", element: <Forlocal /> },
  
  { path: "/header", element: <HomeHeader /> },
  { path: "/page", element: <PageHeader /> },
];

function AppRoutes() {
  return (
    <Routes>
      {/* Auth & Property Routes */}
      {AuthRoutes()}
      {PropertyRoutes()}

      {/* Static Pages */}
      {staticRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Routes>
  );
}

export default AppRoutes;
