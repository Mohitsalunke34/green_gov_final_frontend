import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar() {
    const location = useLocation();

    const menuItems = [
        { path: "/dashboard", label: "📊 Dashboard", icon: "" },
        { path: "/programs", label: "🌍 Programs", icon: "" },
        { path: "/applications", label: "📝 Applications", icon: "" },
        { path: "/projects", label: "🏗️ Projects", icon: "" },
        { path: "/incentives", label: "💰 Incentives", icon: "" },
        { path: "/compliance", label: "✓ Compliance", icon: "" },
        { path: "/audit", label: "🔍 Audit", icon: "" },
        { path: "/profile", label: "👤 Profile", icon: "" },
    ];

    return (
        <div className="sidebar bg-light">
            <div className="sidebar-header p-3 border-bottom">
                <h5 className="mb-0 fw-bold">Menu</h5>
            </div>
            <nav className="sidebar-menu">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
