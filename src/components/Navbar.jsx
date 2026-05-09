import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
    const navigate = useNavigate();
    const { logout, getUsername, isAuthenticated } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success border-bottom border-success-subtle sticky-top">
            <div className="container-fluid px-4">
                <Link className="navbar-brand fw-bold fs-5 text-white" to={isAuthenticated ? "/dashboard" : "/"}>
                    GreenGov
                </Link>

                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center gap-2">
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link text-white-50 small">
                                        Signed in as <strong className="text-white">{getUsername() || "User"}</strong>
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/profile">Profile</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                                        Sign Out
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/login">Sign In</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-outline-light btn-sm" to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
