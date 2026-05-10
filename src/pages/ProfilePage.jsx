import { useState, useEffect, useCallback } from "react";
import { getParticipantByUserId, updateParticipant, getParticipantDocuments } from "../api/participantApi";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import DocumentUploadModal from "../components/DocumentUploadModal";

export default function ProfilePage() {
    const user = JSON.parse(localStorage.getItem("userData") || "{}");
    const currentUserId = user.id || user.userId;

    const [profile, setProfile] = useState({});
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    
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
        </div>
    );
}