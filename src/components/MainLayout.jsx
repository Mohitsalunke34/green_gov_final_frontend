import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useAuth } from "../auth/AuthContext";
 
export default function MainLayout({ children }) {
  const { isAuthenticated } = useAuth();
 
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      <div className="d-flex flex-grow-1" style={{ minHeight: 0 }}>
        {isAuthenticated && <Sidebar />}
        <main
          className="flex-grow-1 p-3 p-md-4 w-100"
          style={{ minWidth: 0, overflowX: "hidden" }}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
 