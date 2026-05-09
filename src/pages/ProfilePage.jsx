import { useState, useEffect, useCallback } from "react";
import { getParticipantById, updateParticipant, getParticipantDocuments } from "../api/participantApi";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import { useAuth } from "../auth/AuthContext";

export default function ProfilePage() {
    const { getUserId, getUsername, getRoles, getAuthorities } = useAuth();
    const userId   = getUserId();
    const username = getUsername();
    const roles    = getRoles();
    const authorities = getAuthorities();

    const [profile, setProfile]   = useState({});
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState("");
    const [success, setSuccess]   = useState("");
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});

    const loadProfile = useCallback(async () => {
        try {
            setLoading(true);
            if (!userId) { setError("User ID not available"); setLoading(false); return; }
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

    useEffect(() => { if (userId) loadProfile(); }, [userId, loadProfile]);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSave = async () => {
        try {
            setLoading(true);
            await updateParticipant(userId, formData);
            setProfile(formData);
            setEditMode(false);
            setSuccess("Profile updated successfully.");
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const docBadge = (status) =>
        status === "VERIFIED" ? "bg-success" : status === "REJECTED" ? "bg-danger" : "bg-warning text-dark";

    if (loading) return <Loading />;

    return (
        <div>
            {/* Page header */}
            <div className="mb-4 pb-3 border-bottom">
                <h4 className="fw-bold text-success mb-0">My Profile</h4>
                <p className="text-muted small mb-0">View and update your account information</p>
            </div>

            {error   && <Alert message={error}   type="danger" />}
            {success && <Alert message={success} type="success" />}

            <div className="row g-4">
                {/* Profile card */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-success text-white border-0 d-flex align-items-center justify-content-between">
                            <h6 className="mb-0">Profile Information</h6>
                            {!editMode && (
                                <button className="btn btn-sm btn-outline-light" onClick={() => setEditMode(true)}>
                                    Edit
                                </button>
                            )}
                        </div>
                        <div className="card-body p-4">
                            {editMode ? (
                                <>
                                    <div className="mb-3">
                                        <label htmlFor="pf-legalName" className="form-label small fw-semibold">Legal Name</label>
                                        <input id="pf-legalName" type="text" className="form-control" name="legalName"
                                            value={formData.legalName || ""} onChange={handleInputChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="pf-address" className="form-label small fw-semibold">Address</label>
                                        <textarea id="pf-address" className="form-control" name="address" rows="2"
                                            value={formData.address || ""} onChange={handleInputChange} />
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-success btn-sm" onClick={handleSave}>Save</button>
                                        <button className="btn btn-outline-secondary btn-sm" onClick={() => { setEditMode(false); setFormData(profile); }}>Cancel</button>
                                    </div>
                                </>
                            ) : (
                                <table className="table table-sm mb-0">
                                    <tbody>
                                        {[
                                            ["Username", username],
                                            ["Legal Name", profile.legalName],
                                            ["Address", profile.address],
                                            ["Entity Type", profile.entityType],
                                            ["User ID", userId],
                                        ].map(([label, value]) => (
                                            <tr key={label}>
                                                <td className="text-muted small fw-semibold" style={{ width: 130 }}>{label}</td>
                                                <td className="small">{value || "—"}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td className="text-muted small fw-semibold">Verification</td>
                                            <td>
                                                <span className={`badge ${profile.status === "VERIFIED" ? "bg-success" : "bg-warning text-dark"}`}>
                                                    {profile.status || "PENDING"}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                {/* Roles card */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-success text-white border-0">
                            <h6 className="mb-0">Roles & Permissions</h6>
                        </div>
                        <div className="card-body p-4">
                            <p className="small text-muted mb-2">Assigned Roles</p>
                            <div className="mb-3">
                                {roles.length > 0 ? roles.map((r) => (
                                    <span key={r} className="badge bg-success me-1 mb-1">{r}</span>
                                )) : <span className="text-muted small">None assigned</span>}
                            </div>
                            <p className="small text-muted mb-2">Authorities</p>
                            <div>
                                {authorities.length > 0 ? authorities.map((a) => (
                                    <span key={a} className="badge bg-success bg-opacity-75 me-1 mb-1">{a}</span>
                                )) : <span className="text-muted small">None assigned</span>}
                            </div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-success text-white border-0">
                            <h6 className="mb-0">Documents</h6>
                        </div>
                        <div className="card-body p-0">
                            {documents.length === 0 ? (
                                <p className="text-muted small text-center py-4 mb-0">No documents uploaded</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-sm mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="ps-3 small">Type</th>
                                                <th className="small">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {documents.map((doc) => (
                                                <tr key={doc.id}>
                                                    <td className="ps-3 small">{doc.documentType}</td>
                                                    <td>
                                                        <span className={`badge ${docBadge(doc.status)}`}>{doc.status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <div className="p-3">
                                <button className="btn btn-outline-success btn-sm w-100">Upload Document</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
