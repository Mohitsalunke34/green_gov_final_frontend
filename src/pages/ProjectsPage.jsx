import { useState, useEffect } from "react";
import { fetchAllProjects } from "../api/projectApi";
import Loading from "../components/Loading";
import Alert from "../components/Alert";

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);

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

    if (loading) return <Loading />;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Projects</h2>
                <button 
                    className="btn btn-primary"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    + New Project
                </button>
            </div>

            {error && <Alert message={error} type="danger" />}

            {showCreateForm && (
                <div className="card mb-4">
                    <div className="card-header bg-info text-white">
                        <h5 className="mb-0">Create New Project</h5>
                    </div>
                    <div className="card-body">
                        <p className="text-muted">Project creation form would go here</p>
                    </div>
                </div>
            )}

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
