import { Outlet } from "react-router-dom";
import SideBar from "../Pages/AdminPages/SideBar";

const AdminLayout = () => {
  return (
    <>
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
        }
      `}</style>

      <div className="flex min-h-screen bg-gradient-to-br from-slate-800 via-indigo-900/60 to-blue-900/50">
        {/* Sidebar */}
        <div className="w-72 flex-shrink-0">
          <SideBar />
        </div>

        {/* Dashboard content */}
        <main className="flex-1 min-w-0 overflow-auto">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminLayout;