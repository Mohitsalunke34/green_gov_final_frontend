import { useState, useEffect } from "react";
import { fetchAllApplications, applyForProgram, updateApplicationStatus } from "../api/applicationApi";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import { PermissionGate } from "../components/PermissionGate";

export default function ApplicationsPage() {
    const [applications, setApplications]     = useState([]);
    const [loading, setLoading]               = useState(true);
    const [error, setError]                   = useState("");
    const [success, setSuccess]               = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);

    const [formData, setFormData] = useState({ programId: "", statement: "" });

    useEffect(() => { loadApplications(); }, []);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const data = await fetchAllApplications();
            setApplications(data || []);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleCreate = async (e) => {
        e.preventDefault();
        setError(""); setSuccess("");
        try {
            setLoading(true);
            await applyForProgram(formData);
            setSuccess("Application submitted successfully.");
            setFormData({ programId: "", statement: "" });
            setShowCreateForm(false);
            loadApplications();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit application");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (appId, newStatus) => {
        try {
            await updateApplicationStatus(appId, newStatus);
            setSuccess(`Application status updated to ${newStatus}.`);
            loadApplications();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update status");
        }
    };

    const statusBadge = (s) =>
        s === "APPROVED" ? "bg-success" : s === "REJECTED" ? "bg-danger" : "bg-warning text-dark";

    if (loading && applications.length === 0) return <Loading />;

    return (
        <div>
            {/* Page header */}
            <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                <div>
                    <h4 className="fw-bold text-success mb-0">Applications</h4>
                    <p className="text-muted small mb-0">Submit and track program applications</p>
                </div>
                <PermissionGate roles={["CITIZEN", "BUSINESS_OWNER"]}>
                    <button className="btn btn-success btn-sm" onClick={() => setShowCreateForm(!showCreateForm)}>
                        {showCreateForm ? "Cancel" : "+ New Application"}
                    </button>
                </PermissionGate>
            </div>

            {error   && <Alert message={error}   type="danger" />}
            {success && <Alert message={success} type="success" />}

            {/* Create Form — only for citizens/businesses */}
            <PermissionGate roles={["CITIZEN", "BUSINESS_OWNER"]}>
                {showCreateForm && (
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-success text-white border-0">
                            <h6 className="mb-0">Submit Application</h6>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleCreate}>
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label htmlFor="app-programId" className="form-label small fw-semibold">Program ID</label>
                                        <input id="app-programId" type="number" className="form-control" name="programId"
                                            value={formData.programId} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="app-statement" className="form-label small fw-semibold">Application Statement</label>
                                        <textarea id="app-statement" className="form-control" name="statement"
                                            value={formData.statement} onChange={handleInputChange} rows="3" required />
                                    </div>
                                </div>
                                <div className="mt-3 d-flex gap-2">
                                    <button type="submit" className="btn btn-success btn-sm" disabled={loading}>
                                        {loading ? "Submitting..." : "Submit Application"}
                                    </button>
                                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowCreateForm(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </PermissionGate>

            {/* Table */}
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-bottom d-flex align-items-center justify-content-between">
                    <h6 className="mb-0 fw-semibold">Applications</h6>
                    <button className="btn btn-outline-success btn-sm" onClick={loadApplications}>Refresh</button>
                </div>
                <div className="card-body p-0">
                    {applications.length === 0 ? (
                        <p className="text-muted text-center py-5 mb-0">No applications found</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="ps-4 small">Program</th>
                                        <th className="small">Applied On</th>
                                        <th className="small">Status</th>
                                        <PermissionGate authority="PROGRAM_MANAGER">
                                            <th className="small text-end pe-4">Review</th>
                                        </PermissionGate>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map((a) => (
                                        <tr key={a.id}>
                                            <td className="ps-4 small fw-semibold">{a.programName || `Program #${a.programId}`}</td>
                                            <td className="small text-muted">
                                                {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "—"}
                                            </td>
                                            <td>
                                                <span className={`badge ${statusBadge(a.status)}`}>{a.status || "PENDING"}</span>
                                            </td>
                                            <PermissionGate authority="PROGRAM_MANAGER">
                                                <td className="text-end pe-4">
                                                    <select className="form-select form-select-sm" style={{ width: 130 }}
                                                        value={a.status} onChange={(e) => handleStatusChange(a.id, e.target.value)}>
                                                        <option value="PENDING">Pending</option>
                                                        <option value="APPROVED">Approved</option>
                                                        <option value="REJECTED">Rejected</option>
                                                    </select>
                                                </td>
                                            </PermissionGate>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
