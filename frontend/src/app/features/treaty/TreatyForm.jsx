import { useEffect, useState } from "react";
import api from "../../services/apiClient";
import FormField from "../../shared/FormField";
import Alert from "../../shared/Alert";
import {
  TREATY_TYPE_OPTIONS,
  LOB_OPTIONS,
  SOMETHING_WENT_WRONG,
} from "../../common/constants";
import { toYYYYMMDD } from "../../common/utils";

export default function TreatyForm({ onClose, showModal, treatyData = null }) {
  const today = new Date().toISOString().split("T")[0];
  const isEdit = !!treatyData;

  const [alertMessage, setAlertMessage] = useState("");
  const [errors, setErrors] = useState({});

  const emptyForm = {
    treatyName: "",
    treatyType: "",
    reinsurerId: "",
    sharePercentage: "",
    retentionLimit: "",
    treatyLimit: "",
    applicableLOBs: [],
    effectiveFrom: "",
    effectiveTo: "",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (treatyData) {
      setForm({
        treatyName: treatyData.treatyName || "",
        treatyType: treatyData.treatyType || "",
        reinsurerId: treatyData.reinsurerId?.code || "",
        sharePercentage: treatyData.sharePercentage || "",
        retentionLimit: treatyData.retentionLimit || "",
        treatyLimit: treatyData.treatyLimit || "",
        applicableLOBs: treatyData.applicableLOBs || [],
        effectiveFrom: toYYYYMMDD(treatyData.effectiveFrom),
        effectiveTo: toYYYYMMDD(treatyData.effectiveTo),
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [treatyData, showModal]);

  if (!showModal) return null;

  const onChangeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const onLobChange = (lob) => {
    const updated = form.applicableLOBs.includes(lob)
      ? form.applicableLOBs.filter((l) => l !== lob)
      : [...form.applicableLOBs, lob];

    setForm({ ...form, applicableLOBs: updated });
    setErrors({ ...errors, applicableLOBs: "" });
  };

  const validate = () => {
    const e = {};

    if (!form.treatyName.trim()) e.treatyName = "Treaty name is required.";
    if (!form.treatyType) e.treatyType = "Select treaty type.";
    if (!form.reinsurerId.trim()) e.reinsurerId = "Reinsurer ID is required.";
    if (!form.sharePercentage) e.sharePercentage = "Share % is required";

    if (!form.retentionLimit || form.retentionLimit <= 0)
      e.retentionLimit = "Retention limit must be > 0.";

    if (!form.treatyLimit || form.treatyLimit <= 0)
      e.treatyLimit = "Treaty limit must be > 0.";

    if (Number(form.treatyLimit) <= Number(form.retentionLimit))
      e.treatyLimit = "Treaty limit must be greater than retention.";

    if (!form.applicableLOBs.length)
      e.applicableLOBs = "Select at least one LOB.";

    if (!form.effectiveFrom) e.effectiveFrom = "Select start date.";
    if (!form.effectiveTo) e.effectiveTo = "Select end date.";

    if (
      form.effectiveFrom &&
      form.effectiveTo &&
      form.effectiveTo < form.effectiveFrom
    )
      e.effectiveTo = "End date must be after start date.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmitHandler = async () => {
    setAlertMessage("");
    if (!validate()) return;

    const payload = { ...form, reinsurerId: form.reinsurerId.toUpperCase() };

    try {
      if (isEdit) {
        await api.put(`/treaties/${treatyData._id}`, payload);
      } else {
        await api.post("/treaties/create", payload);
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
                {isEdit ? "Update Treaty" : "Create Treaty"}
              </h5>
            </div>

            <div className="modal-body px-5 py-4">
              <div className="row g-4">
                <div className="col-md-6">
                  <FormField
                    label="Treaty Name"
                    name="treatyName"
                    value={form.treatyName}
                    onChange={onChangeHandler}
                    required
                    error={errors.treatyName}
                  />
                </div>

                <div className="col-md-6">
                  <FormField
                    label="Treaty Type"
                    name="treatyType"
                    type="select"
                    value={form.treatyType}
                    onChange={onChangeHandler}
                    options={TREATY_TYPE_OPTIONS}
                    required
                    error={errors.treatyType}
                  />
                </div>

                <div className="col-md-4">
                  <FormField
                    label="Reinsurer ID"
                    name="reinsurerId"
                    inputStyles="text-uppercase"
                    value={form.reinsurerId}
                    onChange={onChangeHandler}
                    required
                    error={errors.reinsurerId}
                  />
                </div>

                <div className="col-md-4">
                  <FormField
                    label="Share %"
                    type="number"
                    name="sharePercentage"
                    value={form.sharePercentage}
                    onChange={onChangeHandler}
                    required
                    error={errors.sharePercentage}
                    min={0}
                    max={100}
                  />
                </div>

                <div className="col-md-4">
                  <FormField
                    label="Retention Limit"
                    type="number"
                    name="retentionLimit"
                    min={0}
                    value={form.retentionLimit}
                    onChange={onChangeHandler}
                    required
                    error={errors.retentionLimit}
                  />
                </div>

                <div className="col-md-6">
                  <FormField
                    label="Treaty Limit"
                    type="number"
                    name="treatyLimit"
                    min={0}
                    value={form.treatyLimit}
                    onChange={onChangeHandler}
                    required
                    error={errors.treatyLimit}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label d-block">
                    Applicable LOBs <span className="text-danger">*</span>
                  </label>
                  {LOB_OPTIONS.map((lob) => (
                    <div className="form-check form-check-inline" key={lob}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={form.applicableLOBs.includes(lob)}
                        onChange={() => onLobChange(lob)}
                      />
                      <label className="form-check-label">{lob}</label>
                    </div>
                  ))}
                  {errors.applicableLOBs && (
                    <div className="text-danger small">
                      {errors.applicableLOBs}
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <FormField
                    type="date"
                    label="Effective From"
                    name="effectiveFrom"
                    value={form.effectiveFrom}
                    min={today}
                    onChange={onChangeHandler}
                    required
                    error={errors.effectiveFrom}
                  />
                </div>

                <div className="col-md-6">
                  <FormField
                    type="date"
                    label="Effective To"
                    name="effectiveTo"
                    value={form.effectiveTo}
                    min={form.effectiveFrom || today}
                    onChange={onChangeHandler}
                    required
                    error={errors.effectiveTo}
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
              <button className="btn btn-success" onClick={onSubmitHandler}>
                {isEdit ? "Update Treaty" : "Create Treaty"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
