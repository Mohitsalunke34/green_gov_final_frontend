import { useState, useEffect } from "react";
import { fetchAllPrograms, createProgram, updateProgramStatus } from "../api/programApi";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import { PermissionGate, RequiredPermission } from "../components/PermissionGate";
import { usePermission } from "../hooks/usePermission";

export default function ProgramsPage() {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);

    const { isProgramManager } = usePermission();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        budget: "",
        status: "ACTIVE",
    });

    useEffect(() => {
        loadPrograms();
    }, []);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateProgram = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            setLoading(true);
            await createProgram(formData);
            setSuccess("Program created successfully!");
            setFormData({ name: "", description: "", budget: "", status: "ACTIVE" });
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
            setSuccess(`Program status updated to ${newStatus}`);
            loadPrograms();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update program status");
        }
    };

    if (loading && programs.length === 0) return <Loading />;

    return (
        <RequiredPermission
            authority="PROGRAM_MANAGER"
            message="Only Program Managers can view programs. Contact your administrator if you need access."
        >
            <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Programs</h2>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowCreateForm(!showCreateForm)}
                    >
                        + New Program
                    </button>
                </div>

                {error && <Alert message={error} type="danger" />}
                {success && <Alert message={success} type="success" />}

                {showCreateForm && (
                    <div className="card mb-4">
                        <div className="card-header bg-info text-white">
                            <h5 className="mb-0">Create New Program</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleCreateProgram}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Program Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        id="description"
                                        className="form-control"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="budget" className="form-label">Budget</label>
                                    <input
                                        id="budget"
                                        type="number"
                                        className="form-control"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <button type="submit" className="btn btn-success" disabled={loading}>
                                    {loading ? "Creating..." : "Create Program"}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary ms-2"
                                    onClick={() => setShowCreateForm(false)}
                                >
                                    Cancel
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0">Active Programs</h5>
                    </div>
                    <div className="card-body">
                        {programs.length === 0 ? (
                            <p className="text-muted text-center">No programs found</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Program Name</th>
                                            <th>Description</th>
                                            <th>Budget</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {programs.map((program) => (
                                            <tr key={program.id}>
                                                <td>{program.name}</td>
                                                <td>{program.description || "N/A"}</td>
                                                <td>${program.budget ? program.budget.toLocaleString() : "0"}</td>
                                                <td>
                                                    <span className={`badge bg-${program.status === "ACTIVE" ? "success" : "warning"}`}>
                                                        {program.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <PermissionGate authority="PROGRAM_MANAGER">
                                                        <select
                                                            className="form-select form-select-sm"
                                                            value={program.status}
                                                            onChange={(e) => handleStatusChange(program.id, e.target.value)}
                                                        >
                                                            <option value="ACTIVE">Active</option>
                                                            <option value="PAUSED">Paused</option>
                                                            <option value="CLOSED">Closed</option>
                                                        </select>
                                                    </PermissionGate>
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
        </RequiredPermission>
    );
}
              