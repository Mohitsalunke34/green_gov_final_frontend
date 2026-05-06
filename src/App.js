import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./auth/PrivateRoute";

function App() {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected route */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<h3>Page Not Found</h3>} />
    </Routes>
  );
}

export default App;