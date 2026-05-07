import { useState, useEffect } from "react";
import { fetchAllApplications } from "../api/applicationApi";
import Loading from "../components/Loading";
import Alert from "../components/Alert";

export default function ApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const data = await fetchAllApplications();
            setApplications(data || []);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Applications</h2>
                <button 
                    className="btn btn-primary"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    + New Application
                </button>
            </div>

            {error && <Alert message={error} type="danger" />}

            {showCreateForm && (
                <div className="card mb-4">
                    <div className="card-header bg-info text-white">
                        <h5 className="mb-0">Create New Application</h5>
                    </div>
                    <div className="card-body">
                        <p className="text-muted">Application creation form would go here</p>
                    </div>
                </div>
            )}

            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">My Applications</h5>
                </div>
                <div className="card-body">
                    {applications.length === 0 ? (
                        <p className="text-muted text-center">No applications found</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Program</th>
                                        <th>Applied On</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map((application) => {
                                        let badgeColor = "warning";
                                        if (application.status === "APPROVED") badgeColor = "success";
                                        if (application.status === "REJECTED") badgeColor = "danger";
                                        return (
                                            <tr key={application.id}>
                                                <td>{application.programName || "N/A"}</td>
                                                <td>{new Date(application.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={`badge bg-${badgeColor}`}>
                                                        {application.status}
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
