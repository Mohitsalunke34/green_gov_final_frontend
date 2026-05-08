import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";
import { useAuth } from "../auth/AuthContext";

export default function Sidebar() {
    const location = useLocation();
    const { getRoles, getAuthorities } = useAuth();

    // Get user roles and authorities from context
    const userRoles = getRoles();
    const userAuthorities = getAuthorities();

    // Determine which menu to show based on user's authorities/roles
    const getMenuItems = () => {
        // PROGRAM_MANAGER - Full admin access to all features
        if (userAuthorities.includes("PROGRAM_MANAGER")) {
            return [
                { path: "/dashboard", label: "📊 Dashboard" },
                { path: "/programs", label: "🌍 Programs" },
                { path: "/projects", label: "🏗️ Projects" },
                { path: "/applications", label: "📝 Applications" },
                { path: "/incentives", label: "💰 Incentives" },
                { path: "/compliance", label: "✓ Compliance" },
                { path: "/audit", label: "🔍 Audit" },
                { path: "/profile", label: "👤 Profile" },
            ];
        }

        // COMPLIANCE_OFFICER - Compliance management
        if (userAuthorities.includes("COMPLIANCE_OFFICER")) {
            return [
                { path: "/dashboard", label: "📊 Dashboard" },
                { path: "/compliance", label: "✓ Compliance" },
                { path: "/profile", label: "👤 Profile" },
            ];
        }

        // AUDIT_MANAGER - Audit management
        if (userAuthorities.includes("AUDIT_MANAGER")) {
            return [
                { path: "/dashboard", label: "📊 Dashboard" },
                { path: "/audit", label: "🔍 Audit" },
                { path: "/compliance", label: "✓ Compliance" },
                { path: "/profile", label: "👤 Profile" },
            ];
        }

        // DISBURSEMENT_OFFICER - Incentive management
        if (userAuthorities.includes("DISBURSEMENT_OFFICER")) {
            return [
                { path: "/dashboard", label: "📊 Dashboard" },
                { path: "/incentives", label: "💰 Incentives" },
                { path: "/applications", label: "📝 Applications" },
                { path: "/profile", label: "👤 Profile" },
            ];
        }

        // CITIZEN / BUSINESS_OWNER - User dashboard
        if (userRoles.includes("CITIZEN") || userRoles.includes("BUSINESS_OWNER")) {
            return [
                { path: "/dashboard", label: "📊 Dashboard" },
                { path: "/programs", label: "🌍 Programs" },
                { path: "/applications", label: "📝 Applications" },
                { path: "/projects", label: "🏗️ Projects" },
                { path: "/profile", label: "👤 Profile" },
            ];
        }

        // Default fallback (should not reach here if user is authenticated)
        return [
            { path: "/dashboard", label: "📊 Dashboard" },
            { path: "/profile", label: "👤 Profile" },
        ];
    };

    const menuItems = getMenuItems();

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
