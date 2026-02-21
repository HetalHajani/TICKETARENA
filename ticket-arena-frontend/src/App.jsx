import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

//Common pages
import Login from "./Pages/CommonPages/Login";
import Register from "./Pages/CommonPages/Register";
import Unauthorized from "./Pages/CommonPages/Unauthorized";
import NotFound from "./Pages/CommonPages/NotFound";

//User pages
import Dashboard from "./Pages/UserPages/Dashboard";
import MyBookings from "./Pages/UserPages/MyBookings";
import Profile from "./Pages/UserPages/Profile";
import Events from "./Pages/UserPages/Events";

//Admin pages
import AdminDashboard from "./Pages/AdminPages/Dashboard";
import AdminBookings from "./Pages/AdminPages/Bookings";
import AdminEvents from "./Pages/AdminPages/Events";

//Layout
import UserLayout from "./Layout/UserLayout";
import AdminLayout from "./Layout/AdminLayout";
import AuthGuard from "./Guards/AuthGuard";
import RoleIndex from "./Guards/RoleIndex";
// import ForgotPassword from "./Pages/CommonPages/ForgotPassword";


 
function App() {
  const router = createBrowserRouter([
    // ---------- PUBLIC ROUTES ----------
    {
      path: "/login",
      element: (
        <AuthGuard requireAuth={false}>
          <Login />
        </AuthGuard>
      ),
    },
    {
      path: "/register",
      element: (
        <AuthGuard requireAuth={false}>
          <Register />
        </AuthGuard>
      ),
    },
    // {
    //   path: "/forgot-password",
    //   element: (
    //     <AuthGuard requireAuth={false}>
    //       <ForgotPassword />
    //     </AuthGuard>
    //   ),
    // },
 
    // ---------- PROTECTED ROOT ----------
    {
      path: "/",
      element: (
        <AuthGuard requireAuth={true}>
          <RoleIndex />
        </AuthGuard>
      ),
    },
 
    // ---------- USER ROUTES ----------
    {
      path: "/user",
      element: (
        <AuthGuard requireAuth={true} allowedRoles={["user"]}>
          <UserLayout />
        </AuthGuard>
      ),
      children: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "profile", element: <Profile /> },
        { path: "my-bookings", element: <MyBookings /> },
        { path: "events", element: <Events /> },
      ],
    },
 
    // ---------- ADMIN ROUTES ----------
    {
      path: "/admin",
      element: (
        <AuthGuard requireAuth={true} allowedRoles={["admin"]}>
          <AdminLayout />
        </AuthGuard>
      ),
      children: [
        { path: "dashboard", element: <AdminDashboard /> },
        { path: "bookings", element: <AdminBookings /> },
        { path: "events", element: <AdminEvents /> },
      ],
    },
 
    // ---------- OTHER ----------
    { path: "/unauthorized", element: <Unauthorized /> },
    { path: "*", element: <NotFound /> },
  ]);
 
  return <RouterProvider router={router} />;
}
 
export default App;
 
// AuthGuard
// RoleIndex
// AdminLayout
// Sidebar
// Dashboard (admin)
// App