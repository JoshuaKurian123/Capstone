import { useState } from "react";
import FormField from "../../shared/FormField";

const PolicyStepCoverage = ({ data, onNext, onBack, onChange, onCancel }) => {
  const today = new Date().toISOString().split("T")[0];
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};

    if (!data.sumInsured || Number(data.sumInsured) <= 1)
      e.sumInsured = "Sum insured must be greater than 1.";

    if (!data.premium || Number(data.premium) <= 1)
      e.premium = "Premium must be greater than 1.";

    if (!data.retentionLimit || Number(data.retentionLimit) <= 1)
      e.retentionLimit = "Retention limit must be greater than 1.";

    if (!data.effectiveFrom) e.effectiveFrom = "Select effective from date.";
    if (!data.effectiveTo) e.effectiveTo = "Select effective to date.";

    if (
      data.effectiveFrom &&
      data.effectiveTo &&
      data.effectiveTo < data.effectiveFrom
    )
      e.effectiveTo = "Effective to must be after effective from.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div>
      <h5 className="mb-4">Coverage Details</h5>

      <div className="row g-4">
        <div className="col-12">
          <FormField
            type="number"
            label="Sum Insured"
            name="sumInsured"
            value={data.sumInsured || ""}
            min={0}
            onChange={(e) => onChange({ sumInsured: e.target.value })}
            required
            error={errors.sumInsured}
            // Light gray border class added
            className="form-control border-light"
          />
        </div>

        <div className="col-12">
          <FormField
            type="number"
            label="Premium"
            name="premium"
            value={data.premium || ""}
            min={0}
            onChange={(e) => onChange({ premium: e.target.value })}
            required
            error={errors.premium}
            // Light gray border class added
            className="form-control border-light"
          />
        </div>

        <div className="col-12">
          <FormField
            type="number"
            label="Retention Limit"
            name="retentionLimit"
            value={data.retentionLimit || ""}
            min={0}
            onChange={(e) => onChange({ retentionLimit: e.target.value })}
            required
            error={errors.retentionLimit}
            // Light gray border class added
            className="form-control border-light"
          />
        </div>

        <div className="col-12">
          <FormField
            type="date"
            label="Effective From"
            name="effectiveFrom"
            value={data.effectiveFrom || ""}
            min={today}
            onChange={(e) =>
              onChange({
                effectiveFrom: e.target.value,
                effectiveTo: "",
              })
            }
            required
            error={errors.effectiveFrom}
            // Light gray border class added
            className="form-control border-light"
          />
        </div>

        <div className="col-12">
          <FormField
            type="date"
            label="Effective To"
            name="effectiveTo"
            value={data.effectiveTo || ""}
            min={data.effectiveFrom || today}
            onChange={(e) => onChange({ effectiveTo: e.target.value })}
            required
            error={errors.effectiveTo}
            // Light gray border class added
            className="form-control border-light"
          />
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={onCancel}>
            Cancel
          </button>
        </div>

        <div>
          <button className="btn btn-outline-secondary me-2" onClick={onBack}>
            Back
          </button>

          <button className="btn btn-dark" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyStepCoverage;
