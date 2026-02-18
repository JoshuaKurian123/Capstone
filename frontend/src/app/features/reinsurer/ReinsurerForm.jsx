import { useEffect, useState } from "react";
import api from "../../services/apiClient";
import FormField from "../../shared/FormField";
import Alert from "../../shared/Alert";
import {
  REINSURER_RATING_OPTIONS,
  SOMETHING_WENT_WRONG,
} from "../../common/constants";

export default function ReinsurerForm({
  onClose,
  showModal,
  reinsurerData = null,
}) {
  const isEdit = !!reinsurerData;

  const [alertMessage, setAlertMessage] = useState("");
  const [errors, setErrors] = useState({});

  const emptyForm = {
    name: "",
    country: "",
    rating: "",
    contactEmail: "",
    status: true,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (reinsurerData) {
      setForm({
        name: reinsurerData.name || "",
        country: reinsurerData.country || "",
        rating: reinsurerData.rating || "",
        contactEmail: reinsurerData.contactEmail || "",
        status: reinsurerData.status === "ACTIVE",
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [reinsurerData, showModal]);

  if (!showModal) return null;

  const onChangeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = () => {
    const e = {};

    if (!form.name.trim()) {
      e.name = "Name is required.";
    } else if (form.name.trim().length < 2) {
      e.name = "Name must be at least 2 characters.";
    }

    if (!form.country.trim()) {
      e.country = "Country is required.";
    }

    if (!form.rating) {
      e.rating = "Select a rating.";
    }

    if (!form.contactEmail.trim()) {
      e.contactEmail = "Email is required.";
    } else if (!validateEmail(form.contactEmail)) {
      e.contactEmail = "Enter a valid email address.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmitHandler = async () => {
    setAlertMessage("");
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      country: form.country.trim(),
      rating: form.rating,
      contactEmail: form.contactEmail.trim(),
      status: form.status ? "ACTIVE" : "INACTIVE",
    };

    try {
      if (isEdit) {
        await api.put(`/reinsurers/${reinsurerData._id}`, payload);
      } else {
        await api.post("/reinsurers/create", payload);
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
            {/* HEADER */}
            <div className="modal-header bg-dark text-white py-3 px-4">
              <h5 className="modal-title">
                {isEdit ? "Update Reinsurer" : "Create Reinsurer"}
              </h5>
            </div>

            {/* BODY */}
            <div className="modal-body px-5 py-4">
              <div className="row g-4">
                <div className="col-md-6">
                  <FormField
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={onChangeHandler}
                    required
                    error={errors.name}
                  />
                </div>

                <div className="col-md-6">
                  <FormField
                    label="Country"
                    name="country"
                    value={form.country}
                    onChange={onChangeHandler}
                    required
                    error={errors.country}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Rating <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-select ${errors.rating ? "is-invalid" : ""}`}
                    name="rating"
                    value={form.rating}
                    onChange={onChangeHandler}
                  >
                    <option value="">Select Rating</option>
                    {REINSURER_RATING_OPTIONS.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                  <div className="invalid-feedback">{errors.rating}</div>
                </div>

                <div className="col-md-6">
                  <FormField
                    label="Contact Email"
                    type="email"
                    name="contactEmail"
                    value={form.contactEmail}
                    onChange={onChangeHandler}
                    required
                    error={errors.contactEmail}
                  />
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
              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer px-4 py-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => onClose(false)}
              >
                Cancel
              </button>
              <button className="btn btn-success" onClick={onSubmitHandler}>
                {isEdit ? "Update Reinsurer" : "Create Reinsurer"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
