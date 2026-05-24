import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { FaBars, FaCog, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useRef } from "react";
 
export default function Navbar() {
  const navigate = useNavigate();
  const { logout, getUsername, isAuthenticated } = useAuth();
  const sidebarToggleRef = useRef(null);
 
  const handleLogout = () => {
    logout();
    navigate("/");
  };
 
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success border-bottom border-success-subtle sticky-top">
      <div className="container-fluid px-4">
        {/* Sidebar Toggle Button (Mobile only) */}
        {isAuthenticated && (
          <button
            ref={sidebarToggleRef}
            className="btn btn-link text-white border-0 d-md-none me-2"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebarOffcanvas"
            aria-controls="sidebarOffcanvas"
            style={{
              fontSize: "1.5rem",
              padding: "0",
              textDecoration: "none",
            }}>
            <FaBars />
          </button>
        )}
 
        <Link
          className="navbar-brand fw-bold fs-5 text-white"
          to={isAuthenticated ? "/dashboard" : "/"}>
          GreenGov
        </Link>
 
        <div className="d-flex align-items-center gap-2 ms-auto">
          {/* Desktop Navigation */}
          <div className="collapse navbar-collapse d-lg-flex" id="navbarNav">
            <ul className="navbar-nav align-items-center gap-2">
              {isAuthenticated ? (
                <>
                  <li className="nav-item d-none d-lg-block">
                    <span className="nav-link text-white-50 small">
                      Signed in as{" "}
                      <strong className="text-white">
                        {getUsername() || "User"}
                      </strong>
                    </span>
                  </li>
                  <li className="nav-item d-none d-lg-block">
                    <Link className="nav-link text-white" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li className="nav-item d-none d-lg-block">
                    <button
                      className="btn btn-outline-light btn-sm"
                      onClick={handleLogout}>
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/login">
                      Sign In
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="btn btn-outline-light btn-sm"
                      to="/register">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
 
          {/* Mobile Profile Dropdown */}
          {isAuthenticated && (
            <div className="dropdown d-md-none">
              <button
                className="btn btn-link text-white border-0 p-0"
                type="button"
                id="profileDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  fontSize: "1.25rem",
                  textDecoration: "none",
                  cursor: "pointer",
                }}>
                <FaCog />
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="profileDropdown">
                <li>
                  <span className="dropdown-item text-muted small">
                    Signed in as <strong>{getUsername() || "User"}</strong>
                  </span>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item" to="/profile">
                    <FaUser className="me-2" /> Profile
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "left",
                    }}>
                    <FaSignOutAlt className="me-2" /> Sign Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
 