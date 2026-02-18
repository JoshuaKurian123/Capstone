import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/apiClient";
import PolicyStepGeneral from "./PolicyStepGeneral";
import PolicyStepCoverage from "./PolicyStepCoverage";
import PolicyStepReview from "./PolicyStepReview";
import AppShell from "../../layouts/AppShell";
import PolicyWizardBreadcrumb from "./PolicyWizardBreadcrumb";
import Loader from "../../shared/Loader";
import { toYYYYMMDD } from "../../common/utils";
import { UNDERWRITER_LINKS } from "../../common/constants";

const CreatePolicyWizard = ({ mode }) => {
  const { policyId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const onNext = () => setStep((s) => s + 1);
  const onBack = () => setStep((s) => s - 1);
  const onCancel = () => navigate("/policy");

  const updateData = (values) => {
    setFormData((prev) => ({ ...prev, ...values }));
  };

  const fetchPolicyDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/policies/${policyId}`);
      setFormData({
        ...res.data,
        effectiveFrom: toYYYYMMDD(res.data.effectiveFrom),
        effectiveTo: toYYYYMMDD(res.data.effectiveTo),
      });
    } finally {
      setLoading(false);
    }
  }, [policyId]);

  useEffect(() => {
    if (mode === "edit" && policyId) {
      fetchPolicyDetails();
    }
  }, [mode, policyId, fetchPolicyDetails]);

  return (
    <AppShell links={UNDERWRITER_LINKS}>
      <div className="container py-4">
        {loading ? (
          <Loader />
        ) : (
          <div className="card shadow-lg border-0 rounded-5">
            <div className="card-header bg-dark bg-gradient text-white py-3 px-4">
              <div className="d-flex flex-column">
                <h5 className="mb-1">
                  {mode === "edit" ? "Edit Policy" : "Create Policy"}
                </h5>
                <small className="opacity-75">
                  Configure policy details and coverage
                </small>
              </div>
            </div>

            <div className="card-body p-4">
              <div className="mb-4">
                <PolicyWizardBreadcrumb currentStep={step} />
              </div>

              {step === 0 && (
                <PolicyStepGeneral
                  data={formData}
                  onNext={onNext}
                  onChange={updateData}
                  onCancel={onCancel}
                />
              )}

              {step === 1 && (
                <PolicyStepCoverage
                  data={formData}
                  onNext={onNext}
                  onBack={onBack}
                  onChange={updateData}
                  onCancel={onCancel}
                />
              )}

              {step === 2 && (
                <PolicyStepReview
                  data={formData}
                  onBack={onBack}
                  mode={mode}
                  policyId={policyId}
                  onCancel={onCancel}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default CreatePolicyWizard;
