import { useState, useEffect } from "react";
import { fetchAllIncentives } from "../api/incentiveApi";
import Loading from "../components/Loading";
import Alert from "../components/Alert";

export default function IncentivesPage() {
    const [incentives, setIncentives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadIncentives();
    }, []);

    const loadIncentives = async () => {
        try {
            setLoading(true);
            const data = await fetchAllIncentives();
            setIncentives(data || []);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load incentives");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div>
            <h2 className="mb-4">Incentives</h2>

            {error && <Alert message={error} type="danger" />}

            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">Incentive Disbursements</h5>
                </div>
                <div className="card-body">
                    {incentives.length === 0 ? (
                        <p className="text-muted text-center">No incentives found</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Application ID</th>
                                        <th>Amount</th>
                                        <th>Created Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {incentives.map((incentive) => {
                                        let badgeColor = "secondary";
                                        if (incentive.status === "APPROVED") badgeColor = "success";
                                        if (incentive.status === "PENDING") badgeColor = "warning";
                                        return (
                                            <tr key={incentive.id}>
                                                <td>{incentive.applicationId}</td>
                                                <td>₹{incentive.amount?.toLocaleString()}</td>
                                                <td>{new Date(incentive.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={`badge bg-${badgeColor}`}>
                                                        {incentive.status || "PENDING"}
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
