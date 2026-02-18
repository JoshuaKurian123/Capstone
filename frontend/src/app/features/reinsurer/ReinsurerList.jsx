import { useEffect, useState } from "react";
import api from "../../services/apiClient";
import Loader from "../../shared/Loader";
import ErrorState from "../../shared/ErrorState";
import Badge from "../../shared/Badge";
import ConfirmDialog from "../../shared/ConfirmDialog";
import DataTable from "../../shared/DataTable";
import ReinsurerForm from "./ReinsurerForm";
import Alert from "../../shared/Alert";
import { useAuth } from "../../hooks/useAuth";
import { isAllowed } from "../../common/utils";
import AppShell from "../../layouts/AppShell";
import {
  REINSURER_TABLE_COLUMNS,
  REINSURER_ANALYST_LINKS,
  SOMETHING_WENT_WRONG,
} from "../../common/constants";
import EmptyState from "../../shared/EmptyState";

export default function ReinsurerList() {
  const [reinsurers, setReinsurers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const { loggedInUser } = useAuth();

  const isCreateAllowed = isAllowed(loggedInUser?.user?.permissions, "CREATE");
  const isEditAllowed = isAllowed(loggedInUser?.user?.permissions, "UPDATE");
  const isDeleteAllowed = isAllowed(loggedInUser?.user?.permissions, "DELETE");

  const fetchReinsurers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/reinsurers");
      setReinsurers(res.data);
    } catch (error) {
      setError(error.response?.data?.error || SOMETHING_WENT_WRONG);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReinsurers();
  }, []);

  const onCreate = () => {
    setSelectedItem(null);
    setShowModal(true);
  };

  const onEdit = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const onDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirmModal(true);
  };

  const confirmDelete = async () => {
    setAlertMessage("");
    try {
      await api.delete(`/reinsurers/${itemToDelete._id}`);
      fetchReinsurers();
    } catch (error) {
      setAlertMessage(error.response?.data?.error || SOMETHING_WENT_WRONG);
    } finally {
      setShowDeleteConfirmModal(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setItemToDelete(null);
  };

  const onModalClose = (reload = false) => {
    setShowModal(false);
    setSelectedItem(null);
    if (reload) fetchReinsurers();
  };

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  return (
    <AppShell links={REINSURER_ANALYST_LINKS}>
      <div className="container py-4" style={{ maxWidth: "100vw" }}>
        {!!alertMessage && (
          <Alert
            alertMessage={alertMessage}
            onDismiss={() => setAlertMessage("")}
          />
        )}

        <div className="card shadow-lg border-0 rounded-3 mx-4">
          <div className="card-header bg-dark bg-gradient text-white py-3 px-4 d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">Reinsurers</h5>
              <small className="opacity-75">
                Manage reinsurer profiles and ratings
              </small>
            </div>

            {isCreateAllowed && (
              <button className="btn btn-success" onClick={onCreate}>
                <i className="bi bi-plus-lg me-1"></i>
                Create Reinsurer
              </button>
            )}
          </div>

          <div className="card-body p-4">
            {!reinsurers.length && (
              <EmptyState title="No reinsurers found. Create one to get started." />
            )}

            {reinsurers.length > 0 && (
              <DataTable
                columns={REINSURER_TABLE_COLUMNS}
                data={reinsurers}
                renderRow={(reinsurer) => (
                  <tr key={reinsurer._id} className="align-middle">
                    <td className="fw-medium">{reinsurer.code}</td>
                    <td>{reinsurer.name}</td>
                    <td>{reinsurer.contactEmail}</td>
                    <td>{reinsurer.country}</td>

                    <td>
                      <Badge type="dark" badgeText={reinsurer.rating} />
                    </td>

                    <td>
                      <Badge
                        type={reinsurer.status}
                        badgeText={reinsurer.status}
                      />
                    </td>

                    <td className="text-end">
                      {isEditAllowed && (
                        <button
                          className="btn btn-outline-success btn-sm me-2"
                          onClick={() => onEdit(reinsurer)}
                          title="Edit"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                      )}

                      {isDeleteAllowed && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => onDeleteClick(reinsurer)}
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
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

      <ReinsurerForm
        onClose={onModalClose}
        showModal={showModal}
        reinsurerData={selectedItem}
      />

      <ConfirmDialog
        showModal={showDeleteConfirmModal}
        title="Delete Reinsurer"
        message={`Are you sure you want to delete this reinsurer?`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </AppShell>
  );
}
