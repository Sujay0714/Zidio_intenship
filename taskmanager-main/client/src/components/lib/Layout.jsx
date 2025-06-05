import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "../ui/Navbar";
import Sidebar from "../ui/SideBar";
import { MobileSidebar } from "./MobileSideBar";
import Footer from "../ui/Footer";
import FloatingChat from "../FloatingChat";
import { useSelector } from "react-redux";

const Layout = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  return user ? (
    <div className="w-full h-screen flex flex-col md:flex-row bg-blue-50">
      {/* Sidebar */}
      <div className="w-[20%] h-screen bg-white sticky top-0 hidden md:block shadow-lg border-r border-blue-200">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Main content */}
      <div className="w-full overflow-y-auto flex flex-col">
        <Navbar />
        <main className="p-2 2xl:px-10 flex-grow">
          <Outlet />
        </main>
        <footer className="border-t border-blue-200">
          <Footer />
        </footer>
      </div>

      {/* Floating chat */}
      <FloatingChat />
    </div>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default Layout;
