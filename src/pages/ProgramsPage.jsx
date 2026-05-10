import { useState, useEffect } from "react";
import { fetchAllPrograms, createProgram, updateProgramStatus, updateProgram, deleteProgram, deductBudget, programExists } from "../api/programApi";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import ActionButton from "../components/ActionButton";
import ContentGate from "../components/ContentGate";

export default function ProgramsPage() {
    const [programs, setPrograms]             = useState([]);
    const [loading, setLoading]               = useState(true);
    const [error, setError]                   = useState("");
    const [success, setSuccess]               = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingProgram, setEditingProgram] = useState(null);
    const [deductProgramId, setDeductProgramId] = useState("");
    const [deductAmount, setDeductAmount]     = useState("");
    const [existsId, setExistsId]             = useState("");
    const [existsResult, setExistsResult]     = useState(null);

    const [formData, setFormData] = useState({
        title: "", description: "", startDate: "", endDate: "", budget: "", status: "ACTIVE", ownerUserId: "",
    });

    useEffect(() => { loadPrograms(); }, []);

    const loadPrograms = async () => {
        try { setLoading(true); const data = await fetchAllPrograms(); setPrograms(data || []); setError(""); }
        catch (err) { setError(err.response?.data?.message || "Failed to load programs"); }
        finally { setLoading(false); }
    };

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const clearMessages = () => { setError(""); setSuccess(""); };

    const handleCreateProgram = async (e) => {
        e.preventDefault(); clearMessages();
        try { setLoading(true); await createProgram(formData); setSuccess("Program created successfully."); setFormData({ title: "", description: "", startDate: "", endDate: "", budget: "", status: "ACTIVE", ownerUserId: "" }); setShowCreateForm(false); loadPrograms(); }
        catch (err) { setError(err.response?.data?.message || "Failed to create program"); }
        finally { setLoading(false); }
    };

    const handleStatusChange = async (programId, newStatus) => {
        try { await updateProgramStatus(programId, newStatus); setSuccess(`Program status updated to ${newStatus}.`); loadPrograms(); }
        catch (err) { setError(err.response?.data?.message || "Failed to update status"); }
    };

    // ── Edit Program ──
    const startEdit = (p) => {
        setEditingProgram(p.id);
        setFormData({
            title: p.title || "", description: p.description || "",
            startDate: p.startDate ? p.startDate.split("T")[0] : "",
            endDate: p.endDate ? p.endDate.split("T")[0] : "",
            budget: p.budget || "", status: p.status || "ACTIVE",
            ownerUserId: p.ownerUserId || "",
        });
        setShowCreateForm(false); clearMessages();
    };

    const handleUpdateProgram = async (e) => {
        e.preventDefault(); clearMessages();
        try { setLoading(true); await updateProgram(editingProgram, formData); setSuccess("Program updated successfully."); setEditingProgram(null); loadPrograms(); }
        catch (err) { setError(err.response?.data?.message || "Failed to update program"); }
        finally { setLoading(false); }
    };

    // ── Delete Program ──
    const handleDeleteProgram = async (programId) => {
        if (!window.confirm(`Delete program #${programId}? This cannot be undone.`)) return;
        clearMessages();
        try { await deleteProgram(programId); setSuccess("Program deleted successfully."); loadPrograms(); }
        catch (err) { setError(err.response?.data?.message || "Failed to delete program"); }
    };

    // ── Deduct Budget ──
    const handleDeductBudget = async () => {
        if (!deductProgramId || !deductAmount) { setError("Enter both Program ID and Amount"); return; }
        clearMessages();
        try { await deductBudget(deductProgramId, Number(deductAmount)); setSuccess(`₹${Number(deductAmount).toLocaleString()} deducted from program #${deductProgramId}`); setDeductProgramId(""); setDeductAmount(""); loadPrograms(); }
        catch (err) { setError(err.response?.data?.message || "Failed to deduct budget"); }
    };

    // ── Check Program Exists ──
    const handleCheckExists = async () => {
        if (!existsId) { setError("Enter a Program ID"); return; }
        clearMessages();
        try { const result = await programExists(existsId); setExistsResult(result); }
        catch (err) { setExistsResult(false); }
    };

    if (loading && programs.length === 0) return <Loading />;

    return (
        <div>
            {/* Page header */}
            <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                <div>
                    <h4 className="fw-bold text-success mb-0">Programs</h4>
                    <p className="text-muted small mb-0">Create and manage green initiative programs</p>
                </div>
                <ActionButton authority="PROGRAM_MANAGER" className="btn btn-success btn-sm"
                    onClick={() => { setShowCreateForm(!showCreateForm); setEditingProgram(null); }}
                    title="Only Program Managers can create programs">
                    {showCreateForm ? "Cancel" : "+ New Program"}
                </ActionButton>
            </div>

            {error   && <Alert message={error}   type="danger" />}
            {success && <Alert message={success} type="success" />}

            {/* Create Form — PROGRAM_MANAGER */}
            <ContentGate authority="PROGRAM_MANAGER">
                {showCreateForm && !editingProgram && (
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-success text-white border-0"><h6 className="mb-0">Create New Program</h6></div>
                        <div className="card-body p-4">
                            <form onSubmit={handleCreateProgram}>
                                <div className="row g-3">
                                    <div className="col-md-8">
                                        <label htmlFor="prog-title" className="form-label small fw-semibold">Program Title</label>
                                        <input id="prog-title" type="text" className="form-control" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Rooftop Solar Subsidy 2026" required />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="prog-owner" className="form-label small fw-semibold">Owner User ID</label>
                                        <input id="prog-owner" type="number" className="form-control" name="ownerUserId" value={formData.ownerUserId} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="prog-desc" className="form-label small fw-semibold">Description</label>
                                        <textarea id="prog-desc" className="form-control" name="description" rows="2" value={formData.description} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="prog-start" className="form-label small fw-semibold">Start Date</label>
                                        <input id="prog-start" type="date" className="form-control" name="startDate" value={formData.startDate} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="prog-end" className="form-label small fw-semibold">End Date</label>
                                        <input id="prog-end" type="date" className="form-control" name="endDate" value={formData.endDate} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="prog-budget" className="form-label small fw-semibold">Budget (INR)</label>
                                        <input id="prog-budget" type="number" className="form-control" name="budget" value={formData.budget} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="mt-3 d-flex gap-2">
                                    <button type="submit" className="btn btn-success btn-sm" disabled={loading}>{loading ? "Creating..." : "Create Program"}</button>
                                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowCreateForm(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Form — PROGRAM_MANAGER */}
                {editingProgram && (
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-warning text-dark border-0"><h6 className="mb-0">Edit Program #{editingProgram}</h6></div>
                        <div className="card-body p-4">
                            <form onSubmit={handleUpdateProgram}>
                                <div className="row g-3">
                                    <div className="col-md-8">
                                        <label className="form-label small fw-semibold">Program Title</label>
                                        <input type="text" className="form-control" name="title" value={formData.title} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small fw-semibold">Owner User ID</label>
                                        <input type="number" className="form-control" name="ownerUserId" value={formData.ownerUserId} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-semibold">Description</label>
                                        <textarea className="form-control" name="description" rows="2" value={formData.description} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label small fw-semibold">Start Date</label>
                                        <input type="date" className="form-control" name="startDate" value={formData.startDate} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label small fw-semibold">End Date</label>
                                        <input type="date" className="form-control" name="endDate" value={formData.endDate} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label small fw-semibold">Budget (INR)</label>
                                        <input type="number" className="form-control" name="budget" value={formData.budget} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label small fw-semibold">Status</label>
                                        <select className="form-select" name="status" value={formData.status} onChange={handleInputChange}>
                                            <option value="ACTIVE">Active</option>
                                            <option value="PAUSED">Paused</option>
                                            <option value="CLOSED">Closed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-3 d-flex gap-2">
                                    <button type="submit" className="btn btn-warning btn-sm" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
                                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setEditingProgram(null)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </ContentGate>

            {/* Programs Table */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white border-bottom d-flex align-items-center justify-content-between">
                    <h6 className="mb-0 fw-semibold">All Programs</h6>
                    <button className="btn btn-outline-success btn-sm" onClick={loadPrograms}>Refresh</button>
                </div>
                <div className="card-body p-0">
                    {programs.length === 0 ? (
                        <p className="text-muted text-center py-5 mb-0">No programs found</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="ps-4 small">ID</th>
                                        <th className="small">Title</th>
                                        <th className="small">Description</th>
                                        <th className="small">Budget</th>
                                        <th className="small">Status</th>
                                        <th className="small text-end pe-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {programs.map((p) => (
                                        <tr key={p.id}>
                                            <td className="ps-4 small text-muted">#{p.id}</td>
                                            <td className="small fw-semibold">{p.title || p.name}</td>
                                            <td className="small text-muted" style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.description || "—"}</td>
                                            <td className="small">₹{p.budget ? Number(p.budget).toLocaleString() : "—"}</td>
                                            <td>
                                                <span className={`badge ${p.status === "ACTIVE" ? "bg-success" : p.status === "PAUSED" ? "bg-warning text-dark" : "bg-secondary"}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="text-end pe-4">
                                                <ContentGate authority="PROGRAM_MANAGER">
                                                    <div className="d-flex gap-1 justify-content-end">
                                                        <select className="form-select form-select-sm" style={{ width: 110 }}
                                                            value={p.status} onChange={(e) => handleStatusChange(p.id, e.target.value)}>
                                                            <option value="ACTIVE">Active</option>
                                                            <option value="PAUSED">Paused</option>
                                                            <option value="CLOSED">Closed</option>
                                                        </select>
                                                        <button className="btn btn-sm btn-outline-warning" title="Edit" onClick={() => startEdit(p)}>✏️</button>
                                                        <button className="btn btn-sm btn-outline-danger" title="Delete" onClick={() => handleDeleteProgram(p.id)}>🗑️</button>
                                                    </div>
                                                </ContentGate>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Deduct Budget & Check Exists — PROGRAM_MANAGER */}
            <ContentGate authority="PROGRAM_MANAGER">
                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-success text-white"><h6 className="mb-0">Deduct Budget</h6></div>
                            <div className="card-body">
                                <div className="row g-2 align-items-end">
                                    <div className="col-5">
                                        <label className="form-label small fw-semibold">Program ID</label>
                                        <input type="number" className="form-control form-control-sm" value={deductProgramId} onChange={e => setDeductProgramId(e.target.value)} placeholder="ID" />
                                    </div>
                                    <div className="col-5">
                                        <label className="form-label small fw-semibold">Amount (₹)</label>
                                        <input type="number" className="form-control form-control-sm" value={deductAmount} onChange={e => setDeductAmount(e.target.value)} placeholder="Amount" />
                                    </div>
                                    <div className="col-2">
                                        <button className="btn btn-success btn-sm w-100" onClick={handleDeductBudget}>Deduct</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-success text-white"><h6 className="mb-0">Check Program Exists</h6></div>
                            <div className="card-body">
                                <div className="d-flex gap-2 align-items-end">
                                    <div className="flex-grow-1">
                                        <label className="form-label small fw-semibold">Program ID</label>
                                        <input type="number" className="form-control form-control-sm" value={existsId} onChange={e => { setExistsId(e.target.value); setExistsResult(null); }} placeholder="Enter ID" />
                                    </div>
                                    <button className="btn btn-success btn-sm" onClick={handleCheckExists}>Check</button>
                                </div>
                                {existsResult !== null && (
                                    <div className={`mt-2 p-2 rounded text-center small fw-semibold ${existsResult ? "bg-success bg-opacity-10 text-success" : "bg-danger bg-opacity-10 text-danger"}`}>
                                        {existsResult ? `✅ Program #${existsId} exists` : `❌ Program #${existsId} does not exist`}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </ContentGate>
        </div>
    );
}