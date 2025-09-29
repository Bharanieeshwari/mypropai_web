import { Route } from "react-router-dom";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import EditProfile from "../features/auth/EditProfile";
import MyActivity from "../features/auth/MyActivity";

const authRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/edit-profile", element: <EditProfile /> },
  { path: "/my-activity", element: <MyActivity /> },
];

const AuthRoutes = () =>
  authRoutes.map(({ path, element }) => <Route key={path} path={path} element={element} />);

export default AuthRoutes;
