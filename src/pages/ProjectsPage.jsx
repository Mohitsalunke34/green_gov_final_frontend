import { useState, useEffect } from "react";
import { fetchAllProjects, createProject, updateProjectStatus } from "../api/projectApi";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import { PermissionGate, RequiredPermission } from "../components/PermissionGate";
import { usePermission } from "../hooks/usePermission";

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);

    const { isCitizenOrBusiness, isProgramManager } = usePermission();

    const [formData, setFormData] = useState({
        programId: "",
        name: "",
        description: "",
        budget: "",
    });

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const data = await fetchAllProjects();
            setProjects(data || []);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load projects");
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

    const handleCreateProject = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            setLoading(true);
            await createProject(formData);
            setSuccess("Project created successfully!");
            setFormData({ programId: "", name: "", description: "", budget: "" });
            setShowCreateForm(false);
            loadProjects();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create project");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (projectId, newStatus) => {
        try {
            await updateProjectStatus(projectId, newStatus);
            setSuccess(`Project status updated to ${newStatus}`);
            loadProjects();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update project status");
        }
    };

    if (loading && projects.length === 0) return <Loading />;

    return (
        
            <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Projects</h2>
                    <PermissionGate role="CITIZEN" fallback={<PermissionGate role="BUSINESS_OWNER" />}>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowCreateForm(!showCreateForm)}
                        >
                            + New Project
                        </button>
                    </PermissionGate>
                </div>

                {error && <Alert message={error} type="danger" />}
                {success && <Alert message={success} type="success" />}

                <PermissionGate roles={["CITIZEN", "BUSINESS_OWNER"]}>
                    {showCreateForm && (
                        <div className="card mb-4">
                            <div className="card-header bg-info text-white">
                                <h5 className="mb-0">Create New Project</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleCreateProject}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Project Name</label>
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
                                        {loading ? "Creating..." : "Create Project"}
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
                </PermissionGate>

                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0">Ongoing Projects</h5>
                    </div>
                    <div className="card-body">
                    {projects.length === 0 ? (
                        <p className="text-muted text-center">No projects found</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Project Name</th>
                                        <th>Description</th>
                                        <th>Budget</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map((project) => {
                                        let badgeColor = "secondary";
                                        if (project.status === "APPROVED") badgeColor = "success";
                                        if (project.status === "Pending") badgeColor = "warning";
                                        return (
                                            <tr key={project.id}>
                                                <td>{project.title}</td>
                                                <td>{project.description}</td>
                                                <td>₹{project.budget?.toLocaleString()}</td>
                                                <td>
                                                    <span className={`badge bg-${badgeColor}`}>
                                                        {project.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-info">View</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
