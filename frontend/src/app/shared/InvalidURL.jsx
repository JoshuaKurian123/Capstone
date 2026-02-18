import { useNavigate } from "react-router-dom";

export default function InvalidURL() {
  const navigate = useNavigate();

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-dark bg-gradient">
      <div
        className="card shadow-lg border-0 rounded-3 text-center p-5"
        style={{ maxWidth: 520, width: "100%" }}
      >
        <h4 className="fw-semibold mb-2">Invalid URL</h4>

        <p className="text-muted mb-4">
          The page you are looking for does not exist or the link is broken.
        </p>

        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>

          <button
            className="btn btn-success"
            onClick={() => navigate("/dashboard")}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
