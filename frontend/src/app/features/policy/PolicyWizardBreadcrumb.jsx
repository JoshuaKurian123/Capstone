const steps = ["General", "Coverage", "Review"];

const PolicyWizardBreadcrumb = ({ currentStep }) => {
  return (
    <div className="my-3">
      <div className="mx-auto" style={{ maxWidth: 720 }}>
        <div className="d-flex justify-content-between position-relative">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div
                key={step}
                className="text-center flex-fill position-relative"
              >
                {/* CIRCLE */}
                <div
                  className="mx-auto mb-2 d-flex align-items-center justify-content-center rounded-circle fw-semibold position-relative"
                  style={{
                    width: 44,
                    height: 44,
                    zIndex: 2,
                    background: isActive ? "#0d6efd" : "#fff",
                    color: isActive ? "#fff" : "#6c757d",
                    border: isActive
                      ? "none"
                      : isCompleted
                      ? "2px solid #0d6efd"
                      : "2px solid #adb5bd",
                  }}
                >
                  {index + 1}
                </div>

                {/* LABEL */}
                <small
                  className={`fw-semibold ${
                    isActive || isCompleted ? "text-primary" : "text-muted"
                  }`}
                >
                  {step}
                </small>

                {/* CONNECTOR */}
                {index < steps.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 22,
                      left: "58%",
                      width: "84%",
                      height: 4,
                      borderRadius: 10,
                      background: isCompleted ? "#0d6efd" : "#dee2e6",
                      zIndex: 1,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PolicyWizardBreadcrumb;
