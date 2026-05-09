import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const NAV_ITEMS = {
    PROGRAM_MANAGER: [
        { path: "/dashboard",   label: "Dashboard" },
        { path: "/programs",    label: "Programs" },
        { path: "/projects",    label: "Projects" },
        { path: "/applications",label: "Applications" },
        { path: "/incentives",  label: "Incentives" },
        { path: "/compliance",  label: "Compliance" },
        { path: "/audit",       label: "Audit" },
        { path: "/reports",     label: "Reports & Analytics" },
        { path: "/resources",   label: "Resource & Infrastructure" },
        { path: "/profile",     label: "My Profile" },
    ],
    COMPLIANCE_OFFICER: [
        { path: "/dashboard",   label: "Dashboard" },
        { path: "/compliance",  label: "Compliance" },
        { path: "/reports",     label: "Reports & Analytics" },
        { path: "/profile",     label: "My Profile" },
    ],
    AUDIT_MANAGER: [
        { path: "/dashboard",   label: "Dashboard" },
        { path: "/audit",       label: "Audit" },
        { path: "/compliance",  label: "Compliance" },
        { path: "/reports",     label: "Reports & Analytics" },
        { path: "/profile",     label: "My Profile" },
    ],
    DISBURSEMENT_OFFICER: [
        { path: "/dashboard",   label: "Dashboard" },
        { path: "/incentives",  label: "Incentives & Disbursements" },
        { path: "/applications",label: "Applications" },
        { path: "/profile",     label: "My Profile" },
    ],
    CITIZEN: [
        { path: "/dashboard",   label: "Dashboard" },
        { path: "/programs",    label: "Programs" },
        { path: "/applications",label: "Applications" },
        { path: "/projects",    label: "Projects" },
        { path: "/reports",     label: "Reports & Analytics" },
        { path: "/profile",     label: "My Profile" },
    ],
};

export default function Sidebar() {
    const location = useLocation();
    const { getRoles, getAuthorities } = useAuth();

    const userRoles = getRoles();
    const userAuthorities = getAuthorities();

    const getMenuItems = () => {
        if (userAuthorities.includes("PROGRAM_MANAGER"))    return NAV_ITEMS.PROGRAM_MANAGER;
        if (userAuthorities.includes("COMPLIANCE_OFFICER")) return NAV_ITEMS.COMPLIANCE_OFFICER;
        if (userAuthorities.includes("AUDIT_MANAGER"))      return NAV_ITEMS.AUDIT_MANAGER;
        if (userAuthorities.includes("DISBURSEMENT_OFFICER")) return NAV_ITEMS.DISBURSEMENT_OFFICER;
        if (userRoles.includes("CITIZEN") || userRoles.includes("BUSINESS_OWNER")) return NAV_ITEMS.CITIZEN;
        return [
            { path: "/dashboard", label: "Dashboard" },
            { path: "/profile",   label: "My Profile" },
        ];
    };

    const menuItems = getMenuItems();

    return (
        <div className="bg-white border-end" style={{ width: 230, minHeight: "100%", flexShrink: 0 }}>
            <div className="p-3 border-bottom bg-success bg-opacity-10">
                <p className="mb-0 fw-semibold text-success small text-uppercase ls-wider">Navigation</p>
            </div>
            <nav className="py-2">
                {menuItems.map((item) => {
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
