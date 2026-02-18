import { useEffect, useState } from "react";
import api from "../../services/apiClient";
import Loader from "../../shared/Loader";
import ErrorState from "../../shared/ErrorState";
import EmptyState from "../../shared/EmptyState";
import Badge from "../../shared/Badge";
import DataTable from "../../shared/DataTable";
import {
  POLICY_TABLE_COLUMNS,
  SOMETHING_WENT_WRONG,
  UNDERWRITER_LINKS,
} from "../../common/constants";
import { isAllowed, toDDMMMYYYY } from "../../common/utils";
import { useNavigate } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import { useAuth } from "../../hooks/useAuth";
import ConfirmDialog from "../../shared/ConfirmDialog";
import Alert from "../../shared/Alert";
import TimelineModal from "../../shared/TimelineModal";

export default function PolicyList() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [timelineData, setTimelineData] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const navigate = useNavigate();
  const { loggedInUser } = useAuth();

  const isCreateAllowed = isAllowed(loggedInUser?.user?.permissions, "CREATE");
  const isEditAllowed = isAllowed(loggedInUser?.user?.permissions, "UPDATE");
  const isApproveAllowed = isAllowed(
    loggedInUser?.user?.permissions,
    "APPROVE",
  );

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const res = await api.get("/policies");
      setPolicies(res.data || []);
    } catch (error) {
      setError(error.response?.data?.error || SOMETHING_WENT_WRONG);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const onCreate = () => {
    navigate("/policy/create");
  };

  const onEdit = (policyId) => {
    if (!policyId) return;
    navigate(`/policy/edit/${policyId}`);
  };

  const onSubmit = (policy) => {
    if (!policy?._id) return;
    setSelectedItem(policy);
    setShowConfirmModal(true);
  };

  const submitForApproval = async () => {
    if (!selectedItem?._id) return;

    setAlertMessage("");
    try {
      setLoading(true);
      await api.post(`/policies/${selectedItem._id}/approve`);
      fetchPolicies();
    } catch (error) {
      setAlertMessage(error.response?.data?.error || SOMETHING_WENT_WRONG);
    } finally {
      setShowConfirmModal(false);
      setSelectedItem(null);
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  return (
    <AppShell links={UNDERWRITER_LINKS}>
      <div className="container me-4 py-4" style={{ maxWidth: "100vw" }}>
        {!!alertMessage && (
          <Alert
            alertMessage={alertMessage}
            onDismiss={() => setAlertMessage("")}
          />
        )}

        <div className="card shadow-lg border-0 rounded-3 mx-4">
          <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
            <div>
              <h5 className="mb-0 fw-semibold text-dark">Policies</h5>
              <small className="text-muted">
                Create policy details and coverage
              </small>
            </div>

            {isCreateAllowed && (
              <button
                className="btn btn-primary px-3 shadow-sm"
                onClick={onCreate}
              >
                <i className="bi bi-plus-lg me-2"></i>
                Create Policy
              </button>
            )}
          </div>

          <div className="card-body p-4">
            {!policies.length && (
              <EmptyState title="No Existing policies found." />
            )}

            {policies.length > 0 && (
              <DataTable
                columns={POLICY_TABLE_COLUMNS}
                data={policies}
                renderRow={(policy) => (
                  <tr key={policy._id} className="align-middle">
                    <td className="fw-medium">{policy.policyNumber}</td>
                    <td>{policy.insuredName}</td>

                    <td>
                      <Badge type="dark" badgeText={policy.insuredType} />
                    </td>

                    <td>
                      <Badge type="dark" badgeText={policy.lineOfBusiness} />
                    </td>

                    <td>₹{policy.sumInsured}</td>
                    <td>₹{policy.premium}</td>
                    <td>₹{policy.retentionLimit}</td>

                    <td>
                      <Badge type={policy.status} badgeText={policy.status} />
                    </td>

                    <td>{toDDMMMYYYY(policy.effectiveFrom)}</td>
                    <td>{toDDMMMYYYY(policy.effectiveTo)}</td>

                    <td>{policy.createdBy?.username || "-"}</td>
                    <td>{policy.approvedBy?.username || "-"}</td>

                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        {isEditAllowed &&
                          !policy.approvedBy &&
                          policy.status !== "EXPIRED" && (
                            <button
                              className="btn btn-outline-success btn-sm"
                              onClick={() => onEdit(policy._id)}
                              title="Edit"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                          )}

                        {isApproveAllowed &&
                          !policy.approvedBy &&
                          policy.status !== "EXPIRED" && (
                            <button
                              className="btn btn-outline-success btn-sm"
                              onClick={() => onSubmit(policy)}
                              title="Submit for approval"
                            >
                              <i className="bi bi-check-circle"></i>
                            </button>
                          )}

                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => setTimelineData(policy.remarks)}
                          title="View history"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              />
            )}
          </div>
        </div>
      </div>

      <TimelineModal
        show={!!timelineData}
        onClose={() => setTimelineData("")}
        data={timelineData}
      />

      <ConfirmDialog
        showModal={showConfirmModal}
        title="Submit for Approval"
        message="Are you sure you want to submit this policy for approval?"
        onConfirm={submitForApproval}
        onCancel={() => setShowConfirmModal(false)}
      />
    </AppShell>
  );
}
