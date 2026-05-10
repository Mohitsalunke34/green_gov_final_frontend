import { Link, useLocation } from "react-router-dom";

/**
 * Sidebar Navigation
 * All authenticated users see ALL navigation items.
 * Permission checks happen inside each page component, not here.
 */
const NAV_ITEMS = [
    { path: "/dashboard",    label: "Dashboard" },
    { path: "/programs",     label: "Programs" },
    { path: "/projects",     label: "Projects" },
    { path: "/applications", label: "Applications" },
    { path: "/incentives",   label: "Incentives & Disbursements" },
    { path: "/compliance",   label: "Compliance" },
    { path: "/audit",        label: "Audit" },
    { path: "/reports",      label: "Reports & Analytics" },
    { path: "/resources",    label: "Resource & Infrastructure" },
    { path: "/officers",     label: "Officers Management" },
    { path: "/profile",      label: "My Profile" },
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <div className="bg-white border-end" style={{ width: 230, minHeight: "100%", flexShrink: 0 }}>
            <div className="p-3 border-bottom bg-success bg-opacity-10">
                <p className="mb-0 fw-semibold text-success small text-uppercase ls-wider">Navigation</p>
            </div>
            <nav className="py-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={
                                "d-block px-3 py-2 text-decoration-none small " +
                                (isActive
                                    ? "bg-success text-white fw-semibold border-start border-3 border-white"
                                    : "text-secondary border-start border-3 border-white")
                            }
                            style={{
                                borderLeftColor: isActive ? "#198754" : "transparent",
                                borderLeftStyle: "solid",
                                transition: "all 0.15s ease"
                            }}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
