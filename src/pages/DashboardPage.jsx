import PageContainer from "../components/layout/PageContainer";
import { useAuth } from "../auth/AuthContext";

export default function DashboardPage() {
    const { logout } = useAuth();

    return (
        <PageContainer title="Dashboard">
            <p className="mb-3">
                You are successfully logged in.
            </p>

            <button className="btn btn-danger" onClick={logout}>
                Logout
            </button>
        </PageContainer>
    );
}

