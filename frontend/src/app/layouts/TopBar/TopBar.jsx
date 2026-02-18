import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function TopBar({ links }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      style={{
        height: 64,
        borderBottom: "1px solid #dee2e6",
        backgroundColor: "#ffffff",
      }}
      className="d-flex align-items-center px-4 sticky-top"
    >
      {/* App Title */}
      <div className="fw-semibold fs-5 text-dark me-5">
        Insurance Portal
      </div>

      {/* Navigation */}
      <nav className="d-flex gap-3 flex-grow-1">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.url}
            className={({ isActive }) =>
              `text-decoration-none px-3 py-2 rounded-3 fw-medium ${
                isActive
                  ? "bg-primary text-white"
                  : "text-secondary"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Actions */}
      <button
        onClick={handleLogout}
        className="btn btn-outline-secondary btn-sm"
      >
        Sign out
      </button>
    </header>
  );
}
