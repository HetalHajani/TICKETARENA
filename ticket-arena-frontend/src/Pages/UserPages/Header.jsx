import { Bell, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./logo";

const Header = () => {
  const navigate = useNavigate();

  const navClass = ({ isActive }) =>
    `text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
      isActive ? "text-[#4f8cff]" : "text-white hover:text-[#4f8cff] hover:scale-105"
    }`;

  const authDetail = JSON.parse(localStorage.getItem("authDetail-tickethub") || "{}");
  const name = authDetail.name ? authDetail.name.split(" ")[0] : "User";

  const handleLogoutConfirm = () => {
    localStorage.removeItem("authDetail-tickethub");
    navigate("/login");
  };

  return (
<header className="w-full bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] border-b border-white/10 sticky top-0 z-50">
{/* Main Container: 
          - px-4 for mobile
          - md:px-10 for desktop 
          - max-w-full to ensure it hits the edges
      */}
      <div className="w-full px-4 md:px-10 h-20 flex items-center justify-between mx-auto">

        {/* LEFT: Logo */}
        <div className="flex-shrink-0">
          <div className="transform hover:scale-105 transition-transform cursor-pointer">
            <Logo />
          </div>
        </div>

        {/* RIGHT: Navigation + Actions */}
        <div className="flex items-center gap-6 lg:gap-10">
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-6 lg:gap-8">
              <li>
                <NavLink hide-on-mobile="true" to="/user/dashboard" className={navClass}>Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/user/my-bookings" className={navClass}>My Bookings</NavLink>
              </li>
              <li>
                <NavLink to="/user/events" className={navClass}>Events</NavLink>
              </li>
              <li>
                <NavLink to="/user/profile" className={navClass}>Profile</NavLink>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-3 md:gap-5 border-l pl-6 border-white/10">
            {/* Notification Bell */}
            <button className="relative p-2 rounded-full hover:bg-white/10 transition-all group">
              <Bell size={18} className="text-white group-hover:text-[#4f8cff]" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-[#0A183B] transition-transform group-hover:scale-125"></span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogoutConfirm}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4f8cff] to-indigo-500 text-white rounded-full shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all font-bold text-[11px] uppercase whitespace-nowrap"
            >
              <span>Logout</span>
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;