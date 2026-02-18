import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/apiClient";
import Alert from "../../shared/Alert";
import { useAuth } from "../../hooks/useAuth";

const getRerouteURL = (role) => {
  switch (role) {
    case "ADMIN":
    case "UNDERWRITER":
    case "CLAIMS_ADJUSTER":
    case "REINSURANCE_ANALYST":
      return "/dashboard";
    default:
      return "/error";
  }
};

export default function Login() {
  const navigate = useNavigate();
  const { setLoginCredentials } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setAuthError(false);
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      setLoginCredentials(res.data);
      navigate(getRerouteURL(res.data.user?.role));
    } catch {
      setAuthError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {authError && (
        <Alert
          alertMessage="Invalid email or password."
          onDismiss={() => setAuthError(false)}
        />
      )}

      <div
        className="vh-100 d-flex align-items-center justify-content-center"
        style={{
          background: "linear-gradient(160deg, #f8f9fa, #e9ecef)",
        }}
      >
        <div
          className="bg-white p-5 rounded-4 shadow"
          style={{ width: 380 }}
        >
          <h4 className="fw-semibold mb-1">Sign in</h4>
          <p className="text-muted small mb-4">
            Enter your credentials to continue
          </p>

          <form onSubmit={submit} noValidate>
            {/* Email */}
            <div className="mb-3">
              <label className="form-label small fw-medium">
                Email address
              </label>
              <input
                type="email"
                className="form-control form-control-lg"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="form-label small fw-medium">
                Password
              </label>
              <input
                type="password"
                className="form-control form-control-lg"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100 py-2 fw-semibold"
              disabled={!form.email || !form.password || isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
