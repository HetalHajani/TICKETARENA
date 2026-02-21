import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  LogOut,
  ChevronRight,
} from "lucide-react";
import Logo from "./logo"; // Adjust path if needed

const SideBar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Bookings", icon: Calendar, path: "/admin/bookings" },
    { name: "Match", icon: Ticket, path: "/admin/events" },
  ];

  const handleLogoutConfirm = (e) => {
    e.preventDefault();
    localStorage.removeItem("authDetail-tickethub");
    navigate("/login");
  };

  return (
    <aside
      className={`
        w-72 h-screen
        bg-gradient-to-b from-slate-950 to-slate-900
        border-r border-slate-800/70
        flex flex-col
        shadow-2xl shadow-black/40
        backdrop-blur-sm
        select-none
        fixed top-0 left-0 z-50
      `}
    >
      {/* Fixed Header / Brand – now with hover group */}
      <div className="p-6 border-b border-slate-800/60 shrink-0 group">
        <div className="flex items-center gap-4">
          {/* Logo container with hover effect */}
          <div className=" flex items-center justify-center  transition-all duration-300 group-hover:scale-110 group-hover:shadow-orange-700/60 group-hover:ring-orange-400/50">
            <Logo />
          </div>
        </div>
      </div>
      <div className="text-center">
        {" "}
        <p className="text-3xl font-bold text-slate-300 group-hover:text-cyan-300 transition-colors mt-1">
          {" "}
          Admin Panel{" "}
        </p>{" "}
      </div>
      {/* Scrollable Navigation */}
      <nav
        className="
          flex-1 
          px-4 py-6 
          overflow-y-auto 
          scrollbar-thin 
          scrollbar-thumb-slate-700 
          scrollbar-track-slate-950 
          scrollbar-thumb-rounded-full
        "
      >
        <div className="space-y-1.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-base transition-all duration-200
                 ${
                   isActive
                     ? "bg-gradient-to-r from-orange-600/20 to-amber-600/10 text-orange-300 font-medium shadow-sm shadow-orange-900/30 border border-orange-700/30"
                     : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 hover:border-slate-700/40"
                 }`
              }
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors">
                <item.icon
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
              </div>
              <span>{item.name}</span>

              <ChevronRight
                size={16}
                className="ml-auto opacity-0 group-hover:opacity-60 transition-opacity"
              />
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-5 border-t border-slate-800/60 shrink-0">
        <button
          onClick={handleLogoutConfirm}
          className={`
            w-full flex items-center justify-center gap-3
            py-3.5 px-5 rounded-xl
            bg-gradient-to-r from-orange-950/50 to-amber-950/50
            hover:from-orange-900/70 hover:to-amber-900/70
            text-orange-300 hover:text-orange-200
            border border-orange-800/60 hover:border-orange-700/80
            transition-all duration-300 font-medium
            shadow-sm hover:shadow-orange-900/40
            backdrop-blur-sm
          `}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
