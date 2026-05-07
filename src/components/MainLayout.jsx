import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import "../styles/MainLayout.css";

export default function MainLayout({ children }) {
    return (
        <div className="main-layout d-flex flex-column min-vh-100">
            {/* Navbar */}
            <Navbar />

            {/* Main Content Area */}
            <div className="layout-body flex-grow-1 d-flex">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="main-content flex-grow-1">
                    <div className="content-wrapper">
                        {children}
                    </div>
                </main>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
