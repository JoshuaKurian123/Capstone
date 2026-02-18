import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../services/apiClient";
import Alert from "../../shared/Alert";
import { convertToCurrency, toDDMMMYYYY } from "../../common/utils";
import { SOMETHING_WENT_WRONG } from "../../common/constants";

const Row = ({ label, value }) => (
  <div className="row mb-2">
    <div className="col-md-5 text-muted fw-semibold">{label}</div>
    <div className="col-md-7">{value || "-"}</div>
  </div>
);

const PolicyStepReview = ({ data, onBack, onCancel, mode, policyId }) => {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    setAlertMessage("");
    try {
      setSaving(true);

      if (mode === "edit") {
        await api.put(`/policies/${policyId}`, data);
      } else {
        await api.post("/policies/", data);
      }

      navigate("/policy");
    } catch (error) {
      setAlertMessage(error.response?.data?.error || SOMETHING_WENT_WRONG);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {!!alertMessage && (
        <Alert
          alertMessage={alertMessage}
          onDismiss={() => setAlertMessage("")}
        />
      )}

      <h5 className="mb-4">Review Policy</h5>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body px-4 py-3">
          <Row label="Line of Business" value={data.lineOfBusiness} />
          <Row label="Insured Type" value={data.insuredType} />
          <Row label="Insured Name" value={data.insuredName} />
          <Row label="Sum Insured" value={convertToCurrency(data.sumInsured)} />
          <Row label="Premium" value={convertToCurrency(data.premium)} />
          <Row
            label="Retention Limit"
            value={convertToCurrency(data.retentionLimit)}
          />
          <Row label="Effective From" value={toDDMMMYYYY(data.effectiveFrom)} />
          <Row label="Effective To" value={toDDMMMYYYY(data.effectiveTo)} />
        </div>
      </div>

      <div className="d-flex justify-content-between">
        <button className="btn btn-outline-secondary" onClick={onCancel}>
          Cancel
        </button>

        <div>
          <button className="btn btn-outline-secondary me-2" onClick={onBack}>
            Back
          </button>

          <button
            className="btn btn-dark"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Policy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyStepReview;
