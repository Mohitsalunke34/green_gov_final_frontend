import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Alert from "../components/Alert";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { registerUser } from "../api/authApi";
import { registerParticipant } from "../api/participantApi";

export default function RegisterPage() {
    const [activeTab, setActiveTab] = useState("citizen");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const [citizenForm, setCitizenForm] = useState({
        username: "", email: "", password: "", confirmPassword: "",
        entityType: "CITIZEN", legalName: "", address: "", contactPhone: "",
    });

    const [officerForm, setOfficerForm] = useState({
        username: "", email: "", password: "", confirmPassword: "",
        officerType: "PROGRAM_MANAGER", department: "", designation: "", officeCode: "",
    });

    const handleCitizenChange = (e) => setCitizenForm({ ...citizenForm, [e.target.name]: e.target.value });
    const handleOfficerChange = (e) => setOfficerForm({ ...officerForm, [e.target.name]: e.target.value });

    const validate = (form) => {
        if (!form.username || !form.email || !form.password) return "All required fields must be filled.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Invalid email format.";
        if (form.password.length < 6) return "Password must be at least 6 characters.";
        if (form.password !== form.confirmPassword) return "Passwords do not match.";
        return null;
    };

    const handleCitizenRegister = async (e) => {
        e.preventDefault();
        setError(""); setSuccess("");
        const err = validate(citizenForm);
        if (err) { setError(err); return; }

        try {
            setLoading(true);
            const authResponse = await registerUser({
                username: citizenForm.username,
                email: citizenForm.email,
                password: citizenForm.password,
                primaryRole: citizenForm.entityType === "BUSINESS" ? "BUSINESS_OWNER" : "CITIZEN",
            });
            if (authResponse.id || authResponse.userId) {
                await registerParticipant({
                    userId: authResponse.id || authResponse.userId,
                    entityType: citizenForm.entityType,
                    legalName: citizenForm.legalName,
                    address: citizenForm.address,
                    contactInfo: JSON.stringify({ phone: citizenForm.contactPhone, email: citizenForm.email }),
                });
            }
            setSuccess("Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOfficerRegister = async (e) => {
        e.preventDefault();
        setError(""); setSuccess("");
        const err = validate(officerForm);
        if (err) { setError(err); return; }
        if (!officerForm.department || !officerForm.designation || !officerForm.officeCode) {
            setError("All officer fields are required."); return;
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
            setSuccess("Officer registration submitted. Awaiting administrator approval.");
            setTimeout(() => navigate("/login"), 2500);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "form-control";
    const labelClass = "form-label fw-semibold small";

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Navbar />

            <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
                <div className="w-100" style={{ maxWidth: 580 }}>
                    <div className="text-center mb-4">
                        <h4 className="fw-bold mb-1">Create an Account</h4>
                        <p className="text-muted small">Register to access the GreenGov platform</p>
                    </div>

                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            {error   && <Alert type="danger"  message={error}   onClose={() => setError("")} />}
                            {success && <Alert type="success" message={success} />}

                            {/* Tab selector */}
                            <ul className="nav nav-tabs mb-4">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "citizen" ? "active text-success border-bottom border-success border-2" : "text-muted"}`}
                                        onClick={() => { setActiveTab("citizen"); setError(""); setSuccess(""); }}
                                    >
                                        Citizen / Business
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "officer" ? "active text-success border-bottom border-success border-2" : "text-muted"}`}
                                        onClick={() => { setActiveTab("officer"); setError(""); setSuccess(""); }}
                                    >
                                        Government Officer
                                    </button>
                                </li>
                            </ul>

                            {/* Citizen Form */}
                            {activeTab === "citizen" && (
                                <form onSubmit={handleCitizenRegister}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label htmlFor="cUsername" className={labelClass}>Username</label>
                                            <input id="cUsername" type="text" className={inputClass} name="username"
                                                value={citizenForm.username} onChange={handleCitizenChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="cEntityType" className={labelClass}>Entity Type</label>
                                            <select id="cEntityType" className="form-select" name="entityType"
                                                value={citizenForm.entityType} onChange={handleCitizenChange}>
                                                <option value="CITIZEN">Citizen</option>
                                                <option value="BUSINESS">Business</option>
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="cEmail" className={labelClass}>Email Address</label>
                                            <input id="cEmail" type="email" className={inputClass} name="email"
                                                value={citizenForm.email} onChange={handleCitizenChange} required />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="cLegalName" className={labelClass}>Legal Name / Organisation</label>
                                            <input id="cLegalName" type="text" className={inputClass} name="legalName"
                                                value={citizenForm.legalName} onChange={handleCitizenChange} required />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="cAddress" className={labelClass}>Address</label>
                                            <textarea id="cAddress" className={inputClass} name="address"
                                                value={citizenForm.address} onChange={handleCitizenChange} rows="2" required />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="cPhone" className={labelClass}>Contact Phone</label>
                                            <input id="cPhone" type="tel" className={inputClass} name="contactPhone"
                                                value={citizenForm.contactPhone} onChange={handleCitizenChange}
                                                placeholder="+91-9876543210" />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="cPassword" className={labelClass}>Password</label>
                                            <input id="cPassword" type="password" className={inputClass} name="password"
                                                value={citizenForm.password} onChange={handleCitizenChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="cConfirmPassword" className={labelClass}>Confirm Password</label>
                                            <input id="cConfirmPassword" type="password" className={inputClass} name="confirmPassword"
                                                value={citizenForm.confirmPassword} onChange={handleCitizenChange} required />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-success w-100 mt-4" disabled={loading}>
                                        {loading ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Registering...</> : "Register"}
                                    </button>
                                </form>
                            )}

                            {/* Officer Form */}
                            {activeTab === "officer" && (
                                <form onSubmit={handleOfficerRegister}>
                                    <div className="alert alert-warning border-warning small py-2">
                                        Officer accounts require administrator approval before access is granted.
                                    </div>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label htmlFor="oUsername" className={labelClass}>Username</label>
                                            <input id="oUsername" type="text" className={inputClass} name="username"
                                                value={officerForm.username} onChange={handleOfficerChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="oOfficerType" className={labelClass}>Officer Type</label>
                                            <select id="oOfficerType" className="form-select" name="officerType"
                                                value={officerForm.officerType} onChange={handleOfficerChange}>
                                                <option value="PROGRAM_MANAGER">Program Manager</option>
                                                <option value="COMPLIANCE_OFFICER">Compliance Officer</option>
                                                <option value="ENVIRONMENT_OFFICER">Environment Officer</option>
                                                <option value="DISBURSEMENT_OFFICER">Disbursement Officer</option>
                                                <option value="AUDIT_MANAGER">Audit Manager</option>
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="oEmail" className={labelClass}>Official Email</label>
                                            <input id="oEmail" type="email" className={inputClass} name="email"
                                                value={officerForm.email} onChange={handleOfficerChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="oDepartment" className={labelClass}>Department</label>
                                            <input id="oDepartment" type="text" className={inputClass} name="department"
                                                value={officerForm.department} onChange={handleOfficerChange}
                                                placeholder="e.g. Green Programs Division" required />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="oDesignation" className={labelClass}>Designation</label>
                                            <input id="oDesignation" type="text" className={inputClass} name="designation"
                                                value={officerForm.designation} onChange={handleOfficerChange}
                                                placeholder="e.g. Program Manager" required />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="oOfficeCode" className={labelClass}>Office Code</label>
                                            <input id="oOfficeCode" type="text" className={inputClass} name="officeCode"
                                                value={officerForm.officeCode} onChange={handleOfficerChange}
                                                placeholder="e.g. PRG-MGR-015" required />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="oPassword" className={labelClass}>Password</label>
                                            <input id="oPassword" type="password" className={inputClass} name="password"
                                                value={officerForm.password} onChange={handleOfficerChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="oConfirmPassword" className={labelClass}>Confirm Password</label>
                                            <input id="oConfirmPassword" type="password" className={inputClass} name="confirmPassword"
                                                value={officerForm.confirmPassword} onChange={handleOfficerChange} required />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-success w-100 mt-4" disabled={loading}>
                                        {loading ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Submitting...</> : "Submit Registration"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    <p className="text-center text-muted small mt-3">
                        Already have an account?{" "}
                        <Link to="/login" className="text-success text-decoration-none fw-semibold">Sign in</Link>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
}
