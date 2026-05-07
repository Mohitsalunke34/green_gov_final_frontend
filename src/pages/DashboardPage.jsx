import { useState, useEffect } from "react";
import { fetchAllPrograms } from "../api/programApi";
import { fetchAllApplications } from "../api/applicationApi";
import { fetchAllProjects } from "../api/projectApi";
import { fetchAllIncentives } from "../api/incentiveApi";
import Loading from "../components/Loading";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        programs: 0,
        applications: 0,
        projects: 0,
        incentives: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        try {
            setLoading(true);
            const [programsData, applicationsData, projectsData, incentivesData] = await Promise.all([
                fetchAllPrograms(),
                fetchAllApplications(),
                fetchAllProjects(),
                fetchAllIncentives(),
            ]);

            const totalIncentives = incentivesData?.reduce((sum, inc) => sum + (inc.amount || 0), 0) || 0;

            setStats({
                programs: programsData?.length || 0,
                applications: applicationsData?.length || 0,
                projects: projectsData?.length || 0,
                incentives: totalIncentives,
            });
        } catch (err) {
            console.error("Failed to load dashboard stats:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div>
            <h2 className="mb-4">Dashboard</h2>

            <div className="row mb-4">
                <div className="col-md-3 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">📊 Programs</h5>
                            <p className="card-text">Active Programs</p>
                            <p className="display-6">{stats.programs}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">📝 Applications</h5>
                            <p className="card-text">Total Applications</p>
                            <p className="display-6">{stats.applications}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">🏗️ Projects</h5>
                            <p className="card-text">Ongoing Projects</p>
                            <p className="display-6">{stats.projects}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">💰 Disbursed</h5>
                            <p className="card-text">Total Incentives</p>
                            <p className="display-6">₹{(stats.incentives / 100000).toFixed(2)}L</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Recent Activities</h5>
                </div>
                <div className="card-body">
                    <p className="text-muted">Dashboard summary - Monitor all modules in real-time</p>
                </div>
            </div>
        </div>
    );
}

