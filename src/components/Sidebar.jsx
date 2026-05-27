
import { Link, useLocation } from "react-router-dom";
import { usePermission } from "../hooks/usePermission";
import { useEffect } from "react";
 
export default function Sidebar() {
  const location = useLocation();
  const permission = usePermission();
 
  // Auto-close offcanvas when route changes
  useEffect(() => {
    // Find the close button in the offcanvas and click it to close
    const offcanvasCloseButton = document.querySelector(
      "#sidebarOffcanvas .btn-close",
    );
    if (offcanvasCloseButton) {
      offcanvasCloseButton.click();
    }
  }, [location.pathname]);
 
  const NAV_ITEMS = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/programs", label: "Programs" },
    { path: "/projects", label: "Projects" },
    { path: "/applications", label: "Applications" },
    {
      path: "/incentives",
      label: "Incentives & Disbursements",
    },
    {
      path: "/compliance",
      label: "Compliance",
      authority: "COMPLIANCE_OFFICER",
    },
    {
      path: "/audit",
      label: "Audit",
      authority: "AUDIT_MANAGER",
    },
    {
      path: "/reports",
      label: "Reports & Analytics",
      authorities: ["ADMIN", "PROGRAM_MANAGER", "DISBURSEMENT_OFFICER"],
    },
    {
      path: "/resources",
      label: "Resource & Infrastructure",
      authorities: ["ADMIN", "PROGRAM_MANAGER"],
    },
    {
      path: "/officers",
      label: "Officers Management",
      authority: "ADMIN",
    },
    {
      path: "/officer-dashboard",
      label: "Verification Desk",
      authority: "ENVIRONMENT_OFFICER",
    },
    { path: "/profile", label: "My Profile" },
  ];
 
  const canShowItem = (item) => {
    if (permission.hasAuthority("DISBURSEMENT_OFFICER")) {
      return (
        item.path === "/incentives" ||
        item.path === "/reports" ||
        item.path === "/profile"
      );
    }

    if (permission.hasAuthority("CITIZEN") || permission.hasAuthority("BUSINESS_OWNER")) {
      return item.path === "/incentives" || item.path === "/profile" || item.path === "/dashboard" || item.path === "/applications" || item.path === "/projects" || item.path === "/programs";
    }
 
    if (!item.authority && !item.authorities) return true;
    if (item.authority) return permission.hasAuthority(item.authority);
    if (item.authorities) return permission.hasAnyAuthority(item.authorities);
 
    return true;
  };
 
  const filteredItems = NAV_ITEMS.filter(canShowItem);
 
  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className="d-none d-md-flex flex-column bg-white border-end"
        style={{ width: 230, minHeight: "100vh" }}>
        <div className="p-3 border-bottom bg-success bg-opacity-10">
          <p className="mb-0 fw-semibold text-success small text-uppercase">
            Navigation
          </p>
        </div>
 
        <nav className="py-2 flex-grow-1 overflow-y-auto">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path;
 
            return (
              <Link
                key={item.path}
                to={item.path}
                className={
                  "d-block px-3 py-2 text-decoration-none small " +
                  (isActive
                    ? "bg-success text-white fw-semibold border-start border-3"
                    : "text-secondary border-start border-3 text-decoration-none")
                }
                style={{
                  borderLeftColor: isActive ? "#198754" : "transparent",
                  color: isActive ? "white" : "#6c757d",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = "#f8f9fa";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = "transparent";
                  }
                }}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
 
      {/* Mobile Offcanvas Sidebar */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="sidebarOffcanvas"
        aria-labelledby="sidebarOffcanvasLabel">
        <div className="offcanvas-header bg-success bg-opacity-10 border-bottom">
          <h5
            className="offcanvas-title fw-semibold text-success"
            id="sidebarOffcanvasLabel">
            Navigation
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"></button>
        </div>
 
        <div className="offcanvas-body p-0">
          <nav className="w-100">
            {filteredItems.map((item) => {
              const isActive = location.pathname === item.path;
 
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={
                    "d-block px-3 py-3 text-decoration-none small border-start border-3 " +
                    (isActive
                      ? "bg-success text-white fw-semibold"
                      : "text-secondary")
                  }
                  style={{
                    borderLeftColor: isActive ? "#198754" : "transparent",
                  }}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
