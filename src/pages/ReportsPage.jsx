import { useState, useEffect } from "react";
import {
    generateReport,
    getReportsByScope,
    getReportById,
    getAnalytics,
    getReportsSummary,
} from "../api/reportsApi";
import Loading from "../components/Loading";
import Alert from "../components/Alert";

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState("analytics");
    const [analytics, setAnalytics] = useState(null);
    const [summary, setSummary] = useState(null);
    const [reports, setReports] = useState([]);
    const [reportById, setReportById] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Generate report state
    const [generateType, setGenerateType] = useState("COMPLIANCE");
    // Fetch by scope state
    const [scopeType, setScopeType] = useState("PROJECT");
    // Fetch by ID state
    const [fetchId, setFetchId] = useState("");

    useEffect(() => {
        if (activeTab === "analytics") loadAnalytics();
        if (activeTab === "summary") loadSummary();
    }, [activeTab]);

    const clearMessages = () => { setError(""); setSuccess(""); };

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            const data = await getAnalytics();
            setAnalytics(data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load analytics");
        } finally { setLoading(false); }
    };

    const loadSummary = async () => {
        try {
            setLoading(true);
            const data = await getReportsSummary();
            setSummary(data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load summary");
        } finally { setLoading(false); }
    };

    const handleGenerateReport = async () => {
        clearMessages();
        try {
            setLoading(true);
            const data = await generateReport(generateType);
            setSuccess(`Report of type "${generateType}" generated successfully!`);
            setReports(prev => [data, ...prev]);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to generate report");
        } finally { setLoading(false); }
    };

    const handleFetchByScope = async () => {
        clearMessages();
        try {
            setLoading(true);
            const data = await getReportsByScope(scopeType);
            setReports(Array.isArray(data) ? data : [data]);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch reports by scope");
        } finally { setLoading(false); }
    };

    const handleFetchById = async () => {
        if (!fetchId) { setError("Please enter a Report ID"); return; }
        clearMessages();
        try {
            setLoading(true);
            const data = await getReportById(fetchId);
            setReportById(data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch report");
        } finally { setLoading(false); }
    };

    return (
        <div>
            <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                <div>
                    <h4 className="fw-bold text-success mb-0">Reports & Analytics</h4>
                    <p className="text-muted small mb-0">Generate reports and view analytics</p>
                </div>
            </div>

            {error   && <Alert message={error}   type="danger" />}
            {success && <Alert message={success} type="success" />}

            {/* Tabs */}
            <ul className="nav nav-tabs mb-4">
                {[
                    { key: "analytics", label: "Analytics" },
                    { key: "generate",  label: "Generate Report" },
                    { key: "scope",     label: "By Scope" },
                    { key: "byId",      label: "By Report ID" },
                    { key: "summary",   label: "Summary" },
                ].map(tab => (
                    <li className="nav-item" key={tab.key}>
                        <button
                            className={`nav-link ${activeTab === tab.key ? "active fw-semibold" : "text-muted"}`}
                            onClick={() => { setActiveTab(tab.key); clearMessages(); }}
                            style={activeTab === tab.key ? { color: '#198754', borderBottomColor: '#198754' } : {}}
                        >
                            {tab.label}
                        </button>
                    </li>
                ))}
            </ul>

            {loading && <Loading />}

            {/* Analytics Tab */}
            {!loading && activeTab === "analytics" && (
                <div>
                    {analytics ? (
                        <div className="row g-4">
                            {Object.entries(analytics).map(([key, value]) => (
                                <div className="col-md-4" key={key}>
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-body text-center">
                                            <h6 className="text-muted text-uppercase">{key.replace(/_/g, " ")}</h6>
                                            <h3 className="fw-bold text-success">{String(value)}</h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card border-0 shadow-sm">
                            <div className="card-body text-center py-5">
                                <div className="display-6 mb-3">📊</div>
                                <p className="text-muted">No analytics data available</p>
                                <button className="btn btn-success" onClick={loadAnalytics}>
                                    Reload Analytics
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Generate Report Tab */}
            {!loading && activeTab === "generate" && (
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-success text-white">
                        <h5 className="mb-0">Generate New Report</h5>
                    </div>
                    <div className="card-body">
                        <div className="row align-items-end g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Report Type</label>
                                <select
                                    className="form-select"
                                    value={generateType}
                                    onChange={e => setGenerateType(e.target.value)}
                                >
                                    <option value="COMPLIANCE">Compliance</option>
                                    <option value="PROJECT">Project</option>
                                    <option value="APPLICATION">Application</option>
                                    <option value="INCENTIVE">Incentive</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <button
                                    className="btn btn-success w-100"
                                    onClick={handleGenerateReport}
                                    disabled={loading}
                                >
                                    {loading ? "Generating..." : "Generate Report"}
                                </button>
                            </div>
                        </div>

                        {reports.length > 0 && (
                            <div className="mt-4">
                                <h6 className="fw-semibold mb-3">Generated Reports</h6>
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead className="table-success">
                                            <tr>
                                                <th>ID</th>
                                                <th>Type</th>
                                                <th>Scope</th>
                                                <th>Created Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reports.map((r, idx) => (
                                                <tr key={r.id || idx}>
                                                    <td>{r.id || "—"}</td>
                                                    <td><span className="badge bg-success">{r.type || generateType}</span></td>
                                                    <td>{r.scope || "—"}</td>
                                                    <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Now"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* By Scope Tab */}
            {!loading && activeTab === "scope" && (
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-success text-white">
                        <h5 className="mb-0">Reports by Scope</h5>
                    </div>
                    <div className="card-body">
                        <div className="row align-items-end g-3 mb-4">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Scope</label>
                                <select
                                    className="form-select"
                                    value={scopeType}
                                    onChange={e => setScopeType(e.target.value)}
                                >
                                    <option value="PROJECT">Project</option>
                                    <option value="APPLICATION">Application</option>
                                    <option value="COMPLIANCE">Compliance</option>
                                    <option value="INCENTIVE">Incentive</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <button className="btn btn-success w-100" onClick={handleFetchByScope} disabled={loading}>
                                    Fetch Reports
                                </button>
                            </div>
                        </div>

                        {reports.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead className="table-success">
                                        <tr><th>ID</th><th>Type</th><th>Scope</th><th>Created Date</th></tr>
                                    </thead>
                                    <tbody>
                                        {reports.map((r, idx) => (
                                            <tr key={r.id || idx}>
                                                <td>{r.id}</td>
                                                <td><span className="badge bg-success">{r.type}</span></td>
                                                <td>{r.scope || scopeType}</td>
                                                <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-muted text-center mt-3">Select a scope and click Fetch Reports</p>
                        )}
                    </div>
                </div>
            )}

            {/* Fetch by ID Tab */}
            {!loading && activeTab === "byId" && (
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-success text-white">
                        <h5 className="mb-0">Fetch Report by ID</h5>
                    </div>
                    <div className="card-body">
                        <div className="row align-items-end g-3 mb-4">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Report ID</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter report ID"
                                    value={fetchId}
                                    onChange={e => setFetchId(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4">
                                <button className="btn btn-success w-100" onClick={handleFetchById} disabled={loading}>
                                    Fetch
                                </button>
                            </div>
                        </div>

                        {reportById && (
                            <div className="card bg-light border-0">
                                <div className="card-body">
                                    <h6 className="fw-bold mb-3">Report Details</h6>
                                    <div className="row">
                                        {Object.entries(reportById).map(([k, v]) => (
                                            <div className="col-md-6 mb-2" key={k}>
                                                <span className="text-muted">{k.replace(/_/g, " ")}: </span>
                                                <strong>{String(v)}</strong>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Summary Tab */}
            {!loading && activeTab === "summary" && (
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-success text-white">
                        <h5 className="mb-0">Reports Summary</h5>
                    </div>
                    <div className="card-body">
                        {summary ? (
                            typeof summary === "object" && !Array.isArray(summary) ? (
                                <div className="row g-3">
                                    {Object.entries(summary).map(([k, v]) => (
                                        <div className="col-md-4" key={k}>
                                            <div className="border rounded p-3 text-center">
                                                <p className="text-muted mb-1 small">{k.replace(/_/g, " ")}</p>
                                                <h4 className="fw-bold text-success">{String(v)}</h4>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <pre className="bg-light p-3 rounded">{JSON.stringify(summary, null, 2)}</pre>
                            )
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-muted">No summary data available</p>
                                <button className="btn btn-success" onClick={loadSummary}>Load Summary</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
