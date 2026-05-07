import { useState, useEffect } from "react";
import { createCompliance, getComplianceBySubject, getComplianceByParticipant } from "../api/complianceApi";
import Loading from "../components/Loading";
import Alert from "../components/Alert";

export default function CompliancePage() {
    const [complianceRecords, setComplianceRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [filterType, setFilterType] = useState("all");
    const [filterId, setFilterId] = useState("");

    const [formData, setFormData] = useState({
        subjectType: "PROJECT",
        subjectId: "",
        participantId: "",
        result: "PASS",
        notes: "",
        evidenceURL: "",
    });

    const user = JSON.parse(localStorage.getItem("userData") || "{}");

    useEffect(() => {
        loadCompliance();
    }, []);

    const loadCompliance = async () => {
        try {
            setLoading(true);
            if (filterType === "participant" && filterId) {
                const data = await getComplianceByParticipant(filterId);
                setComplianceRecords(data || []);
            } else if (filterType === "subject" && filterId) {
                const data = await getComplianceBySubject(formData.subjectType, filterId);
                setComplianceRecords(data || []);
            } else {
                // Load all - without filter
                setComplianceRecords([]);
            }
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load compliance records");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCreateCompliance = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (
            !formData.subjectType ||
            !formData.subjectId ||
            !formData.participantId ||
            !formData.result
        ) {
            setError("Subject Type, Subject ID, Participant ID, and Result are required");
            return;
        }

        try {
            setLoading(true);
            await createCompliance(formData, user.id);
            setSuccess("Compliance record created successfully!");
            setFormData({
                subjectType: "PROJECT",
                subjectId: "",
                participantId: "",
                result: "PASS",
                notes: "",
                evidenceURL: "",
            });
            setShowCreateForm(false);
            loadCompliance();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create compliance record");
        } finally {
            setLoading(false);
        }
    };

    if (loading && complianceRecords.length === 0) return <Loading />;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Compliance Management</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    + Create Compliance Record
                </button>
            </div>

            {error && <Alert message={error} type="danger" />}
            {success && <Alert message={success} type="success" />}

            {/* Create Compliance Form */}
            {showCreateForm && (
                <div className="card mb-4">
                    <div className="card-header bg-info text-white">
                        <h5 className="mb-0">Create New Compliance Record</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleCreateCompliance}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="subjectType" className="form-label">
                                        Subject Type
                                    </label>
                                    <select
                                        id="subjectType"
                                        className="form-control"
                                        name="subjectType"
                                        value={formData.subjectType}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="PROJECT">Project</option>
                                        <option value="APPLICATION">Application</option>
                                    </select>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="subjectId" className="form-label">
                                        Subject ID
                                    </label>
                                    <input
                                        id="subjectId"
                                        type="number"
                                        className="form-control"
                                        name="subjectId"
                                        value={formData.subjectId}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="participantId" className="form-label">
                                        Participant ID
                                    </label>
                                    <input
                                        id="participantId"
                                        type="number"
                                        className="form-control"
                                        name="participantId"
                                        value={formData.participantId}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="result" className="form-label">
                                        Result
                                    </label>
                                    <select
                                        id="result"
                                        className="form-control"
                                        name="result"
                                        value={formData.result}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="PASS">Pass</option>
                                        <option value="FAIL">Fail</option>
                                        <option value="PENDING">Pending</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="notes" className="form-label">
                                    Notes
                                </label>
                                <textarea
                                    id="notes"
                                    className="form-control"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Additional notes about compliance check"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="evidenceURL" className="form-label">
                                    Evidence URL
                                </label>
                                <input
                                    id="evidenceURL"
                                    type="url"
                                    className="form-control"
                                    name="evidenceURL"
                                    value={formData.evidenceURL}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/evidence/report.pdf"
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-success me-2"
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create Record"}
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
                    <h5 className="mb-0">Filter Compliance Records</h5>
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
                                    setFilterId("");
                                }}
                            >
                                <option value="all">All Records</option>
                                <option value="participant">Participant</option>
                                <option value="subject">Subject (Project/Application)</option>
                            </select>
                        </div>

                        {filterType !== "all" && (
                            <div className="col-md-4 mb-3">
                                <label htmlFor="filterId" className="form-label">
                                    {filterType === "participant" ? "Participant ID" : "Subject ID"}
                                </label>
                                <input
                                    id="filterId"
                                    type="number"
                                    className="form-control"
                                    value={filterId}
                                    onChange={(e) => setFilterId(e.target.value)}
                                    placeholder="Enter ID"
                                />
                            </div>
                        )}

                        <div className="col-md-4 mb-3 d-flex align-items-end">
                            <button
                                className="btn btn-outline-primary w-100"
                                onClick={loadCompliance}
                                disabled={loading}
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Compliance Records Table */}
            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">Compliance Records</h5>
                </div>
                <div className="card-body">
                    {complianceRecords.length === 0 ? (
                        <p className="text-muted text-center">No compliance records found</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Subject Type</th>
                                        <th>Subject ID</th>
                                        <th>Participant ID</th>
                                        <th>Result</th>
                                        <th>Notes</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {complianceRecords.map((record) => (
                                        <tr key={record.id}>
                                            <td>{record.subjectType}</td>
                                            <td>{record.subjectId}</td>
                                            <td>{record.participantId}</td>
                                            <td>
                                                <span
                                                    className={`badge bg-${
                                                        record.result === "PASS"
                                                            ? "success"
                                                            : record.result === "FAIL"
                                                            ? "danger"
                                                            : "warning"
                                                    }`}
                                                >
                                                    {record.result}
                                                </span>
                                            </td>
                                            <td>{record.notes || "N/A"}</td>
                                            <td>
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
