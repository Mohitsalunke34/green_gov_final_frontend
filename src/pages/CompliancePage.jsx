import { useState, useEffect } from "react";
import { createCompliance, getComplianceBySubject, getComplianceByParticipant } from "../api/complianceApi";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import ContentGate from "../components/ContentGate";
import ActionButton from "../components/ActionButton";
import { useAuth } from "../auth/AuthContext";

export default function CompliancePage() {
    const { getUserId } = useAuth();
    const [records, setRecords]               = useState([]);
    const [loading, setLoading]               = useState(false);
    const [error, setError]                   = useState("");
    const [success, setSuccess]               = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [filterType, setFilterType]         = useState("all");
    const [filterId, setFilterId]             = useState("");

    const [formData, setFormData] = useState({
        subjectType: "PROJECT", subjectId: "", participantId: "",
        result: "PASS", notes: "", evidenceURL: "",
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { loadCompliance(); }, []);

    const loadCompliance = async () => {
        try {
            setLoading(true);
            if (filterType === "participant" && filterId) {
                const data = await getComplianceByParticipant(filterId);
                setRecords(data || []);
            } else if (filterType === "subject" && filterId) {
                const data = await getComplianceBySubject(formData.subjectType, filterId);
                setRecords(data || []);
            } else {
                setRecords([]);
            }
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load compliance records");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleCreate = async (e) => {
        e.preventDefault();
        setError(""); setSuccess("");
        if (!formData.subjectId || !formData.participantId) {
            setError("Subject ID and Participant ID are required.");
            return;
        }
        try {
            setLoading(true);
            await createCompliance(formData, getUserId());
            setSuccess("Compliance record created successfully.");
            setFormData({ subjectType: "PROJECT", subjectId: "", participantId: "", result: "PASS", notes: "", evidenceURL: "" });
            setShowCreateForm(false);
            loadCompliance();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create compliance record");
        } finally {
            setLoading(false);
        }
    };

    const resultBadge = (result) =>
        result === "PASS" ? "bg-success" : result === "FAIL" ? "bg-danger" : "bg-warning text-dark";

    if (loading && records.length === 0) return <Loading />;

    return (
        <div>
            {/* Page header */}
            <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                <div>
                    <h4 className="fw-bold text-success mb-0">Compliance Management</h4>
                    <p className="text-muted small mb-0">Create and review compliance records</p>
                </div>
                {/* Only COMPLIANCE_OFFICER can create records */}
                <ActionButton
                    authority="COMPLIANCE_OFFICER"
                    className="btn btn-success btn-sm"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    title="Only Compliance Officers can create records"
                >
                    {showCreateForm ? "Cancel" : "+ Create Record"}
                </ActionButton>
            </div>

            {error   && <Alert message={error}   type="danger" />}
            {success && <Alert message={success} type="success" />}

            {/* Create Form — only visible to COMPLIANCE_OFFICER */}
            <ContentGate authority="COMPLIANCE_OFFICER">
                {showCreateForm && (
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-success text-white border-0">
                            <h6 className="mb-0">Create Compliance Record</h6>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleCreate}>
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label htmlFor="comp-subjectType" className="form-label small fw-semibold">Subject Type</label>
                                        <select id="comp-subjectType" className="form-select" name="subjectType"
                                            value={formData.subjectType} onChange={handleInputChange}>
                                            <option value="PROJECT">Project</option>
                                            <option value="APPLICATION">Application</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="comp-subjectId" className="form-label small fw-semibold">Subject ID</label>
                                        <input id="comp-subjectId" type="number" className="form-control" name="subjectId"
                                            value={formData.subjectId} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="comp-participantId" className="form-label small fw-semibold">Participant ID</label>
                                        <input id="comp-participantId" type="number" className="form-control" name="participantId"
                                            value={formData.participantId} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="comp-result" className="form-label small fw-semibold">Result</label>
                                        <select id="comp-result" className="form-select" name="result"
                                            value={formData.result} onChange={handleInputChange}>
                                            <option value="PASS">Pass</option>
                                            <option value="FAIL">Fail</option>
                                            <option value="PENDING">Pending</option>
                                        </select>
                                    </div>
                                    <div className="col-md-8">
                                        <label htmlFor="comp-evidenceURL" className="form-label small fw-semibold">Evidence URL</label>
                                        <input id="comp-evidenceURL" type="url" className="form-control" name="evidenceURL"
                                            value={formData.evidenceURL} onChange={handleInputChange}
                                            placeholder="https://example.com/evidence.pdf" />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="comp-notes" className="form-label small fw-semibold">Notes</label>
                                        <textarea id="comp-notes" className="form-control" name="notes" rows="2"
                                            value={formData.notes} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="mt-3 d-flex gap-2">
                                    <button type="submit" className="btn btn-success btn-sm" disabled={loading}>
                                        {loading ? "Creating..." : "Create Record"}
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
                    <h6 className="mb-0 fw-semibold">Filter Records</h6>
                </div>
                <div className="card-body p-3">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-3">
                            <label className="form-label small fw-semibold">Filter By</label>
                            <select className="form-select form-select-sm" value={filterType}
                                onChange={(e) => { setFilterType(e.target.value); setFilterId(""); }}>
                                <option value="all">All Records</option>
                                <option value="participant">Participant ID</option>
                                <option value="subject">Subject ID</option>
                            </select>
                        </div>
                        {filterType !== "all" && (
                            <div className="col-md-3">
                                <label className="form-label small fw-semibold">
                                    {filterType === "participant" ? "Participant ID" : "Subject ID"}
                                </label>
                                <input type="number" className="form-control form-control-sm" value={filterId}
                                    onChange={(e) => setFilterId(e.target.value)} placeholder="Enter ID" />
                            </div>
                        )}
                        {filterType !== "all" && filterType === "subject" && (
                            <div className="col-md-3">
                                <label className="form-label small fw-semibold">Subject Type</label>
                                <select className="form-select form-select-sm" name="subjectType"
                                    value={formData.subjectType} onChange={handleInputChange}>
                                    <option value="PROJECT">Project</option>
                                    <option value="APPLICATION">Application</option>
                                </select>
                            </div>
                        )}
                        <div className="col-md-2">
                            <button className="btn btn-success btn-sm w-100" onClick={loadCompliance} disabled={loading}>
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Records Table — visible to all users */}
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-bottom">
                    <h6 className="mb-0 fw-semibold">Compliance Records</h6>
                </div>
                <div className="card-body p-0">
                    {records.length === 0 ? (
                        <p className="text-muted text-center py-5 mb-0">
                            {filterType === "all" ? "Use the filter above to search for records" : "No records found"}
                        </p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="ps-4 small">Subject Type</th>
                                        <th className="small">Subject ID</th>
                                        <th className="small">Participant ID</th>
                                        <th className="small">Result</th>
                                        <th className="small">Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((r) => (
                                        <tr key={r.id}>
                                            <td className="ps-4 small">{r.subjectType}</td>
                                            <td className="small">{r.subjectId}</td>
                                            <td className="small">{r.participantId}</td>
                                            <td><span className={`badge ${resultBadge(r.result)}`}>{r.result}</span></td>
                                            <td className="small text-muted">{r.notes || "—"}</td>
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
