import { useMutation } from "react-query";
import { NavLink, Outlet } from "react-router-dom";

import apiClient from "@/apiClient";
import { useAuth } from "@/contexts/AuthContext";

import {
  RiLink,
  RiUser3Line,
  RiDashboardLine,
  RiLogoutBoxLine,
} from "react-icons/ri";
import Logo from "@/components/Logo";
import Loader from "@/components/Loader";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: RiDashboardLine,
  },
  {
    title: "Links",
    url: "/links",
    icon: RiLink,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: RiUser3Line,
  },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  const logoutMutation = useMutation(() => apiClient.get(`/api/auth/logout`), {
    onSuccess: () => logout(),
  });

  const handleLogout = () => logoutMutation.mutate();

  return (
    <section className="grid grid-cols-[16rem_1fr]">
      <aside className="h-screen pt-6 p-4 flex flex-col gap-14 border-r border-gray-200">
        <Logo className="mx-4" />

        <div className="flex-1 space-y-2">
          {items.map((item) => (
            <MenuItem key={item.title} {...item} />
          ))}
        </div>

        <LogoutButton
          handleLogout={handleLogout}
          isLoading={logoutMutation.isLoading}
        />
      </aside>

      <div className="h-screen flex flex-col">
        <div className="flex justify-end px-8 py-6 ">
          <UserInfo name={user?.name} avatar={user?.avatar} />
        </div>

        <div className="flex-1 pt-4 overflow-y-auto">
          <div className="max-w-[48rem] mx-auto px-8">
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  );
};

const MenuItem = ({ title, icon: Icon, url }) => {
  return (
    <NavLink
      to={url}
      className={({ isActive }) =>
        `flex items-center gap-3.5 px-4 py-3.5 rounded-lg transition duration-300 focus:outline-gray-400 ${
          isActive
            ? "text-white bg-gray-900"
            : "text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-700"
        }`
      }
    >
      <Icon className="flex-shrink-0 text-xl" />
      <span className="font-medium">{title}</span>
    </NavLink>
  );
};

const LogoutButton = ({ handleLogout, isLoading }) => {
  return (
    <button
      className={`flex items-center gap-3.5 px-4 py-3.5 rounded-lg transition duration-300 focus:outline-gray-400 focus:ring-gray-400 hover:bg-red-50 hover:text-red-500 ${
        isLoading && "justify-center"
      } `}
      onClick={handleLogout}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <RiLogoutBoxLine className="flex-shrink-0 text-xl" />
          <span className="font-medium">Log out</span>
        </>
      )}
    </button>
  );
};

const UserInfo = ({ name, avatar }) => (
  <div className="flex items-center gap-3.5">
    {avatar ? (
      <img
        src={avatar}
        alt="profile"
        className="w-10 h-10 object-cover border border-gray-100 rounded-lg"
      />
    ) : (
      <div className="w-10 h-10 bg-slate-50 border border-gray-100 grid place-items-center rounded-lg">
        <RiUser3Line className="text-gray-400 text-xl" />
      </div>
    )}
    <span className="text-gray-900">{name}</span>
  </div>
);

export default DashboardLayout;
