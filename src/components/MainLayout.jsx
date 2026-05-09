import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function MainLayout({ children }) {
    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Navbar />
            <div className="d-flex flex-grow-1">
                <Sidebar />
                <main className="flex-grow-1 p-4" style={{ minWidth: 0 }}>
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}
