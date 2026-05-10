import { useState, useEffect, useCallback } from "react";
import {
    createAudit, getAuditsByStatus, getAuditsByComplianceId,
    getAuditsByOfficerId, closeAudit,
} from "../api/auditApi";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import ContentGate from "../components/ContentGate";
import ActionButton from "../components/ActionButton";
import { useAuth } from "../auth/AuthContext";

export default function AuditPage() {
    const { getUserId } = useAuth();
    const [audits, setAudits]                 = useState([]);
    const [loading, setLoading]               = useState(false);
    const [error, setError]                   = useState("");
    const [success, setSuccess]               = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [filterType, setFilterType]         = useState("all");
    const [filterValue, setFilterValue]       = useState("");

    const [formData, setFormData] = useState({ complianceId: "" });

    const loadAudits = useCallback(async () => {
        try {
            setLoading(true);
            let data = [];
            if (filterType === "status" && filterValue) data = await getAuditsByStatus(filterValue);
            else if (filterType === "compliance" && filterValue) data = await getAuditsByComplianceId(filterValue);
            else if (filterType === "officer" && filterValue) data = await getAuditsByOfficerId(filterValue);
            setAudits(data || []);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load audits");
        } finally {
            setLoading(false);
        }
    }, [filterType, filterValue]);

    useEffect(() => { loadAudits(); }, [loadAudits]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError(""); setSuccess("");
        if (!formData.complianceId) { setError("Compliance ID is required."); return; }
        try {
            setLoading(true);
            await createAudit({ complianceId: Number(formData.complianceId) }, getUserId());
            setSuccess("Audit created successfully.");
            setFormData({ complianceId: "" });
            setShowCreateForm(false);
            loadAudits();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create audit");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = async (auditId) => {
        setError(""); setSuccess("");
        try {
            setLoading(true);
            await closeAudit(auditId, "COMPLETED", getUserId());
            setSuccess("Audit closed successfully.");
            loadAudits();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to close audit");
        } finally {
            setLoading(false);
        }
    };

    const statusBadge = (status) => {
        if (status === "COMPLETED") return "bg-success";
        if (status === "IN_PROGRESS") return "bg-info text-dark";
        if (status === "PENDING") return "bg-warning text-dark";
        return "bg-secondary";
    };

    if (loading && audits.length === 0) return <Loading />;

    return (
        <div>
            {/* Page header */}
            <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                <div>
                    <h4 className="fw-bold text-success mb-0">Audit Management</h4>
                    <p className="text-muted small mb-0">Create and manage compliance audits</p>
                </div>
                {/* Only AUDIT_MANAGER can create audits */}
                <ActionButton
                    authority="AUDIT_MANAGER"
                    className="btn btn-success btn-sm"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    title="Only Audit Managers can create audits"
                >
                    {showCreateForm ? "Cancel" : "+ Create Audit"}
                </ActionButton>
            </div>

            {error   && <Alert message={error}   type="danger" />}
            {success && <Alert message={success} type="success" />}

            {/* Create Form — only visible to AUDIT_MANAGER */}
            <ContentGate authority="AUDIT_MANAGER">
                {showCreateForm && (
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-success text-white border-0">
                            <h6 className="mb-0">Create New Audit</h6>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleCreate}>
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label htmlFor="audit-complianceId" className="form-label small fw-semibold">
                                            Compliance Record ID
                                        </label>
                                        <input id="audit-complianceId" type="number" className="form-control"
                                            name="complianceId" value={formData.complianceId}
                                            onChange={(e) => setFormData({ complianceId: e.target.value })}
                                            placeholder="Enter compliance record ID" required />
                                    </div>
                                </div>
                                <div className="mt-3 d-flex gap-2">
                                    <button type="submit" className="btn btn-success btn-sm" disabled={loading}>
                                        {loading ? "Creating..." : "Create Audit"}
                                    </button>
                                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowCreateForm(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </ContentGate>

            {/* Filter — visible to all users */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white border-bottom">
                    <h6 className="mb-0 fw-semibold">Filter Audits</h6>
                </div>
                <div className="card-body p-3">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-3">
                            <label className="form-label small fw-semibold">Filter By</label>
                            <select className="form-select form-select-sm" value={filterType}
                                onChange={(e) => { setFilterType(e.target.value); setFilterValue(""); }}>
                                <option value="all">All Audits</option>
                                <option value="status">Status</option>
                                <option value="compliance">Compliance Record ID</option>
                                <option value="officer">Officer ID</option>
                            </select>
                        </div>
                        {filterType === "status" && (
                            <div className="col-md-3">
                                <label className="form-label small fw-semibold">Status</label>
                                <select className="form-select form-select-sm" value={filterValue}
                                    onChange={(e) => setFilterValue(e.target.value)}>
                                    <option value="">Select status</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="PENDING">Pending</option>
                                </select>
                            </div>
                        )}
                        {filterType !== "all" && filterType !== "status" && (
                            <div className="col-md-3">
                                <label className="form-label small fw-semibold">
                                    {filterType === "compliance" ? "Compliance ID" : "Officer ID"}
                                </label>
                                <input type="number" className="form-control form-control-sm" value={filterValue}
                                    onChange={(e) => setFilterValue(e.target.value)} placeholder="Enter ID" />
                            </div>
                        )}
                        <div className="col-md-2">
                            <button className="btn btn-success btn-sm w-100" onClick={loadAudits} disabled={loading}>
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Audits Table — visible to all users */}
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-bottom">
                    <h6 className="mb-0 fw-semibold">Audit Records</h6>
                </div>
                <div className="card-body p-0">
                    {audits.length === 0 ? (
                        <p className="text-muted text-center py-5 mb-0">
                            {filterType === "all" ? "Use the filter above to search for audit records" : "No audits found"}
                        </p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="ps-4 small">Audit ID</th>
                                        <th className="small">Compliance ID</th>
                                        <th className="small">Auditor ID</th>
                                        <th className="small">Status</th>
                                        <th className="small">Created</th>
                                        <th className="small text-end pe-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {audits.map((a) => (
                                        <tr key={a.id}>
                                            <td className="ps-4 small fw-semibold">{a.id}</td>
                                            <td className="small">{a.complianceId}</td>
                                            <td className="small">{a.auditorId || "—"}</td>
                                            <td><span className={`badge ${statusBadge(a.status)}`}>{a.status || "PENDING"}</span></td>
                                            <td className="small text-muted">
                                                {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "—"}
                                            </td>
                                            <td className="text-end pe-4">
                                                {/* Only AUDIT_MANAGER can close audits */}
                                                {a.status !== "COMPLETED" && (
                                                    <ActionButton
                                                        authority="AUDIT_MANAGER"
                                                        className="btn btn-success btn-sm"
                                                        onClick={() => handleClose(a.id)}
                                                        disabled={loading}
                                                        title="Only Audit Managers can close audits"
                                                    >
                                                        Close
                                                    </ActionButton>
                                                )}
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
    );
}
