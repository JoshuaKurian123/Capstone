import { useEffect, useState } from "react";
import api from "../../services/apiClient";
import Loader from "../../shared/Loader";
import ErrorState from "../../shared/ErrorState";
import Badge from "../../shared/Badge";
import DataTable from "../../shared/DataTable";
import TreatyForm from "./TreatyForm";
import { useAuth } from "../../hooks/useAuth";
import { isAllowed, toDDMMMYYYY, convertToCurrency } from "../../common/utils";
import AppShell from "../../layouts/AppShell";
import {
  TREATY_TABLE_COLUMNS,
  REINSURER_ANALYST_LINKS,
  SOMETHING_WENT_WRONG,
} from "../../common/constants";
import EmptyState from "../../shared/EmptyState";

export default function TreatyList() {
  const [treaties, setTreaties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { loggedInUser } = useAuth();

  const isCreateAllowed = isAllowed(loggedInUser?.user?.permissions, "CREATE");
  const isEditAllowed = isAllowed(loggedInUser?.user?.permissions, "UPDATE");

  const fetchTreaties = async () => {
    try {
      setLoading(true);
      const res = await api.get("/treaties");
      setTreaties(res.data);
    } catch (error) {
      setError(error.response?.data?.error || SOMETHING_WENT_WRONG);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreaties();
  }, []);

  const onCreate = () => {
    setSelectedItem(null);
    setShowModal(true);
  };

  const onEdit = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  return (
    <AppShell links={REINSURER_ANALYST_LINKS}>
      <div className="container py-4" style={{ maxWidth: "100vw" }}>
        <div className="card shadow-lg border-0 rounded-3 mx-4">
          <div className="card-header bg-dark bg-gradient text-white py-3 px-4 d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">Treaties</h5>
              <small className="opacity-75">
                Manage reinsurance treaty configurations
              </small>
            </div>

            {isCreateAllowed && (
              <button className="btn btn-success" onClick={onCreate}>
                <i className="bi bi-plus-lg me-1"></i>
                Create Treaty
              </button>
            )}
          </div>

          <div className="card-body p-4">
            {!treaties.length && (
              <EmptyState title="No treaties found. Create one to get started." />
            )}

            {treaties.length > 0 && (
              <DataTable
                columns={TREATY_TABLE_COLUMNS}
                data={treaties}
                renderRow={(treaty) => (
                  <tr key={treaty._id} className="align-middle">
                    <td className="fw-medium">{treaty.treatyName}</td>
                    <td>{treaty.treatyType}</td>
                    <td>{treaty.reinsurerId.code}</td>
                    <td>{treaty.sharePercentage}%</td>
                    <td>{convertToCurrency(treaty.retentionLimit)}</td>
                    <td>{convertToCurrency(treaty.treatyLimit)}</td>
                    <td>{toDDMMMYYYY(treaty.effectiveFrom)}</td>
                    <td>{toDDMMMYYYY(treaty.effectiveTo)}</td>
                    <td>
                      <Badge type={treaty.status} badgeText={treaty.status} />
                    </td>
                    <td className="text-end">
                      {isEditAllowed && treaty.status !== "EXPIRED" && (
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => onEdit(treaty)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              />
            )}
          </div>
        </div>
      </div>

      <TreatyForm
        onClose={(reload) => {
          setShowModal(false);
          if (reload) fetchTreaties();
        }}
        showModal={showModal}
        treatyData={selectedItem}
      />
    </AppShell>
  );
}
