import { useState, useEffect, useCallback } from "react";
import {
    getParticipantByUserId, updateParticipant, getParticipantDocuments,
    getParticipantById, updateDocumentStatus, updateParticipantVerificationStatus,
} from "../api/participantApi";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import DocumentUploadModal from "../components/DocumentUploadModal";
import ContentGate from "../components/ContentGate";

export default function ProfilePage() {
    const user = JSON.parse(localStorage.getItem("userData") || "{}");
    const currentUserId = user.id || user.userId;

    const [profile, setProfile] = useState({});
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Officer verification states
    const [lookupId, setLookupId] = useState("");
    const [lookupProfile, setLookupProfile] = useState(null);
    const [lookupDocs, setLookupDocs] = useState([]);
    const [lookupLoading, setLookupLoading] = useState(false);
    const [lookupError, setLookupError] = useState("");
    const [lookupSuccess, setLookupSuccess] = useState("");
    
    const [contactDetails, setContactDetails] = useState({ phone: "N/A", email: "N/A", other: "N/A" });
    
    const [formData, setFormData] = useState({
        legalName: "",
        address: "",
        phone: "",
        email: "",
        other: ""
    });

    const loadProfile = useCallback(async () => {
        try {
            setLoading(true);
            const profileData = await getParticipantByUserId(currentUserId);
            
            setProfile(profileData);
            
            const actualParticipantId = profileData.id || profileData.participantId;
            const docsData = await getParticipantDocuments(actualParticipantId);
            setDocuments(docsData || []);

            let parsedContact = { phone: "", email: "", other: "" };
            if (profileData.contactInfo) {
                try {
                    parsedContact = JSON.parse(profileData.contactInfo);
                } catch (e) {
                    parsedContact.phone = profileData.contactInfo;
                }
            }

            setContactDetails({
                phone: parsedContact.phone || "N/A",
                email: parsedContact.email || "N/A",
                other: parsedContact.other || "N/A"
            });

            setFormData({
                legalName: profileData.legalName || "",
                address: profileData.address || "",
                phone: parsedContact.phone || "",
                email: parsedContact.email || "",
                other: parsedContact.other || ""
            });
            
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load profile");
        } finally {
            setLoading(false);
        }
    }, [currentUserId]);

    useEffect(() => {
        if (currentUserId) {
            loadProfile();
        } else {
            setError("User data not found. Please log in again.");
            setLoading(false);
        }
    }, [currentUserId, loadProfile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveProfile = async () => {
        if (!formData.legalName || !formData.address) {
            setError("Legal Name and Address are required fields.");
            return;
        }

        if (!formData.phone && !formData.email) {
            setError("At least one contact method (Phone or Email) is required.");
            return;
        }

        try {
            const contactJson = JSON.stringify({
                phone: formData.phone,
                email: formData.email,
                other: formData.other
            });

            await updateParticipant(profile.id, {
                legalName: formData.legalName,
                address: formData.address,
                contactInfo: contactJson
            });
            
            setEditMode(false);
            loadProfile();
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        }
    };

    const handleViewDocument = (base64Data) => {
        if (!base64Data) {
            alert("Document data is missing.");
            return;
        }
        
        let fileSource = base64Data;
        if (!base64Data.startsWith("data:")) {
            const isPdf = base64Data.startsWith("JVBERi"); 
            const mimeType = isPdf ? "application/pdf" : "image/png";
            fileSource = `data:${mimeType};base64,${base64Data}`;
        }

        const newWindow = window.open();
        if (newWindow) {
            newWindow.document.write(`<iframe src="${fileSource}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
        } else {
            alert("Please allow popups to view your documents.");
        }
    };

    if (loading) return <Loading />;

    return (
        <div>
            <h2 className="mb-4">Dashboard & Profile</h2>

            {error && <Alert message={error} type="danger" />}

            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0">Profile Information</h5>
                        </div>
                        <div className="card-body">
                            {editMode ? (
                                <>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small">Legal Name <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" name="legalName" value={formData.legalName} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small">Address <span className="text-danger">*</span></label>
                                        <textarea className="form-control" name="address" rows="2" value={formData.address} onChange={handleInputChange} required />
                                    </div>
                                    <hr className="my-3" />
                                    <h6 className="fw-bold mb-1">Contact Info</h6>
                                    <p className="small text-muted mb-3">Provide at least one method of contact.</p>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small">Phone</label>
                                        <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleInputChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small">Email</label>
                                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small">Alternate Contact</label>
                                        <input type="text" className="form-control" name="other" value={formData.other} onChange={handleInputChange} />
                                    </div>
                                    <div className="mt-4">
                                        <button className="btn btn-success me-2" onClick={handleSaveProfile}>Save Changes</button>
                                        <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="row mb-3">
                                        <div className="col-6">
                                            <label className="form-label text-muted small mb-0">Entity Type</label>
                                            <p className="fw-semibold">{profile.entityType || "N/A"}</p>
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label text-muted small mb-0">Account Status</label>
                                            <div>
                                                <span className={`badge bg-${profile.status === "VERIFIED" ? "success" : profile.status === "REJECTED" ? "danger" : "warning"}`}>
                                                    {profile.status || "PENDING"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small mb-0">Legal Name</label>
                                        <p className="fw-semibold">{profile.legalName || "N/A"}</p>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small mb-0">Address</label>
                                        <p className="fw-semibold">{profile.address || "N/A"}</p>
                                    </div>
                                    <hr className="my-3 text-muted" />
                                    <h6 className="fw-bold small text-success mb-2">CONTACT INFO</h6>
                                    <div className="mb-2">
                                        <label className="form-label text-muted small mb-0">Phone</label>
                                        <p className="fw-semibold mb-1">{contactDetails.phone}</p>
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label text-muted small mb-0">Email</label>
                                        <p className="fw-semibold mb-1">{contactDetails.email}</p>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label text-muted small mb-0">Alternate Contact</label>
                                        <p className="fw-semibold mb-0">{contactDetails.other}</p>
                                    </div>
                                    
                                    <button className="btn btn-outline-success w-100" onClick={() => setEditMode(true)}>
                                        Edit Profile
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">My Documents</h5>
                            <button className="btn btn-sm btn-success" onClick={() => setShowModal(true)}>
                                + Upload
                            </button>
                        </div>
                        <div className="card-body p-0">
                            {documents.length === 0 ? (
                                <div className="p-4 text-center text-muted">
                                    <p className="mb-0">No documents uploaded yet.</p>
                                    <small>Upload an ID Proof or License to get verified.</small>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="ps-3">Type</th>
                                                <th>Status</th>
                                                <th className="text-end pe-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {documents.map((doc) => (
                                                <tr key={doc.id}>
                                                    <td className="ps-3 fw-semibold">{doc.documentType}</td>
                                                    <td>
                                                        <span className={`badge bg-${doc.verificationStatus === "VERIFIED" ? "success" : doc.verificationStatus === "REJECTED" ? "danger" : "warning"}`}>
                                                            {doc.verificationStatus || doc.status}
                                                        </span>
                                                    </td>
                                                    <td className="text-end pe-3">
                                                        <button 
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => handleViewDocument(doc.fileUri || doc.fileData)}
                                                        >
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <DocumentUploadModal 
                show={showModal} 
                handleClose={() => setShowModal(false)} 
                profileId={profile.id} 
                onUploadSuccess={loadProfile} 
            />

            {/* ── Officer Verification Section ── */}
            <ContentGate authorities={["COMPLIANCE_OFFICER", "PROGRAM_MANAGER", "AUDIT_MANAGER", "ADMIN"]}>
                <hr className="my-4" />
                <h5 className="fw-bold text-success mb-3">Participant Verification (Officer)</h5>
                <p className="text-muted small">Look up a participant by ID to verify their profile and documents.</p>

                {lookupError   && <Alert message={lookupError}   type="danger" />}
                {lookupSuccess && <Alert message={lookupSuccess} type="success" />}

                <div className="row g-4">
                    {/* Lookup */}
                    <div className="col-md-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-success text-white"><h6 className="mb-0">Lookup Participant by ID</h6></div>
                            <div className="card-body">
                                <div className="d-flex gap-2" style={{ maxWidth: 400 }}>
                                    <input type="number" className="form-control" placeholder="Participant ID"
                                        value={lookupId} onChange={e => setLookupId(e.target.value)} />
                                    <button className="btn btn-success" disabled={lookupLoading} onClick={async () => {
                                        if (!lookupId) { setLookupError("Enter a participant ID"); return; }
                                        setLookupError(""); setLookupSuccess(""); setLookupLoading(true);
                                        try {
                                            const p = await getParticipantById(lookupId);
                                            setLookupProfile(p);
                                            const d = await getParticipantDocuments(lookupId);
                                            setLookupDocs(Array.isArray(d) ? d : []);
                                        } catch (err) {
                                            setLookupError(err.response?.data?.message || "Participant not found");
                                            setLookupProfile(null); setLookupDocs([]);
                                        } finally { setLookupLoading(false); }
                                    }}>Fetch</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details + Verification */}
                    {lookupProfile && (
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0 fw-semibold">Participant #{lookupProfile.id}</h6>
                                    <span className={`badge bg-${lookupProfile.status === "VERIFIED" ? "success" : lookupProfile.status === "REJECTED" ? "danger" : "warning"}`}>
                                        {lookupProfile.status || "PENDING"}
                                    </span>
                                </div>
                                <div className="card-body">
                                    <div className="mb-2"><span className="text-muted small">Legal Name:</span> <strong>{lookupProfile.legalName || "N/A"}</strong></div>
                                    <div className="mb-2"><span className="text-muted small">Entity Type:</span> <strong>{lookupProfile.entityType || "N/A"}</strong></div>
                                    <div className="mb-2"><span className="text-muted small">Address:</span> <strong>{lookupProfile.address || "N/A"}</strong></div>
                                    <div className="mb-3"><span className="text-muted small">Contact:</span> <strong>{lookupProfile.contactInfo || "N/A"}</strong></div>
                                    <hr />
                                    <p className="fw-semibold small text-muted mb-2">Update Profile Verification Status</p>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-success btn-sm" disabled={lookupLoading}
                                            onClick={async () => {
                                                setLookupError(""); setLookupSuccess(""); setLookupLoading(true);
                                                try { await updateParticipantVerificationStatus(lookupProfile.id, "VERIFIED"); setLookupSuccess("Profile verified!"); setLookupProfile({ ...lookupProfile, status: "VERIFIED" }); }
                                                catch (err) { setLookupError(err.response?.data?.message || "Failed to verify"); }
                                                finally { setLookupLoading(false); }
                                            }}>✅ Verify Profile</button>
                                        <button className="btn btn-danger btn-sm" disabled={lookupLoading}
                                            onClick={async () => {
                                                setLookupError(""); setLookupSuccess(""); setLookupLoading(true);
                                                try { await updateParticipantVerificationStatus(lookupProfile.id, "REJECTED"); setLookupSuccess("Profile rejected."); setLookupProfile({ ...lookupProfile, status: "REJECTED" }); }
                                                catch (err) { setLookupError(err.response?.data?.message || "Failed to reject"); }
                                                finally { setLookupLoading(false); }
                                            }}>❌ Reject Profile</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Documents + Verification */}
                    {lookupProfile && (
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-header bg-white border-bottom">
                                    <h6 className="mb-0 fw-semibold">Documents ({lookupDocs.length})</h6>
                                </div>
                                <div className="card-body p-0">
                                    {lookupDocs.length === 0 ? (
                                        <p className="text-muted text-center py-4 mb-0">No documents found</p>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-hover align-middle mb-0">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th className="ps-3 small">Doc ID</th>
                                                        <th className="small">Type</th>
                                                        <th className="small">Status</th>
                                                        <th className="small text-end pe-3">Verify</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {lookupDocs.map(doc => (
                                                        <tr key={doc.id}>
                                                            <td className="ps-3 small">#{doc.id}</td>
                                                            <td className="small">{doc.documentType}</td>
                                                            <td>
                                                                <span className={`badge bg-${doc.verificationStatus === "VERIFIED" ? "success" : doc.verificationStatus === "REJECTED" ? "danger" : "warning"}`}>
                                                                    {doc.verificationStatus || doc.status || "PENDING"}
                                                                </span>
                                                            </td>
                                                            <td className="text-end pe-3">
                                                                <div className="btn-group btn-group-sm">
                                                                    <button className="btn btn-outline-success" title="Verify"
                                                                        onClick={async () => {
                                                                            setLookupError(""); setLookupSuccess("");
                                                                            try { await updateDocumentStatus(lookupProfile.id, doc.id, "VERIFIED"); setLookupSuccess(`Document #${doc.id} verified`); const d = await getParticipantDocuments(lookupProfile.id); setLookupDocs(Array.isArray(d) ? d : []); }
                                                                            catch (err) { setLookupError(err.response?.data?.message || "Failed"); }
                                                                        }}>✅</button>
                                                                    <button className="btn btn-outline-danger" title="Reject"
                                                                        onClick={async () => {
                                                                            setLookupError(""); setLookupSuccess("");
                                                                            try { await updateDocumentStatus(lookupProfile.id, doc.id, "REJECTED"); setLookupSuccess(`Document #${doc.id} rejected`); const d = await getParticipantDocuments(lookupProfile.id); setLookupDocs(Array.isArray(d) ? d : []); }
                                                                            catch (err) { setLookupError(err.response?.data?.message || "Failed"); }
                                                                        }}>❌</button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ContentGate>
        </div>
    );
}