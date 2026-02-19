import { Outlet } from "react-router-dom";
// import Navbar from "./Navbar.tsx";
import Sidebar from "./Sidebar.tsx";


const MainLayout = () => {
  return (
    <div className="min-h-screen flex bg-slate-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-6 bg-slate-900">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

