import { useState, useEffect } from "react";
import { fetchAllPrograms, createProgram, updateProgramStatus } from "../api/programApi";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import ActionButton from "../components/ActionButton";
import ContentGate from "../components/ContentGate";

export default function ProgramsPage() {
    const [programs, setPrograms]           = useState([]);
    const [loading, setLoading]             = useState(true);
    const [error, setError]                 = useState("");
    const [success, setSuccess]             = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);

    const [formData, setFormData] = useState({
        title: "", description: "", startDate: "", endDate: "", budget: "", status: "ACTIVE", ownerUserId: "",
    });

    useEffect(() => { loadPrograms(); }, []);

    const loadPrograms = async () => {
        try {
            setLoading(true);
            const data = await fetchAllPrograms();
            setPrograms(data || []);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load programs");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleCreateProgram = async (e) => {
        e.preventDefault();
        setError(""); setSuccess("");
        try {
            setLoading(true);
            await createProgram(formData);
            setSuccess("Program created successfully.");
            setFormData({ title: "", description: "", startDate: "", endDate: "", budget: "", status: "ACTIVE", ownerUserId: "" });
            setShowCreateForm(false);
            loadPrograms();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create program");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (programId, newStatus) => {
        try {
            await updateProgramStatus(programId, newStatus);
            setSuccess(`Program status updated to ${newStatus}.`);
            loadPrograms();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update status");
        }
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
                <ActionButton
                    authority="PROGRAM_MANAGER"
                    className="btn btn-success btn-sm"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    title="Only Program Managers can create programs"
                >
                    {showCreateForm ? "Cancel" : "+ New Program"}
                </ActionButton>
            </div>

            {error   && <Alert message={error}   type="danger" />}
            {success && <Alert message={success} type="success" />}

            {/* Create Form - Only visible to PROGRAM_MANAGER */}
            <ContentGate authority="PROGRAM_MANAGER">
                {showCreateForm && (
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-success text-white border-0">
                            <h6 className="mb-0">Create New Program</h6>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleCreateProgram}>
                                <div className="row g-3">
                                    <div className="col-md-8">
                                        <label htmlFor="prog-title" className="form-label small fw-semibold">Program Title</label>
                                        <input id="prog-title" type="text" className="form-control" name="title"
                                            value={formData.title} onChange={handleInputChange}
                                            placeholder="e.g. Rooftop Solar Subsidy 2026" required />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="prog-owner" className="form-label small fw-semibold">Owner User ID</label>
                                        <input id="prog-owner" type="number" className="form-control" name="ownerUserId"
                                            value={formData.ownerUserId} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="prog-desc" className="form-label small fw-semibold">Description</label>
                                        <textarea id="prog-desc" className="form-control" name="description" rows="2"
                                            value={formData.description} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="prog-start" className="form-label small fw-semibold">Start Date</label>
                                        <input id="prog-start" type="date" className="form-control" name="startDate"
                                            value={formData.startDate} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="prog-end" className="form-label small fw-semibold">End Date</label>
                                        <input id="prog-end" type="date" className="form-control" name="endDate"
                                            value={formData.endDate} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="prog-budget" className="form-label small fw-semibold">Budget (INR)</label>
                                        <input id="prog-budget" type="number" className="form-control" name="budget"
                                            value={formData.budget} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="mt-3 d-flex gap-2">
                                    <button type="submit" className="btn btn-success btn-sm" disabled={loading}>
                                        {loading ? "Creating..." : "Create Program"}
                                    </button>
                                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowCreateForm(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </ContentGate>

            {/* Programs Table */}
                <div className="card border-0 shadow-sm">
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
                                            <th className="ps-4 small">Title</th>
                                            <th className="small">Description</th>
                                            <th className="small">Budget</th>
                                            <th className="small">Status</th>
                                            <th className="small text-end pe-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {programs.map((p) => (
                                            <tr key={p.id}>
                                                <td className="ps-4 small fw-semibold">{p.title || p.name}</td>
                                                <td className="small text-muted">{p.description || "—"}</td>
                                                <td className="small">₹{p.budget ? Number(p.budget).toLocaleString() : "—"}</td>
                                                <td>
                                                    <span className={`badge ${p.status === "ACTIVE" ? "bg-success" : p.status === "PAUSED" ? "bg-warning text-dark" : "bg-secondary"}`}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                                <td className="text-end pe-4">
                                                    <ContentGate authority="PROGRAM_MANAGER">
                                                        <select className="form-select form-select-sm" style={{ width: 130 }}
                                                            value={p.status} onChange={(e) => handleStatusChange(p.id, e.target.value)}>
                                                            <option value="ACTIVE">Active</option>
                                                            <option value="PAUSED">Paused</option>
                                                            <option value="CLOSED">Closed</option>
                                                        </select>
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
            </div>
    );
}