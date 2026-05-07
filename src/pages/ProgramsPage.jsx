import { useState, useEffect } from "react";
import { fetchAllPrograms } from "../api/programApi";
import Loading from "../components/Loading";
import Alert from "../components/Alert";

export default function ProgramsPage() {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);

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

    if (loading) return <Loading />;

    return (
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

            {showCreateForm && (
                <div className="card mb-4">
                    <div className="card-header bg-info text-white">
                        <h5 className="mb-0">Create New Program</h5>
                    </div>
                    <div className="card-body">
                        <p className="text-muted">Program creation form would go here</p>
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
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {programs.map((program) => (
                                        <tr key={program.id}>
                                            <td>{program.title}</td>
                                            <td>{program.description}</td>
                                            <td>₹{program.budget?.toLocaleString()}</td>
                                            <td>
                                                <span className={`badge bg-${program.status === "ACTIVE" ? "success" : "warning"}`}>
                                                    {program.status}
                                                </span>
                                            </td>
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
