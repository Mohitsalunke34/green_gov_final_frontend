import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Alert from "../components/Alert";

import { loginUser, loginAdmin } from "../api/authApi";
import { useAuth } from "../auth/AuthContext";


export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login, decodedToken, getRoles, getAuthorities, getUsername } = useAuth();
    const navigate = useNavigate();

    

const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
        const data = isAdmin
            ? await loginAdmin(username, password)
            : await loginUser(username, password);

        // ✅ Call login
        login(data.token);

        // ✅ TEMPORARY TEST LOGS
        console.log("JWT token:", data.token);
        console.log("Decoded token:", decodedToken);
        console.log("Roles:", getRoles());
        console.log("Authorities:", getAuthorities());
        console.log("Username:", getUsername());

        navigate("/dashboard");
    } catch (err) {
        setError(
            err.response?.data?.message ||
            "Authentication failed. Please try again."
        );
    } finally {
        setLoading(false);
    }
};

    return (
        
            <div className="container mt-4" style={{ maxWidth: "420px" }}>
                <h3 className="mb-3">Login</h3>

                {/* ✅ New Alert (same behavior as AlertMessage) */}
                <Alert
                    type="danger"
                    message={error}
                    onClose={() => setError("")}
                />

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            id="username"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            id="password"
                            className="form-control"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* ✅ ADMIN CHECKBOX — unchanged */}
                    <div className="form-check mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            id="adminCheck"
                        />
                        <label className="form-check-label" htmlFor="adminCheck">
                            Login as Admin
                        </label>
                    </div>

                    <button
                        className="btn btn-primary w-100"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="mt-3 text-center">
                    <p>
                        Don't have an account?{" "}
                        <Link to="/register" className="text-decoration-none">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
       
    );
}
