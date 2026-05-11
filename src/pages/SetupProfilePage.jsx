import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerParticipant } from "../api/participantApi";
import Alert from "../components/Alert";

export default function SetupProfilePage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("userData") || "{}");
    const currentUserId = user.id || user.userId;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        entityType: "CITIZEN",
        legalName: "",
        address: "",
        contactPhone: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await registerParticipant({
                userId: currentUserId,
                entityType: formData.entityType,
                legalName: formData.legalName,
                address: formData.address,
                contactInfo: JSON.stringify({ phone: formData.contactPhone })
            });

            navigate("/profile");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light align-items-center justify-content-center p-3">
            <div className="w-100" style={{ maxWidth: "500px" }}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-success mb-1">Welcome, {user.username}!</h2>
                    <p className="text-muted">Let's complete your GreenGov profile</p>
                </div>

                {error && <Alert type="danger" message={error} />}

                <div className="card shadow-sm border-0 rounded-3 p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Entity Type</label>
                            <select
                                className="form-select bg-light"
                                name="entityType"
                                value={formData.entityType}
                                onChange={handleChange}
                                required
                            >
                                <option value="CITIZEN">Citizen</option>
                                <option value="BUSINESS_OWNER">Business Owner</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Legal Name</label>
                            <input
                                type="text"
                                className="form-control bg-light"
                                name="legalName"
                                value={formData.legalName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Address</label>
                            <textarea
                                className="form-control bg-light"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold small">Contact Phone</label>
                            <input
                                type="tel"
                                className="form-control bg-light"
                                name="contactPhone"
                                value={formData.contactPhone}
                                onChange={handleChange}
                                placeholder="+91-9876543210"
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-success w-100" 
                            disabled={loading}
                        >
                            {loading ? (
                                <span><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</span>
                            ) : "Complete Profile"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}