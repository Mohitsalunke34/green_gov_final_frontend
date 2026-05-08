import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { usePermission } from "../hooks/usePermission";
import MainLayout from "../components/MainLayout";

export default function DashboardPage() {
    const navigate = useNavigate();
    const { getRoles, getAuthorities } = useAuth();
    const {
        isProgramManager,
        isCitizenOrBusiness,
    } = usePermission();

    // Component card data - role-based visibility
    const componentCards = [
        {
            id: "programs",
            title: "Programs",
            description: "Manage green initiative programs",
            icon: "📋",
            path: "/programs",
            requiredAuthority: "PROGRAM_MANAGER",
            color: "primary",
        },
        {
            id: "projects",
            title: "Projects",
            description: "Create and manage projects",
            icon: "🏗️",
            path: "/projects",
            requiredRoles: ["CITIZEN", "BUSINESS_OWNER"],
            color: "info",
        },
        {
            id: "applications",
            title: "Applications",
            description: "View and manage program applications",
            icon: "📝",
            path: "/applications",
            requiredAny: true, // Visible to CITIZEN/BUSINESS_OWNER or PROGRAM_MANAGER
            color: "warning",
        },
        {
            id: "compliance",
            title: "Compliance",
            description: "Track compliance records and status",
            icon: "✓",
            path: "/compliance",
            requiredAuthority: "COMPLIANCE_OFFICER",
            color: "success",
        },
        {
            id: "audit",
            title: "Audit",
            description: "Manage audit processes and records",
            icon: "🔍",
            path: "/audit",
            requiredAuthority: "AUDIT_MANAGER",
            color: "danger",
        },
        {
            id: "incentives",
            title: "Incentives",
            description: "Manage incentive disbursements",
            icon: "💰",
            path: "/incentives",
            requiredAuthority: "DISBURSEMENT_OFFICER",
            color: "success",
        },
    ];

    // Check if user can access a card
    const canAccessCard = (card) => {
        if (card.requiredAuthority) {
            return getAuthorities().includes(card.requiredAuthority);
        }
        if (card.requiredRoles) {
            const userRoles = getRoles();
            return card.requiredRoles.some((role) => userRoles.includes(role));
        }
        if (card.requiredAny) {
            // Applications visible to CITIZEN/BUSINESS_OWNER or PROGRAM_MANAGER
            return (
                isCitizenOrBusiness() ||
                isProgramManager()
            );
        }
        return true; // Default accessible
    };

    const visibleCards = componentCards.filter(canAccessCard);

    return (
        <MainLayout>
            <div className="dashboard-container">
                <div className="mb-4">
                    <h2 className="fw-bold">Dashboard</h2>
                    <p className="text-muted">Welcome! Access the features available to your role.</p>
                </div>

                {visibleCards.length === 0 ? (
                    <div className="alert alert-info" role="alert">
                        <h5>No Features Available</h5>
                        <p>Your current role does not have access to any features. Please contact your administrator.</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {visibleCards.map((card) => (
                            <div key={card.id} className="col-lg-4 col-md-6">
                                <button
                                    type="button"
                                    className={`card h-100 shadow-sm border-0 w-100 text-start transition`}
                                    onClick={() => navigate(card.path)}
                                    style={{
                                        cursor: "pointer",
                                        transition: "transform 0.2s, box-shadow 0.2s",
                                        background: "white",
                                        padding: 0,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-5px)";
                                        e.currentTarget.style.boxShadow = "0 0.5rem 1rem rgba(0, 0, 0, 0.15)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)";
                                    }}
                                >
                                    <div className={`card-body text-center`}>
                                        <div className="display-5 mb-3">{card.icon}</div>
                                        <h5 className="card-title fw-bold mb-2">{card.title}</h5>
                                        <p className="card-text text-muted small mb-3">
                                            {card.description}
                                        </p>
                                        <span className={`btn btn-sm btn-${card.color}`}>
                                            Open →
                                        </span>
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Stats Section */}
                <div className="row g-4 mt-5 pt-4 border-top">
                    <div className="col-md-3">
                        <div className="text-center">
                            <div className="display-6 text-primary mb-2">👤</div>
                            <h6 className="text-muted">User Role</h6>
                            <p className="fw-bold">
                                {getRoles().join(", ") || "N/A"}
                            </p>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="text-center">
                            <div className="display-6 text-success mb-2">🔑</div>
                            <h6 className="text-muted">Authorities</h6>
                            <p className="fw-bold">
                                {getAuthorities().length > 0
                                    ? getAuthorities().join(", ")
                                    : "None"}
                            </p>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="text-center">
                            <div className="display-6 text-info mb-2">📊</div>
                            <h6 className="text-muted">Available Features</h6>
                            <p className="fw-bold">{visibleCards.length}</p>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="text-center">
                            <div className="display-6 text-warning mb-2">✓</div>
                            <h6 className="text-muted">Status</h6>
                            <p className="fw-bold text-success">Authenticated</p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

