import { useState } from "react";
import api from "../../services/apiClient";
import Loader from "../../shared/Loader";
import FormField from "../../shared/FormField";
import {
  REINSURER_ANALYST_LINKS,
  RISK_ALLOCATION_VIEW_COLUMNS,
  SOMETHING_WENT_WRONG,
} from "../../common/constants";
import AppShell from "../../layouts/AppShell";
import DataTable from "../../shared/DataTable";
import { convertToCurrency } from "../../common/utils";

export default function RiskAllocationView() {
  const [policyId, setPolicyId] = useState("");
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!policyId.trim()) return;

    setLoading(true);
    setMessage("");
    setError("");
    setAllocations([]);

    try {
      const { data } = await api.get(`/risk-allocations/${policyId}`);
      if (data.length > 0) {
        setAllocations(data);
        return;
      }
      setMessage(data.message);
    } catch (error) {
      setError(error.response?.data?.error || SOMETHING_WENT_WRONG);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell links={REINSURER_ANALYST_LINKS}>
      <div className="container py-5" style={{ maxWidth: "100vw" }}>
        <div
          className="card shadow-lg border-0 rounded-3 mx-auto"
          style={{ maxWidth: 950 }}
        >
          <div className="card-header bg-dark bg-gradient text-white py-3 rounded-top-3">
            <h5 className="mb-1">Risk Allocation View</h5>
            <small className="text-light opacity-75">
              Enter a Policy ID to view allocation details
            </small>
          </div>

          <div className="card-body p-4">
            <div className="row g-3 align-items-end mt-2">
              <div className="col-md-9">
                <FormField
                  label="Policy ID"
                  type="text"
                  value={policyId}
                  inputStyles="text-uppercase"
                  onChange={(e) => setPolicyId(e.target.value.toUpperCase())}
                />
              </div>

              <div className="col-md-3">
                <button
                  className="btn btn-success w-100"
                  style={{ height: "38px", position: "relative", top: "-1rem" }}
                  onClick={handleCheck}
                  disabled={!policyId || loading}
                >
                  {loading ? "Checking..." : "Check"}
                </button>
              </div>
            </div>

            {loading && (
              <div className="text-center mt-4">
                <Loader />
              </div>
            )}

            {!!message && (
              <div className="alert alert-info text-center mt-4">{message}</div>
            )}

            {!!error && (
              <div className="alert alert-danger text-center mt-4">{error}</div>
            )}

            {!loading && allocations.length > 0 && (
              <div className="mt-4">
                <DataTable
                  columns={RISK_ALLOCATION_VIEW_COLUMNS}
                  data={allocations}
                  renderRow={(allocation) => {
                    const a = allocation.allocations[0];
                    return (
                      <tr key={allocation._id} className="align-middle">
                        <td>{`${a.reinsurerId.name} (${a.reinsurerId.code})`}</td>
                        <td>{a.treatyId.treatyName}</td>
                        <td>{convertToCurrency(a.treatyId.retentionLimit)}</td>
                        <td>{convertToCurrency(a.treatyId.treatyLimit)}</td>
                        <td>{convertToCurrency(a.allocatedAmount)}</td>
                        <td>{a.allocatedPercentage}%</td>
                      </tr>
                    );
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
