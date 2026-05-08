import { useState, useEffect } from "react";
import { fetchAllApplications, applyForProgram, updateApplicationStatus } from "../api/applicationApi";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import { PermissionGate, RequiredPermission } from "../components/PermissionGate";
import { usePermission } from "../hooks/usePermission";

export default function ApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);

    const { isCitizenOrBusiness, isProgramManager } = usePermission();

    const [formData, setFormData] = useState({
        programId: "",
        statement: "",
    });

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateApplication = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            setLoading(true);
            await applyForProgram(formData);
            setSuccess("Application submitted successfully!");
            setFormData({ programId: "", statement: "" });
            setShowCreateForm(false);
            loadApplications();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create application");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (appId, newStatus) => {
        try {
            await updateApplicationStatus(appId, newStatus);
            setSuccess(`Application status updated to ${newStatus}`);
            loadApplications();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update application status");
        }
    };

    if (loading && applications.length === 0) return <Loading />;

    return (
        <RequiredPermission
            roles={["CITIZEN", "BUSINESS_OWNER"]}
            authorities={["PROGRAM_MANAGER"]}
            message="You don't have permission to access the Applications page."
        >
            <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Applications</h2>
                    <PermissionGate roles={["CITIZEN", "BUSINESS_OWNER"]}>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowCreateForm(!showCreateForm)}
                        >
                            + New Application
                        </button>
                    </PermissionGate>
                </div>

                {error && <Alert message={error} type="danger" />}
                {success && <Alert message={success} type="success" />}

                <PermissionGate roles={["CITIZEN", "BUSINESS_OWNER"]}>
                    {showCreateForm && (
                        <div className="card mb-4">
                            <div className="card-header bg-info text-white">
                                <h5 className="mb-0">Create New Application</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleCreateApplication}>
                                    <div className="mb-3">
                                        <label htmlFor="programId" className="form-label">Program</label>
                                        <input
                                            id="programId"
                                            type="number"
                                            className="form-control"
                                            name="programId"
                                            value={formData.programId}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="statement" className="form-label">Application Statement</label>
                                        <textarea
                                            id="statement"
                                            className="form-control"
                                            name="statement"
                                            value={formData.statement}
                                            onChange={handleInputChange}
                                            rows="4"
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-success" disabled={loading}>
                                        {loading ? "Submitting..." : "Submit Application"}
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
        </RequiredPermission>
    );
}
