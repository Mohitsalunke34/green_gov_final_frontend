import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HomePage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // If already logged in, redirect to dashboard
    if (isAuthenticated) {
        navigate("/dashboard");
        return null;
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Navbar */}
            <Navbar />

            {/* Main Hero Section */}
            <main className="flex-grow-1">
                <div className="container mt-5">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-lg-8 text-center">
                            <h1 className="display-4 fw-bold mb-4">
                                Welcome to <span className="text-success">GreenGov</span>
                            </h1>
                            <p className="lead text-muted mb-5">
                                A comprehensive platform for green initiative management, compliance tracking, and environmental program oversight.
                            </p>

                            <div className="d-flex gap-3 justify-content-center mb-5">
                                <button
                                    className="btn btn-success btn-lg"
                                    onClick={() => navigate("/login")}
                                >
                                    Login
                                </button>
                                <button
                                    className="btn btn-outline-success btn-lg"
                                    onClick={() => navigate("/register")}
                                >
                                    Register
                                </button>
                            </div>

                            {/* Features Section */}
                            <div className="row mt-5 pt-5">
                                <div className="col-md-4 mb-4">
                                    <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-body">
                                            <div className="display-6 text-success mb-3">📋</div>
                                            <h5 className="card-title">Program Management</h5>
                                            <p className="card-text text-muted">
                                                Create, manage, and track green initiatives with detailed program information and compliance metrics.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4 mb-4">
                                    <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-body">
                                            <div className="display-6 text-success mb-3">✓</div>
                                            <h5 className="card-title">Compliance Tracking</h5>
                                            <p className="card-text text-muted">
                                                Monitor compliance status, audit results, and ensure adherence to environmental regulations.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4 mb-4">
                                    <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-body">
                                            <div className="display-6 text-success mb-3">💰</div>
                                            <h5 className="card-title">Incentive Management</h5>
                                            <p className="card-text text-muted">
                                                Manage disbursements and incentive programs for environmental participation and compliance.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="row mt-5 pt-5">
                                <div className="col-lg-10 mx-auto">
                                    <div className="bg-light p-4 rounded">
                                        <h5 className="mb-3">Role-Based Access</h5>
                                        <p className="text-muted mb-3">
                                            Different user roles have access to different features:
                                        </p>
                                        <div className="row text-start">
                                            <div className="col-md-6">
                                                <ul className="list-unstyled">
                                                    <li className="mb-2">
                                                        <strong>Citizens & Business Owners:</strong> Apply for programs and manage projects
                                                    </li>
                                                    <li className="mb-2">
                                                        <strong>Program Managers:</strong> Create and manage programs
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="col-md-6">
                                                <ul className="list-unstyled">
                                                    <li className="mb-2">
                                                        <strong>Compliance Officers:</strong> Track compliance records and audits
                                                    </li>
                                                    <li className="mb-2">
                                                        <strong>Audit Managers:</strong> Manage audit processes
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
