import { useState, useEffect, useCallback } from "react";
import { getParticipantById, updateParticipant, getParticipantDocuments } from "../api/participantApi";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import { useAuth } from "../auth/AuthContext";

export default function ProfilePage() {
    const { getUserId, getUsername } = useAuth();
    const userId = getUserId();
    const username = getUsername();
    
    const [profile, setProfile] = useState({});
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});

    const loadProfile = useCallback(async () => {
        try {
            setLoading(true);
            if (!userId) {
                setError("User ID not available");
                setLoading(false);
                return;
            }
            
            const profileData = await getParticipantById(userId);
            setProfile(profileData);
            setFormData(profileData);
            
            const docsData = await getParticipantDocuments(userId);
            setDocuments(docsData || []);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load profile");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            loadProfile();
        }
    }, [userId, loadProfile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveProfile = async () => {
        try {
            await updateParticipant(userId, formData);
            setProfile(formData);
            setEditMode(false);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        }
    };

    if (loading) return <Loading />;

    return (
        <div>
            <h2 className="mb-4">User Profile</h2>

            {error && <Alert message={error} type="danger" />}

            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Profile Information</h5>
                        </div>
                        <div className="card-body">
                            {!editMode && (
                                <div className="mb-3">
                                    <label className="form-label">Username</label>
                                    <p className="form-control-plaintext fw-bold">{username}</p>
                                </div>
                            )}
                            {editMode ? (
                                <>
                                    <div className="mb-3">
                                        <label htmlFor="legalName" className="form-label">Name</label>
                                        <input
                                            id="legalName"
                                            type="text"
                                            className="form-control"
                                            name="legalName"
                                            value={formData.legalName || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="address" className="form-label">Address</label>
                                        <input
                                            id="address"
                                            type="text"
                                            className="form-control"
                                            name="address"
                                            value={formData.address || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <button 
                                            className="btn btn-success me-2"
                                            onClick={handleSaveProfile}
                                        >
                                            Save
                                        </button>
                                        <button 
                                            className="btn btn-secondary"
                                            onClick={() => setEditMode(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label fw-bold">Username</label>
                                        <p id="username" className="form-control-plaintext">{username || "N/A"}</p>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="profileName" className="form-label fw-bold">Name</label>
                                        <p id="profileName" className="form-control-plaintext">{profile.legalName || "N/A"}</p>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="profileAddress" className="form-label fw-bold">Address</label>
                                        <p id="profileAddress" className="form-control-plaintext">{profile.address || "N/A"}</p>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="entityType" className="form-label fw-bold">Entity Type</label>
                                        <p id="entityType" className="form-control-plaintext">{profile.entityType || "N/A"}</p>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="verifyStatus" className="form-label fw-bold">Verification Status</label>
                                        <p id="verifyStatus" className="form-control-plaintext">
                                            <span className={`badge bg-${profile.status === "VERIFIED" ? "success" : "warning"}`}>
                                                {profile.status || "PENDING"}
                                            </span>
                                        </p>
                                    </div>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => setEditMode(true)}
                                    >
                                        Edit Profile
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0">Documents</h5>
                        </div>
                        <div className="card-body">
                            {documents.length === 0 ? (
                                <p className="text-muted">No documents uploaded</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Type</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {documents.map((doc) => {
                                                let badgeColor = "warning";
                                                if (doc.status === "VERIFIED") badgeColor = "success";
                                                if (doc.status === "REJECTED") badgeColor = "danger";
                                                return (
                                                    <tr key={doc.id}>
                                                        <td>{doc.documentType}</td>
                                                        <td>
                                                            <span className={`badge bg-${badgeColor}`}>
                                                                {doc.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <button className="btn btn-info mt-3 w-100">Upload Document</button>
                        </div>
                    </div>

                    <div className="card mt-3">
                        <div className="card-header bg-warning text-dark">
                            <h5 className="mb-0">Account Settings</h5>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <button className="btn btn-warning w-100 mb-2">Change Password</button>
                                <button className="btn btn-info w-100 mb-2">Two-Factor Authentication</button>
                                <button className="btn btn-danger w-100">Delete Account</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
