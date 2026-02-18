import { Routes, Route } from "react-router-dom";
import Login from "../features/auth/Login";
import AccessDenied from "../shared/AccessDenied";
import UserList from "../features/admin/UserList";
import PolicyList from "../features/policy/PolicyList";
import CreatePolicyWizard from "../features/policy/CreatePolicyWizard";
import ClaimsList from "../features/claims/ClaimsList";
import ReinsurerList from "../features/reinsurer/ReinsurerList";
import TreatyList from "../features/treaty/TreatyList";
import RiskAllocationView from "../features/treaty/RiskAllocationView";
import AnalyticsDashboard from "../features/dashboard/AnalyticsDashboard";
import ProtectedRoute from "./ProtectedRoute";
import InvalidURL from "../shared/InvalidURL";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={[
              "ADMIN",
              "UNDERWRITER",
              "CLAIMS_ADJUSTER",
              "REINSURANCE_ANALYST",
            ]}
          >
            <AnalyticsDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <UserList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/policy"
        element={
          <ProtectedRoute allowedRoles={["UNDERWRITER"]}>
            <PolicyList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/policy/create"
        element={
          <ProtectedRoute allowedRoles={["UNDERWRITER"]}>
            <CreatePolicyWizard mode="create" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/policy/edit/:policyId"
        element={
          <ProtectedRoute allowedRoles={["UNDERWRITER"]}>
            <CreatePolicyWizard mode="edit" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/claim"
        element={
          <ProtectedRoute allowedRoles={["CLAIMS_ADJUSTER"]}>
            <ClaimsList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reinsurer"
        element={
          <ProtectedRoute allowedRoles={["REINSURANCE_ANALYST"]}>
            <ReinsurerList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/treaty"
        element={
          <ProtectedRoute allowedRoles={["REINSURANCE_ANALYST"]}>
            <TreatyList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/risk-view"
        element={
          <ProtectedRoute allowedRoles={["REINSURANCE_ANALYST"]}>
            <RiskAllocationView />
          </ProtectedRoute>
        }
      />

      <Route path="/error" element={<AccessDenied />} />
      <Route path="*" element={<InvalidURL />} />
    </Routes>
  );
}
