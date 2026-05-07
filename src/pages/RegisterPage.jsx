import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Alert from "../components/Alert";
import MainLayout from "../components/MainLayout";
import { registerUser } from "../api/authApi";
import { registerParticipant } from "../api/participantApi";

export default function RegisterPage() {
    const [activeTab, setActiveTab] = useState("citizen");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    // Citizen/Business Registration Form
    const [citizenForm, setCitizenForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        entityType: "CITIZEN",
        legalName: "",
        address: "",
        contactPhone: "",
    });

    // Officer Registration Form
    const [officerForm, setOfficerForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        officerType: "PROGRAM_MANAGER",
        department: "",
        designation: "",
        officeCode: "",
    });

    const handleCitizenChange = (e) => {
        const { name, value } = e.target;
        setCitizenForm({ ...citizenForm, [name]: value });
    };

    const handleOfficerChange = (e) => {
        const { name, value } = e.target;
        setOfficerForm({ ...officerForm, [name]: value });
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const handleCitizenRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validation
        if (!citizenForm.username || !citizenForm.email || !citizenForm.password) {
            setError("All fields are required");
            return;
        }

        if (!validateEmail(citizenForm.email)) {
            setError("Invalid email format");
            return;
        }

        if (!validatePassword(citizenForm.password)) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (citizenForm.password !== citizenForm.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            // Register user account
            const authResponse = await registerUser({
                username: citizenForm.username,
                email: citizenForm.email,
                password: citizenForm.password,
                primaryRole: "CITIZEN",
            });

            // Register participant profile
            if (authResponse.id || authResponse.userId) {
                const userId = authResponse.id || authResponse.userId;
                await registerParticipant({
                    userId,
                    entityType: citizenForm.entityType,
                    legalName: citizenForm.legalName,
                    address: citizenForm.address,
                    contactInfo: JSON.stringify({
                        phone: citizenForm.contactPhone,
                        email: citizenForm.email,
                    }),
                });
            }

            setSuccess("Registration successful! Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleOfficerRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validation
        if (
            !officerForm.username ||
            !officerForm.email ||
            !officerForm.password ||
            !officerForm.department ||
            !officerForm.designation ||
            !officerForm.officeCode
        ) {
            setError("All fields are required");
            return;
        }

        if (!validateEmail(officerForm.email)) {
            setError("Invalid email format");
            return;
        }

        if (!validatePassword(officerForm.password)) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (officerForm.password !== officerForm.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            await registerUser({
                username: officerForm.username,
                email: officerForm.email,
                password: officerForm.password,
                primaryRole: "OFFICER",
                officerType: officerForm.officerType,
                department: officerForm.department,
                designation: officerForm.designation,
                officeCode: officerForm.officeCode,
            });

            setSuccess("Officer registration successful! Awaiting admin approval...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="container mt-4" style={{ maxWidth: "600px" }}>
                <h3 className="mb-4">Register</h3>

                {error && <Alert type="danger" message={error} />}
                {success && <Alert type="success" message={success} />}

                {/* Tabs */}
                <ul className="nav nav-tabs mb-4" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "citizen" ? "active" : ""}`}
                            onClick={() => setActiveTab("citizen")}
                            type="button"
                        >
                            Citizen/Business
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "officer" ? "active" : ""}`}
                            onClick={() => setActiveTab("officer")}
                            type="button"
                        >
                            Officer
                        </button>
                    </li>
                </ul>

                {/* Citizen/Business Registration */}
                {activeTab === "citizen" && (
                    <form onSubmit={handleCitizenRegister}>
                        <div className="mb-3">
                            <label htmlFor="cUsername" className="form-label">
                                Username
                            </label>
                            <input
                                id="cUsername"
                                type="text"
                                className="form-control"
                                name="username"
                                value={citizenForm.username}
                                onChange={handleCitizenChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="cEmail" className="form-label">
                                Email
                            </label>
                            <input
                                id="cEmail"
                                type="email"
                                className="form-control"
                                name="email"
                                value={citizenForm.email}
                                onChange={handleCitizenChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="cEntityType" className="form-label">
                                Entity Type
                            </label>
                            <select
                                id="cEntityType"
                                className="form-control"
                                name="entityType"
                                value={citizenForm.entityType}
                                onChange={handleCitizenChange}
                            >
                                <option value="CITIZEN">Citizen</option>
                                <option value="BUSINESS">Business</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="cLegalName" className="form-label">
                                Legal Name / Organization Name
                            </label>
                            <input
                                id="cLegalName"
                                type="text"
                                className="form-control"
                                name="legalName"
                                value={citizenForm.legalName}
                                onChange={handleCitizenChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="cAddress" className="form-label">
                                Address
                            </label>
                            <textarea
                                id="cAddress"
                                className="form-control"
                                name="address"
                                value={citizenForm.address}
                                onChange={handleCitizenChange}
                                rows="3"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="cPhone" className="form-label">
                                Contact Phone
                            </label>
                            <input
                                id="cPhone"
                                type="tel"
                                className="form-control"
                                name="contactPhone"
                                value={citizenForm.contactPhone}
                                onChange={handleCitizenChange}
                                placeholder="+91-9876543210"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="cPassword" className="form-label">
                                Password
                            </label>
                            <input
                                id="cPassword"
                                type="password"
                                className="form-control"
                                name="password"
                                value={citizenForm.password}
                                onChange={handleCitizenChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="cConfirmPassword" className="form-label">
                                Confirm Password
                            </label>
                            <input
                                id="cConfirmPassword"
                                type="password"
                                className="form-control"
                                name="confirmPassword"
                                value={citizenForm.confirmPassword}
                                onChange={handleCitizenChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? "Registering..." : "Register as Citizen/Business"}
                        </button>
                    </form>
                )}

                {/* Officer Registration */}
                {activeTab === "officer" && (
                    <form onSubmit={handleOfficerRegister}>
                        <div className="mb-3">
                            <label htmlFor="oUsername" className="form-label">
                                Username
                            </label>
                            <input
                                id="oUsername"
                                type="text"
                                className="form-control"
                                name="username"
                                value={officerForm.username}
                                onChange={handleOfficerChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="oEmail" className="form-label">
                                Email
                            </label>
                            <input
                                id="oEmail"
                                type="email"
                                className="form-control"
                                name="email"
                                value={officerForm.email}
                                onChange={handleOfficerChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="oOfficerType" className="form-label">
                                Officer Type
                            </label>
                            <select
                                id="oOfficerType"
                                className="form-control"
                                name="officerType"
                                value={officerForm.officerType}
                                onChange={handleOfficerChange}
                            >
                                <option value="PROGRAM_MANAGER">Program Manager</option>
                                <option value="COMPLIANCE_OFFICER">Compliance Officer</option>
                                <option value="ENVIRONMENT_OFFICER">Environment Officer</option>
                                <option value="DISBURSEMENT_OFFICER">Disbursement Officer</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="oDepartment" className="form-label">
                                Department
                            </label>
                            <input
                                id="oDepartment"
                                type="text"
                                className="form-control"
                                name="department"
                                value={officerForm.department}
                                onChange={handleOfficerChange}
                                placeholder="e.g., Green Programs Division"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="oDesignation" className="form-label">
                                Designation
                            </label>
                            <input
                                id="oDesignation"
                                type="text"
                                className="form-control"
                                name="designation"
                                value={officerForm.designation}
                                onChange={handleOfficerChange}
                                placeholder="e.g., Program Manager"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="oOfficeCode" className="form-label">
                                Office Code
                            </label>
                            <input
                                id="oOfficeCode"
                                type="text"
                                className="form-control"
                                name="officeCode"
                                value={officerForm.officeCode}
                                onChange={handleOfficerChange}
                                placeholder="e.g., PRG-MGR-015"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="oPassword" className="form-label">
                                Password
                            </label>
                            <input
                                id="oPassword"
                                type="password"
                                className="form-control"
                                name="password"
                                value={officerForm.password}
                                onChange={handleOfficerChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="oConfirmPassword" className="form-label">
                                Confirm Password
                            </label>
                            <input
                                id="oConfirmPassword"
                                type="password"
                                className="form-control"
                                name="confirmPassword"
                                value={officerForm.confirmPassword}
                                onChange={handleOfficerChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? "Registering..." : "Register as Officer"}
                        </button>
                    </form>
                )}

                <div className="mt-3 text-center">
                    <p>
                        Already have an account?{" "}
                        <Link to="/login" className="text-decoration-none">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
