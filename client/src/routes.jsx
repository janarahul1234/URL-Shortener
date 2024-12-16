import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import PublicRoutes from "./components/PublicRoutes";
import ProtectedRoutes from "./components/ProtectedRoutes";
import GoogleCallback from "./pages/GoogleCallback";

const HomePage = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() => import("./pages/Login"));
const SignupPage = lazy(() => import("./pages/Signup"));
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const DashboardPage = lazy(() => import("./pages/Dashboard"));
const ProfilePage = lazy(() => import("./pages/Profile"));
const LinksPage = lazy(() => import("./pages/Links"));
const CreateLinkPage = lazy(() => import("./pages/Links/Create"));
const EditLinkPage = lazy(() => import("./pages/Links/Edit"));

const router = createBrowserRouter([
  {
    element: <PublicRoutes />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/auth/google",
        element: <GoogleCallback />,
      },
    ],
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
          {
            path: "/links",
            children: [
              {
                path: "",
                element: <LinksPage />,
              },
              {
                path: "create",
                element: <CreateLinkPage />,
              },
              {
                path: ":id/edit",
                element: <EditLinkPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
