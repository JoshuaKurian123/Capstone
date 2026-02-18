import { useEffect, useState } from "react";
import api from "../../services/apiClient";
import Loader from "../../shared/Loader";
import ErrorState from "../../shared/ErrorState";
import Badge from "../../shared/Badge";
import ConfirmDialog from "../../shared/ConfirmDialog";
import DataTable from "../../shared/DataTable";
import UserForm from "./UserForm";
import {
  ADMIN_LINKS,
  SOMETHING_WENT_WRONG,
  USER_TABLE_COLUMNS,
} from "../../common/constants";
import Alert from "../../shared/Alert";
import { useAuth } from "../../hooks/useAuth";
import { isAllowed } from "../../common/utils";
import AppShell from "../../layouts/AppShell";
import EmptyState from "../../shared/EmptyState";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const { loggedInUser } = useAuth();

  const isCreateAllowed = isAllowed(loggedInUser?.user?.permissions, "CREATE");
  const isEditAllowed = isAllowed(loggedInUser?.user?.permissions, "UPDATE");
  const isDeleteAllowed = isAllowed(loggedInUser?.user?.permissions, "DELETE");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (error) {
      setError(error.response?.data?.error || SOMETHING_WENT_WRONG);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onCreate = () => {
    setSelectedItem(null);
    setShowModal(true);
  };

  const onEdit = (user) => {
    setSelectedItem(user);
    setShowModal(true);
  };

  const onDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete?._id) return;

    setAlertMessage("");
    try {
      await api.delete(`/users/${userToDelete._id}`);
      fetchUsers();
    } catch (error) {
      setAlertMessage(error.response?.data?.error || SOMETHING_WENT_WRONG);
    } finally {
      setShowDeleteConfirmModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setUserToDelete(null);
  };

  const onModalClose = (reload = false) => {
    setShowModal(false);
    setSelectedItem(null);
    if (reload) fetchUsers();
  };

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  return (
    <AppShell links={ADMIN_LINKS}>
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
              <h5 className="mb-0">Users</h5>
              <small className="opacity-75">
                Manage Access and permissions
              </small>
            </div>

            {isCreateAllowed && (
              <button className="btn btn-danger" onClick={onCreate}>
                <i className="bi bi-plus-lg me-1"></i>
                Create User
              </button>
            )}
          </div>

          <div className="card-body p-4">
            {!users.length && (
              <EmptyState title="No users found. Create one to get started." />
            )}

            {users.length > 0 && (
              <DataTable
                columns={USER_TABLE_COLUMNS}
                data={users}
                renderRow={(user) => (
                  <tr key={user._id} className="align-middle">
                    <td className="fw-medium">{user.username}</td>
                    <td>{user.email}</td>

                    <td>
                      <Badge type="dark" badgeText={user.role} />
                    </td>

                    <td>
                      <Badge type={user.status} badgeText={user.status} />
                    </td>

                    <td className="text-end">
                      {!user.isRootUser && (
                        <div className="d-flex justify-content-end gap-2">
                          {isEditAllowed && (
                            <button
                              className="btn btn-outline-success btn-sm"
                              onClick={() => onEdit(user)}
                              title="Edit"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                          )}

                          {isDeleteAllowed && (
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => onDeleteClick(user)}
                              title="Delete"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              />
            )}
          </div>
        </div>
      </div>

      <UserForm
        onClose={onModalClose}
        showModal={showModal}
        userData={selectedItem}
      />

      <ConfirmDialog
        showModal={showDeleteConfirmModal}
        title="Delete User"
        message={`Are you sure you want to delete this user?`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </AppShell>
  );
}
