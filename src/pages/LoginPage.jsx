import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Alert from "../components/Alert";
import { loginUser, loginAdmin } from "../api/authApi";
import { useAuth } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const data = isAdmin
                ? await loginAdmin(username, password)
                : await loginUser(username, password);
            login(data.token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Navbar />

            <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
                <div className="w-100" style={{ maxWidth: 420 }}>
                    {/* Header */}
                    <div className="text-center mb-4">
                        <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                            style={{ width: 56, height: 56 }}>
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                            </svg>
                        </div>
                        <h4 className="fw-bold mb-1">Sign In to GreenGov</h4>
                        <p className="text-muted small">Enter your credentials to continue</p>
                    </div>

                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            {error && <Alert type="danger" message={error} onClose={() => setError("")} />}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="login-username" className="form-label fw-semibold small">Username</label>
                                    <input
                                        id="login-username"
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        autoComplete="username"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="login-password" className="form-label fw-semibold small">Password</label>
                                    <input
                                        id="login-password"
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoComplete="current-password"
                                    />
                                </div>

                                <div className="form-check mb-4">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="adminCheck"
                                        checked={isAdmin}
                                        onChange={(e) => setIsAdmin(e.target.checked)}
                                    />
                                    <label className="form-check-label small text-muted" htmlFor="adminCheck">
                                        Sign in as Administrator
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-success w-100"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Signing in...</span>
                                    ) : "Sign In"}
                                </button>
                            </form>
                        </div>
                    </div>

                    <p className="text-center text-muted small mt-3">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-success text-decoration-none fw-semibold">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
}
