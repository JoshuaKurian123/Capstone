import { useEffect, useState } from "react";
import api from "../../services/apiClient";
import FormField from "../../shared/FormField";
import {
  SOMETHING_WENT_WRONG,
  USER_PERMISSION_OPTIONS,
  USER_ROLE_OPTIONS,
} from "../../common/constants";
import Alert from "../../shared/Alert";

export default function UserForm({ onClose, showModal, userData = null }) {
  const isEdit = !!userData;

  const [alertMessage, setAlertMessage] = useState("");
  const [errors, setErrors] = useState({});

  const emptyForm = {
    username: "",
    email: "",
    password: "",
    role: "",
    status: true,
    permissions: [],
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (userData) {
      setForm({
        username: userData.username || "",
        email: userData.email || "",
        password: "",
        role: userData.role || "",
        status: userData.status === "ACTIVE",
        permissions: userData.permissions || [],
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [userData, showModal]);

  if (!showModal) return null;

  const onChangeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const togglePermission = (value) => {
    const exists = form.permissions.includes(value);
    const updated = exists
      ? form.permissions.filter((p) => p !== value)
      : [...form.permissions, value];

    setForm({ ...form, permissions: updated });
    setErrors({ ...errors, permissions: "" });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = () => {
    const e = {};

    if (!form.username.trim()) e.username = "Username is required.";

    if (!form.email.trim()) e.email = "Email is required.";
    else if (!validateEmail(form.email))
      e.email = "Enter a valid email address.";

    if (!isEdit && !form.password.trim()) e.password = "Password is required.";

    if (!form.role) e.role = "Select a role.";

    if (form.role && !form.permissions.length)
      e.permissions = "Select at least one permission.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmitHandler = async () => {
    setAlertMessage("");
    if (!validate()) return;

    const payload = {
      username: form.username.trim(),
      email: form.email.trim(),
      role: form.role,
      status: form.status ? "ACTIVE" : "INACTIVE",
      permissions: form.permissions,
    };

    if (form.password.trim()) payload.password = form.password;

    try {
      if (isEdit) {
        await api.put(`/users/${userData._id}`, payload);
      } else {
        await api.post("/users/create", payload);
      }
    } catch (error) {
      setAlertMessage(error.response?.data?.error || SOMETHING_WENT_WRONG);
      return;
    }

    onClose(true);
  };

  return (
    <>
      {!!alertMessage && (
        <Alert
          alertMessage={alertMessage}
          onDismiss={() => setAlertMessage("")}
        />
      )}

      <div className="modal-backdrop fade show"></div>

      <div className="modal fade show d-block">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-3">
            <div className="modal-header bg-dark text-white py-3 px-4">
              <h5 className="modal-title">
                {isEdit ? "Update User" : "Create User"}
              </h5>
            </div>

            <div className="modal-body px-5 py-4">
              <div className="row g-4">
                <div className="col-md-6">
                  <FormField
                    label="Username"
                    name="username"
                    value={form.username}
                    onChange={onChangeHandler}
                    required
                    error={errors.username}
                  />
                </div>

                <div className="col-md-6">
                  <FormField
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChangeHandler}
                    required
                    error={errors.email}
                  />
                </div>

                <div className="col-md-6">
                  <FormField
                    label={`Password ${
                      isEdit ? "(Leave blank to keep unchanged)" : ""
                    }`}
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={onChangeHandler}
                    required={!isEdit}
                    error={errors.password}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Role <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-select ${errors.role ? "is-invalid" : ""}`}
                    name="role"
                    value={form.role}
                    onChange={onChangeHandler}
                  >
                    <option value="">Select Role</option>
                    {USER_ROLE_OPTIONS.map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                  </select>
                  <div className="invalid-feedback">{errors.role}</div>
                </div>

                <div className="col-md-6">
                  <label className="form-label d-block">Status</label>
                  <div className="form-check form-switch mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={form.status}
                      onChange={() =>
                        setForm({ ...form, status: !form.status })
                      }
                    />
                    <label className="form-check-label ms-2">
                      {form.status ? "ACTIVE" : "INACTIVE"}
                    </label>
                  </div>
                </div>

                {!!form.role && (
                  <div className="col-md-12">
                    <label className="form-label fw-semibold">
                      Permissions <span className="text-danger">*</span>
                    </label>

                    <div className="row">
                      {USER_PERMISSION_OPTIONS[form.role].map((p) => (
                        <div key={p} className="col-md-3 form-check mb-2">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={form.permissions.includes(p)}
                            onChange={() => togglePermission(p)}
                          />
                          <label className="form-check-label ms-1">{p}</label>
                        </div>
                      ))}
                    </div>

                    {errors.permissions && (
                      <div className="text-danger small mt-1">
                        {errors.permissions}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer px-4 py-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => onClose(false)}
              >
                Cancel
              </button>
              <button className="btn btn-warning" onClick={onSubmitHandler}>
                {isEdit ? "Update User" : "Create User"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
