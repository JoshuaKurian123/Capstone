import { useEffect, useState } from "react";
import api from "../../services/apiClient";
import Loader from "../../shared/Loader";
import AppShell from "../../layouts/AppShell";
import {
  ADMIN_LINKS,
  CLAIMS_ADJUSTER_LINKS,
  REINSURER_ANALYST_LINKS,
  UNDERWRITER_LINKS,
} from "../../common/constants";
import ChartCard from "../../shared/ChartCard";
import MonthlyClaimsLine from "../../features/dashboard/charts/MonthlyClaimsLine";
import HighClaimBarChart from "../../features/dashboard/charts/HighClaimBarChart";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";  // Import the custom CSS file

const getLinks = (role) => {
  switch (role) {
    case "ADMIN":
      return ADMIN_LINKS;
    case "UNDERWRITER":
      return UNDERWRITER_LINKS;
    case "CLAIMS_ADJUSTER":
      return CLAIMS_ADJUSTER_LINKS;
    case "REINSURANCE_ANALYST":
      return REINSURER_ANALYST_LINKS;
    default:
      return [];
  }
};

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [claimsTrend, setClaimsTrend] = useState([]);
  const [highClaims, setHighClaims] = useState([]);

  const { loggedInUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [trendRes, highRes] = await Promise.all([
          api.get("/analytics/monthly-claims"),
          api.get("/analytics/high-claim-policies"),
        ]);

        setClaimsTrend(trendRes.data);
        setHighClaims(highRes.data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <Loader />;

  const links = getLinks(loggedInUser?.user?.role);
  if (!links.length) {
    navigate("/login");
    return null;
  }

  return (
    <AppShell links={links}>
      <div className="container-fluid py-4 dashboard-bg">
        <div className="mb-4">
          <h3 className="fw-semibold mb-1">Analytics Overview</h3>
          <p className="text-muted mb-0">
            Claims 
          </p>
        </div>
      </div>
    </AppShell>
  );
}
