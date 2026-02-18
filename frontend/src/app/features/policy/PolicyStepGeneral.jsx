import { useState } from "react";
import {
  POLICY_INSURED_TYPE_OPTIONS,
  LOB_OPTIONS,
} from "../../common/constants";
import FormField from "../../shared/FormField";

const PolicyStepGeneral = ({ data, onNext, onChange, onCancel }) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};

    if (!data.insuredName?.trim()) e.insuredName = "Insured name is required.";

    if (!data.insuredType) e.insuredType = "Select insured type.";

    if (!data.lineOfBusiness) e.lineOfBusiness = "Select line of business.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div>
      <h5 className="mb-4">General Details</h5>

      <div className="row g-4">
        <div className="col-12">
          <FormField
            label="Insured Name"
            name="insuredName"
            value={data.insuredName || ""}
            placeholder="Enter insured name"
            onChange={(e) => onChange({ insuredName: e.target.value })}
            required
            error={errors.insuredName}
            // Add light gray border class here
            className="form-control border-light"
          />
        </div>

        <div className="col-12">
          <label className="form-label">Insured Type *</label>
          <select
            className={`form-select ${errors.insuredType ? "is-invalid" : ""} border-light`}
            value={data.insuredType || ""}
            onChange={(e) => onChange({ insuredType: e.target.value })}
          >
            <option value="">Select Type</option>
            {POLICY_INSURED_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.insuredType && (
            <div className="invalid-feedback d-block">{errors.insuredType}</div>
          )}
        </div>

        <div className="col-12">
          <label className="form-label">Line of Business *</label>
          <select
            className={`form-select ${errors.lineOfBusiness ? "is-invalid" : ""} border-light`}
            value={data.lineOfBusiness || ""}
            onChange={(e) => onChange({ lineOfBusiness: e.target.value })}
          >
            <option value="">Select Line of Business</option>
            {LOB_OPTIONS.map((lob) => (
              <option key={lob} value={lob}>
                {lob}
              </option>
            ))}
          </select>
          {errors.lineOfBusiness && (
            <div className="invalid-feedback d-block">
              {errors.lineOfBusiness}
            </div>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-outline-secondary" onClick={onCancel}>
          Cancel
        </button>

        <button className="btn btn-dark" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PolicyStepGeneral;
