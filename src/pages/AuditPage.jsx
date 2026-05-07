import { useState, useEffect, useCallback } from "react";
import {
    createAudit,
    getAuditsByStatus,
    getAuditsByComplianceId,
    getAuditsByOfficerId,
    closeAudit,
} from "../api/auditApi";
import Loading from "../components/Loading";
import Alert from "../components/Alert";

export default function AuditPage() {
    const [audits, setAudits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [filterType, setFilterType] = useState("all");
    const [filterValue, setFilterValue] = useState("");

    const [formData, setFormData] = useState({
        complianceId: "",
    });

    const user = JSON.parse(localStorage.getItem("userData") || "{}");

    const loadAudits = useCallback(async () => {
        try {
            setLoading(true);
            let data = [];

            if (filterType === "status" && filterValue) {
                data = await getAuditsByStatus(filterValue);
            } else if (filterType === "compliance" && filterValue) {
                data = await getAuditsByComplianceId(filterValue);
            } else if (filterType === "officer" && filterValue) {
                data = await getAuditsByOfficerId(filterValue);
            } else {
                // Load all
                data = [];
            }

            setAudits(data || []);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load audits");
        } finally {
            setLoading(false);
        }
    }, [filterType, filterValue]);

    useEffect(() => {
        loadAudits();
    }, [loadAudits]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCreateAudit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!formData.complianceId) {
            setError("Compliance ID is required");
            return;
        }

        try {
            setLoading(true);
            await createAudit({ complianceId: formData.complianceId }, user.id);
            setSuccess("Audit created successfully!");
            setFormData({ complianceId: "" });
            setShowCreateForm(false);
            loadAudits();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create audit");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseAudit = async (auditId) => {
        setError("");
        setSuccess("");

        try {
            setLoading(true);
            await closeAudit(auditId, "COMPLETED", user.id);
            setSuccess("Audit closed successfully!");
            loadAudits();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to close audit");
        } finally {
            setLoading(false);
        }
    };

    if (loading && audits.length === 0) return <Loading />;

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case "COMPLETED":
                return "success";
            case "IN_PROGRESS":
                return "info";
            case "PENDING":
                return "warning";
            default:
                return "secondary";
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Audit Management</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    + Create Audit
                </button>
            </div>

            {error && <Alert message={error} type="danger" />}
            {success && <Alert message={success} type="success" />}

            {/* Create Audit Form */}
            {showCreateForm && (
                <div className="card mb-4">
                    <div className="card-header bg-info text-white">
                        <h5 className="mb-0">Create New Audit</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleCreateAudit}>
                            <div className="mb-3">
                                <label htmlFor="complianceId" className="form-label">
                                    Compliance Record ID <span className="text-danger">*</span>
                                </label>
                                <input
                                    id="complianceId"
                                    type="number"
                                    className="form-control"
                                    name="complianceId"
                                    value={formData.complianceId}
                                    onChange={handleInputChange}
                                    placeholder="Enter compliance record ID"
                                    required
                                />
                                <small className="form-text text-muted">
                                    Reference to a compliance record to audit
                                </small>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-success me-2"
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create Audit"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowCreateForm(false)}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Filter Section */}
            <div className="card mb-4">
                <div className="card-header">
                    <h5 className="mb-0">Filter Audits</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label htmlFor="filterType" className="form-label">
                                Filter By
                            </label>
                            <select
                                id="filterType"
                                className="form-control"
                                value={filterType}
                                onChange={(e) => {
                                    setFilterType(e.target.value);
                                    setFilterValue("");
                                }}
                            >
                                <option value="all">All Audits</option>
                                <option value="status">Status</option>
                                <option value="compliance">Compliance Record ID</option>
                                <option value="officer">Officer ID</option>
                            </select>
                        </div>

                        {filterType === "status" && (
                            <div className="col-md-4 mb-3">
                                <label htmlFor="filterValue" className="form-label">
                                    Status
                                </label>
                                <select
                                    id="filterValue"
                                    className="form-control"
                                    value={filterValue}
                                    onChange={(e) => setFilterValue(e.target.value)}
                                >
                                    <option value="">Select Status</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="PENDING">Pending</option>
                                </select>
                            </div>
                        )}

                        {filterType !== "all" && filterType !== "status" && (
                            <div className="col-md-4 mb-3">
                                <label htmlFor="filterValue" className="form-label">
                                    {filterType === "compliance"
                                        ? "Compliance Record ID"
                                        : "Officer ID"}
                                </label>
                                <input
                                    id="filterValue"
                                    type="number"
                                    className="form-control"
                                    value={filterValue}
                                    onChange={(e) => setFilterValue(e.target.value)}
                                    placeholder="Enter ID"
                                />
                            </div>
                        )}

                        <div className="col-md-4 mb-3 d-flex align-items-end">
                            <button
                                className="btn btn-outline-primary w-100"
                                onClick={loadAudits}
                                disabled={loading}
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Audits Table */}
            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">Audit Records</h5>
                </div>
                <div className="card-body">
                    {audits.length === 0 ? (
                        <p className="text-muted text-center">No audits found</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Audit ID</th>
                                        <th>Compliance ID</th>
                                        <th>Auditor ID</th>
                                        <th>Status</th>
                                        <th>Created Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {audits.map((audit) => (
                                        <tr key={audit.id}>
                                            <td>{audit.id}</td>
                                            <td>{audit.complianceId}</td>
                                            <td>{audit.auditorId || "Unassigned"}</td>
                                            <td>
                                                <span
                                                    className={`badge bg-${getStatusBadgeColor(
                                                        audit.status
                                                    )}`}
                                                >
                                                    {audit.status || "PENDING"}
                                                </span>
                                            </td>
                                            <td>
                                                {audit.createdAt
                                                    ? new Date(audit.createdAt).toLocaleDateString()
                                                    : "N/A"}
                                            </td>
                                            <td>
                                                {audit.status !== "COMPLETED" && (
                                                    <button
                                                        className="btn btn-sm btn-success me-2"
                                                        onClick={() => handleCloseAudit(audit.id)}
                                                        disabled={loading}
                                                    >
                                                        Close
                                                    </button>
                                                )}
                                                <button className="btn btn-sm btn-info">View</button>
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
