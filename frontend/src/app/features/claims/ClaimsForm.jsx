import { useEffect, useState } from "react";
import api from "../../services/apiClient";
import FormField from "../../shared/FormField";
import Alert from "../../shared/Alert";
import { toYYYYMMDD } from "../../common/utils";
import { SOMETHING_WENT_WRONG } from "../../common/constants";

export default function ClaimsForm({
  mode,
  onClose,
  showModal,
  claimData = null,
}) {
  const isEdit = !!claimData;
  const today = new Date().toISOString().split("T")[0];

  const [alertMessage, setAlertMessage] = useState("");
  const [errors, setErrors] = useState({});

  const emptyForm = {
    policyId: "",
    claimAmount: "",
    approvedAmount: "",
    incidentDate: "",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (claimData) {
      setForm({
        policyId: claimData.policyId?.policyNumber || "",
        claimAmount: claimData.claimAmount || "",
        approvedAmount: claimData.approvedAmount || "",
        incidentDate: toYYYYMMDD(claimData.incidentDate),
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [claimData, showModal]);

  if (!showModal) return null;

  const onChangeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};

    if (!form.policyId.trim()) e.policyId = "Policy ID is required.";

    if (!form.claimAmount || Number(form.claimAmount) <= 0)
      e.claimAmount = "Claim amount must be greater than 0.";

    if (!form.incidentDate) e.incidentDate = "Incident date is required.";

    if (form.incidentDate && form.incidentDate > today)
      e.incidentDate = "Incident date cannot be in the future.";

    if (mode === "approve") {
      if (!form.approvedAmount || Number(form.approvedAmount) <= 0)
        e.approvedAmount = "Approved amount must be greater than 0.";

      if (Number(form.approvedAmount) > Number(form.claimAmount))
        e.approvedAmount = "Approved amount cannot exceed claim amount.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmitHandler = async () => {
    setAlertMessage("");
    if (!validate()) return;

    const payload = {
      policyId: form.policyId.trim().toUpperCase(),
      claimAmount: Number(form.claimAmount),
      incidentDate: form.incidentDate,
    };

    if (mode === "approve") {
      payload.approvedAmount = Number(form.approvedAmount);
    }

    try {
      if (isEdit) {
        await api.put(`/claims/${claimData._id}`, {
          ...payload,
          status: mode === "approve" ? "APPROVED" : "IN_REVIEW",
        });
      } else {
        await api.post("/claims", payload);
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
                {isEdit
                  ? mode === "approve"
                    ? "Approve Claim"
                    : "Update Claim"
                  : "Create Claim"}
              </h5>
            </div>

            <div className="modal-body px-5 py-4">
              <div className="row g-4">
                <div className="col-12">
                  <FormField
                    label="Policy ID"
                    name="policyId"
                    value={form.policyId}
                    inputStyles="text-uppercase"
                    disabled={mode === "approve"}
                    onChange={onChangeHandler}
                    required
                    error={errors.policyId}
                    // Light gray border class added
                    className="form-control border-light"
                  />
                </div>

                <div className="col-12">
                  <FormField
                    type="number"
                    label="Claim Amount"
                    name="claimAmount"
                    min={0}
                    value={form.claimAmount}
                    disabled={mode === "approve"}
                    onChange={onChangeHandler}
                    required
                    error={errors.claimAmount}
                    // Light gray border class added
                    className="form-control border-light"
                  />
                </div>

                {mode === "approve" && (
                  <div className="col-12">
                    <FormField
                      type="number"
                      label="Approved Amount"
                      name="approvedAmount"
                      min={0}
                      value={form.approvedAmount}
                      onChange={onChangeHandler}
                      required
                      error={errors.approvedAmount}
                      // Light gray border class added
                      className="form-control border-light"
                    />
                  </div>
                )}

                <div className="col-12">
                  <FormField
                    type="date"
                    label="Incident Date"
                    name="incidentDate"
                    max={today}
                    disabled={mode === "approve"}
                    value={form.incidentDate}
                    onChange={onChangeHandler}
                    required
                    error={errors.incidentDate}
                    // Light gray border class added
                    className="form-control border-light"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer px-4 py-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => onClose(false)}
              >
                Cancel
              </button>
              <button className="btn btn-info" onClick={onSubmitHandler}>
                {isEdit
                  ? mode === "approve"
                    ? "Approve Claim"
                    : "Re-submit"
                  : "Submit Claim"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
