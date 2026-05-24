import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Navbar from "../components/Navbar";


const FEATURES = [
    {
        title: "Program Management",
        desc: "Create and administer green initiative programs with full lifecycle management.",
    },
    {
        title: "Compliance Tracking",
        desc: "Monitor compliance records, audit results, and regulatory adherence in real time.",
    },
    {
        title: "Incentive Disbursement",
        desc: "Process and track financial incentives for verified environmental participants.",
    },
    {
        title: "Project Oversight",
        desc: "Oversee sustainability projects from application to completion.",
    },
    {
        title: "Reports & Analytics",
        desc: "Generate structured reports and view system-wide environmental metrics.",
    },
    {
        title: "Resource & Infrastructure",
        desc: "Allocate physical resources and manage green infrastructure assets.",
    },
];

export default function HomePage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) navigate("/dashboard");
    }, [isAuthenticated, navigate]);

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Navbar />

            {/* Hero */}
            <div className="bg-success text-white py-5">
                <div className="container py-4">
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-8">
                            <p className="text-white-50 text-uppercase small fw-semibold mb-2 ls-wider">
                                Ministry of Environment — Government of India
                            </p>
                            <h1 className="display-5 fw-bold mb-3">GreenGov Platform</h1>
                            <p className="lead text-white-75 mb-4" style={{ opacity: 0.85 }}>
                                A unified portal for managing green initiatives, compliance tracking, and environmental program oversight across India.
                            </p>
                            <div className="d-flex gap-3 justify-content-center">
                                <Link to="/login" className="btn btn-light btn-lg text-success fw-semibold px-4">
                                    Sign In
                                </Link>
                                <Link to="/register" className="btn btn-outline-light btn-lg px-4">
                                    Create Account
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="container py-5">
                <div className="row justify-content-center mb-4">
                    <div className="col-lg-7 text-center">
                        <h2 className="fw-bold text-success mb-2">Platform Capabilities</h2>
                        <p className="text-muted">
                            Role-based access to comprehensive green governance tools.
                        </p>
                    </div>
                </div>
                <div className="row g-4">
                    {FEATURES.map((f) => (
                        <div key={f.title} className="col-md-4">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body p-4">
                                    <div className="bg-success bg-opacity-10 rounded-2 d-inline-block p-2 mb-3">
                                        <div className="text-success fw-bold" style={{ width: 20, height: 20 }}></div>
                                    </div>
                                    <h6 className="fw-bold mb-2">{f.title}</h6>
                                    <p className="text-muted small mb-0">{f.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Role Notice */}
            <div className="bg-success bg-opacity-10 py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-9">
                            <div className="card border-success border-opacity-25 border shadow-sm">
                                <div className="card-body p-4">
                                    <h5 className="fw-bold text-success mb-3">Role-Based Access</h5>
                                    <div className="row g-3">
                                        {[
                                            ["Citizens & Business Owners", "Apply for programs, manage projects and track application status."],
                                            ["Program Managers", "Create programs, review applications, manage the full program lifecycle."],
                                            ["Compliance Officers", "Create and manage compliance records for projects and applications."],
                                            ["Audit Managers", "Initiate and close audit reviews based on compliance records."],
                                            ["Disbursement Officers", "Process incentives and track financial disbursements."],
                                            ["Administrators", "Approve officer registrations and manage system access."],
                                        ].map(([role, desc]) => (
                                            <div key={role} className="col-md-6">
                                                <p className="fw-semibold small mb-0 text-success">{role}</p>
                                                <p className="small text-muted mb-0">{desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

           
        </div>
    );
}
