import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProgramsPage from "./pages/ProgramsPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import ProjectsPage from "./pages/ProjectsPage";
import IncentivesPage from "./pages/IncentivesPage";
import CompliancePage from "./pages/CompliancePage";
import AuditPage from "./pages/AuditPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import PrivateRoute from "./auth/PrivateRoute";

function App() {
  return (
    <Routes>
      {/* Home page - for unauthenticated users */}
      <Route path="/" element={<HomePage />} />

      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes with MainLayout */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/programs"
        element={
          <PrivateRoute>
            <MainLayout>
              <ProgramsPage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/applications"
        element={
          <PrivateRoute>
            <MainLayout>
              <ApplicationsPage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <PrivateRoute>
            <MainLayout>
              <ProjectsPage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/incentives"
        element={
          <PrivateRoute>
            <MainLayout>
              <IncentivesPage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/compliance"
        element={
          <PrivateRoute>
            <MainLayout>
              <CompliancePage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/audit"
        element={
          <PrivateRoute>
            <MainLayout>
              <AuditPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;