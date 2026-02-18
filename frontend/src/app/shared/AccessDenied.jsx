import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AccessDenied({
  title = "Access Denied",
  message = "You do not have permission to view this page.",
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const backToLogin = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-dark bg-gradient">
      <div
        className="card shadow-lg border-0 rounded-3 text-center p-5"
        style={{ maxWidth: 520, width: "100%" }}
      >
        <h4 className="text-danger fw-semibold mb-2">{title}</h4>

        <p className="text-muted mb-4">{message}</p>

        <button className="btn btn-success px-4 py-2" onClick={backToLogin}>
          Back to Login
        </button>
      </div>
    </div>
  );
}
