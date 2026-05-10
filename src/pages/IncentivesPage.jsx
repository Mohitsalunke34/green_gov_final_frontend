import { useState, useEffect } from "react";
import {
    fetchAllIncentives,
    createIncentive,
    getIncentiveById,
    getIncentivesByApplicationId,
    getIncentivesByBeneficiaryId,
    deleteIncentive,
} from "../api/incentiveApi";
import {
    createDisbursement,
    getDisbursementsByIncentiveId,
    getDisbursementByIds,
} from "../api/disbursementApi";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import ContentGate from "../components/ContentGate";
import { useAuth } from "../auth/AuthContext";

export default function IncentivesPage() {
    const { getUserId } = useAuth();
    const officerUserId = getUserId ? getUserId() : "";

    const [activeTab, setActiveTab] = useState("list");
    const [incentives, setIncentives] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Create incentive form
    const [createForm, setCreateForm] = useState({ applicationId: "", amount: "" });

    // Lookup states
    const [lookupId, setLookupId] = useState("");
    const [lookedUpIncentive, setLookedUpIncentive] = useState(null);
    const [appLookupId, setAppLookupId] = useState("");
    const [appIncentives, setAppIncentives] = useState([]);
    const [beneficiaryId, setBeneficiaryId] = useState("");
    const [beneficiaryIncentives, setBeneficiaryIncentives] = useState([]);
    const [deleteId, setDeleteId] = useState("");

    // Disbursement states
    const [disbForm, setDisbForm] = useState({ incentiveId: "", amount: "" });
    const [disbIncentiveId, setDisbIncentiveId] = useState("");
    const [disbursements, setDisbursements] = useState([]);
    const [disbLookupIncentiveId, setDisbLookupIncentiveId] = useState("");
    const [disbLookupDisbId, setDisbLookupDisbId] = useState("");
    const [lookedUpDisb, setLookedUpDisb] = useState(null);

    const clearMessages = () => { setError(""); setSuccess(""); };

    useEffect(() => {
        if (activeTab === "list") loadIncentives();
    }, [activeTab]);

    const loadIncentives = async () => {
        try {
            setLoading(true);
            const data = await fetchAllIncentives();
            setIncentives(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load incentives");
        } finally { setLoading(false); }
    };

    const handleCreateIncentive = async (e) => {
        e.preventDefault(); clearMessages();
        try {
            setLoading(true);
            await createIncentive(
                { applicationId: Number(createForm.applicationId), amount: Number(createForm.amount) },
                officerUserId
            );
            setSuccess("Incentive created successfully!");
            setCreateForm({ applicationId: "", amount: "" });
            if (activeTab === "list") loadIncentives();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create incentive");
        } finally { setLoading(false); }
    };

    const handleGetById = async () => {
        if (!lookupId) { setError("Enter incentive ID"); return; }
        clearMessages();
        try {
            setLoading(true);
            const data = await getIncentiveById(lookupId);
            setLookedUpIncentive(data);
        } catch (err) {
            setError(err.response?.data?.message || "Incentive not found");
        } finally { setLoading(false); }
    };

    const handleGetByAppId = async () => {
        if (!appLookupId) { setError("Enter application ID"); return; }
        clearMessages();
        try {
            setLoading(true);
            const data = await getIncentivesByApplicationId(appLookupId);
            setAppIncentives(Array.isArray(data) ? data : [data]);
        } catch (err) {
            setError(err.response?.data?.message || "No incentives found for this application");
        } finally { setLoading(false); }
    };

    const handleGetByBeneficiary = async () => {
        if (!beneficiaryId) { setError("Enter beneficiary ID"); return; }
        clearMessages();
        try {
            setLoading(true);
            const data = await getIncentivesByBeneficiaryId(beneficiaryId);
            setBeneficiaryIncentives(Array.isArray(data) ? data : [data]);
        } catch (err) {
            setError(err.response?.data?.message || "No incentives found for this beneficiary");
        } finally { setLoading(false); }
    };

    const handleDeleteIncentive = async () => {
        if (!deleteId) { setError("Enter incentive ID"); return; }
        if (!window.confirm(`Delete incentive #${deleteId}?`)) return;
        clearMessages();
        try {
            setLoading(true);
            await deleteIncentive(deleteId);
            setSuccess("Incentive deleted!");
            setDeleteId("");
            loadIncentives();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete incentive");
        } finally { setLoading(false); }
    };

    // Disbursement handlers
    const handleCreateDisbursement = async (e) => {
        e.preventDefault(); clearMessages();
        try {
            setLoading(true);
            await createDisbursement(
                { incentiveId: Number(disbForm.incentiveId), amount: Number(disbForm.amount) },
                officerUserId
            );
            setSuccess("Disbursement created successfully!");
            setDisbForm({ incentiveId: "", amount: "" });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create disbursement");
        } finally { setLoading(false); }
    };

    const handleGetDisbursementsByIncentive = async () => {
        if (!disbIncentiveId) { setError("Enter incentive ID"); return; }
        clearMessages();
        try {
            setLoading(true);
            const data = await getDisbursementsByIncentiveId(disbIncentiveId, officerUserId);
            setDisbursements(Array.isArray(data) ? data : [data]);
        } catch (err) {
            setError(err.response?.data?.message || "No disbursements found");
        } finally { setLoading(false); }
    };

    const handleFetchDisbByIds = async () => {
        if (!disbLookupIncentiveId || !disbLookupDisbId) { setError("Enter both incentive and disbursement IDs"); return; }
        clearMessages();
        try {
            setLoading(true);
            const data = await getDisbursementByIds(disbLookupIncentiveId, disbLookupDisbId, officerUserId);
            setLookedUpDisb(data);
        } catch (err) {
            setError(err.response?.data?.message || "Disbursement not found");
        } finally { setLoading(false); }
    };

    const badgeColor = (status) => {
        if (status === "APPROVED") return "success";
        if (status === "PENDING") return "warning";
        if (status === "REJECTED") return "danger";
        return "secondary";
    };

    return (
        <div>
            <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                <div>
                    <h4 className="fw-bold text-success mb-0">Incentives & Disbursements</h4>
                    <p className="text-muted small mb-0">Manage incentives and financial disbursements</p>
                </div>
            </div>

            {error   && <Alert message={error}   type="danger" />}
            {success && <Alert message={success} type="success" />}

            {/* Tabs */}
            <ul className="nav nav-tabs mb-4">
                {[
                    { key: "list",         label: "All Incentives" },
                    { key: "create",       label: "Create Incentive" },
                    { key: "lookup",       label: "Lookup" },
                    { key: "disbursements",label: "Disbursements" },
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

            {/* All Incentives */}
            {!loading && activeTab === "list" && (
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">All Incentives</h6>
                        <button className="btn btn-sm btn-light text-success" onClick={loadIncentives}>↻ Refresh</button>
                    </div>
                    <div className="card-body">
                        {incentives.length === 0 ? (
                            <p className="text-muted text-center py-4">No incentives found</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead className="table-success">
                                        <tr>
                                            <th>ID</th>
                                            <th>Application ID</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Created</th>
                                            <ContentGate authority="DISBURSEMENT_OFFICER">
                                                <th>Action</th>
                                            </ContentGate>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {incentives.map(inc => (
                                            <tr key={inc.id}>
                                                <td>{inc.id}</td>
                                                <td>{inc.applicationId}</td>
                                                <td>₹{inc.amount?.toLocaleString()}</td>
                                                <td><span className={`badge bg-${badgeColor(inc.status)}`}>{inc.status || "PENDING"}</span></td>
                                                <td>{inc.createdAt ? new Date(inc.createdAt).toLocaleDateString() : "—"}</td>
                                                <ContentGate authority="DISBURSEMENT_OFFICER">
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => { setDeleteId(String(inc.id)); handleDeleteIncentive(); }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </ContentGate>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Create Incentive */}
            {!loading && activeTab === "create" && (
                <ContentGate
                    authority="DISBURSEMENT_OFFICER"
                    fallback={<div className="alert alert-info">Only Disbursement Officers can create incentives.</div>}
                >
                    <div className="card border-0 shadow-sm" style={{ maxWidth: 500 }}>
                        <div className="card-header bg-success text-white">
                            <h6 className="mb-0">Create New Incentive</h6>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleCreateIncentive}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Application ID</label>
                                    <input type="number" className="form-control" value={createForm.applicationId}
                                        onChange={e => setCreateForm({ ...createForm, applicationId: e.target.value })} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Amount (₹)</label>
                                    <input type="number" className="form-control" value={createForm.amount}
                                        onChange={e => setCreateForm({ ...createForm, amount: e.target.value })} required />
                                </div>
                                <button type="submit" className="btn btn-success w-100" disabled={loading}>
                                    {loading ? "Creating..." : "Create Incentive"}
                                </button>
                            </form>
                        </div>
                    </div>
                </ContentGate>
            )}

            {/* Lookup Tab */}
            {!loading && activeTab === "lookup" && (
                <div className="row g-4">
                    {/* By Incentive ID */}
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-success text-white"><h6 className="mb-0">By Incentive ID</h6></div>
                            <div className="card-body">
                                <div className="d-flex gap-2 mb-3">
                                    <input type="number" className="form-control" placeholder="Incentive ID"
                                        value={lookupId} onChange={e => setLookupId(e.target.value)} />
                                    <button className="btn btn-success" onClick={handleGetById}>Go</button>
                                </div>
                                {lookedUpIncentive && (
                                    <div className="bg-light p-3 rounded">
                                        {Object.entries(lookedUpIncentive).map(([k, v]) => (
                                            <div key={k} className="mb-1 small">
                                                <span className="text-muted">{k}: </span><strong>{String(v)}</strong>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* By Application ID */}
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-success text-white"><h6 className="mb-0">By Application ID</h6></div>
                            <div className="card-body">
                                <div className="d-flex gap-2 mb-3">
                                    <input type="number" className="form-control" placeholder="Application ID"
                                        value={appLookupId} onChange={e => setAppLookupId(e.target.value)} />
                                    <button className="btn btn-success" onClick={handleGetByAppId}>Go</button>
                                </div>
                                {appIncentives.map((inc, i) => (
                                    <div key={i} className="bg-light p-2 rounded mb-2 small">
                                        <strong>#{inc.id}</strong> — ₹{inc.amount?.toLocaleString()} — <span className={`badge bg-${badgeColor(inc.status)}`}>{inc.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* By Beneficiary ID */}
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-success text-white"><h6 className="mb-0">By Beneficiary ID</h6></div>
                            <div className="card-body">
                                <div className="d-flex gap-2 mb-3">
                                    <input type="number" className="form-control" placeholder="Beneficiary ID"
                                        value={beneficiaryId} onChange={e => setBeneficiaryId(e.target.value)} />
                                    <button className="btn btn-success" onClick={handleGetByBeneficiary}>Go</button>
                                </div>
                                {beneficiaryIncentives.map((inc, i) => (
                                    <div key={i} className="bg-light p-2 rounded mb-2 small">
                                        <strong>#{inc.id}</strong> — ₹{inc.amount?.toLocaleString()} — <span className={`badge bg-${badgeColor(inc.status)}`}>{inc.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Delete — DISBURSEMENT_OFFICER only */}
                    <ContentGate authority="DISBURSEMENT_OFFICER">
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-danger text-white"><h6 className="mb-0">Delete Incentive</h6></div>
                                <div className="card-body">
                                    <div className="d-flex gap-2">
                                        <input type="number" className="form-control" placeholder="Incentive ID"
                                            value={deleteId} onChange={e => setDeleteId(e.target.value)} />
                                        <button className="btn btn-danger" onClick={handleDeleteIncentive}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ContentGate>
                </div>
            )}

            {/* Disbursements Tab */}
            {!loading && activeTab === "disbursements" && (
                <div className="row g-4">
                    {/* Create Disbursement — DISBURSEMENT_OFFICER only */}
                    <ContentGate authority="DISBURSEMENT_OFFICER"
                        fallback={<div className="col-md-5"><div className="alert alert-info">Only Disbursement Officers can create disbursements.</div></div>}
                    >
                        <div className="col-md-5">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-success text-white"><h6 className="mb-0">Create Disbursement</h6></div>
                                <div className="card-body">
                                    <form onSubmit={handleCreateDisbursement}>
                                        <div className="mb-3">
                                            <label className="form-label">Incentive ID</label>
                                            <input type="number" className="form-control" value={disbForm.incentiveId}
                                                onChange={e => setDisbForm({ ...disbForm, incentiveId: e.target.value })} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Amount (₹)</label>
                                            <input type="number" className="form-control" value={disbForm.amount}
                                                onChange={e => setDisbForm({ ...disbForm, amount: e.target.value })} required />
                                        </div>
                                        <button type="submit" className="btn btn-success w-100" disabled={loading}>
                                            {loading ? "Creating..." : "Create Disbursement"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </ContentGate>

                    {/* Disbursement History by Incentive */}
                    <div className="col-md-7">
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-success text-white"><h6 className="mb-0">History by Incentive ID</h6></div>
                            <div className="card-body">
                                <div className="d-flex gap-2 mb-3">
                                    <input type="number" className="form-control" placeholder="Incentive ID"
                                        value={disbIncentiveId} onChange={e => setDisbIncentiveId(e.target.value)} />
                                    <button className="btn btn-success" onClick={handleGetDisbursementsByIncentive}>Fetch</button>
                                </div>
                                {disbursements.length > 0 && (
                                    <div className="table-responsive">
                                        <table className="table table-sm table-striped">
                                            <thead className="table-success">
                                                <tr><th>ID</th><th>Incentive ID</th><th>Amount</th><th>Date</th></tr>
                                            </thead>
                                            <tbody>
                                                {disbursements.map((d, i) => (
                                                    <tr key={d.id || i}>
                                                        <td>{d.id}</td>
                                                        <td>{d.incentiveId}</td>
                                                        <td>₹{d.amount?.toLocaleString()}</td>
                                                        <td>{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "—"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Fetch by incentive ID + disbursement ID */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-success text-white"><h6 className="mb-0">Fetch by Incentive ID &amp; Disbursement ID</h6></div>
                            <div className="card-body">
                                <div className="row g-2 mb-3">
                                    <div className="col">
                                        <input type="number" className="form-control" placeholder="Incentive ID"
                                            value={disbLookupIncentiveId} onChange={e => setDisbLookupIncentiveId(e.target.value)} />
                                    </div>
                                    <div className="col">
                                        <input type="number" className="form-control" placeholder="Disbursement ID"
                                            value={disbLookupDisbId} onChange={e => setDisbLookupDisbId(e.target.value)} />
                                    </div>
                                    <div className="col-auto">
                                        <button className="btn btn-success" onClick={handleFetchDisbByIds}>Fetch</button>
                                    </div>
                                </div>
                                {lookedUpDisb && (
                                    <div className="bg-light p-3 rounded">
                                        {Object.entries(lookedUpDisb).map(([k, v]) => (
                                            <div key={k} className="mb-1 small">
                                                <span className="text-muted">{k}: </span><strong>{String(v)}</strong>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
