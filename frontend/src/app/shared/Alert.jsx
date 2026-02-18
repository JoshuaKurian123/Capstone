export default function Alert({ type = "danger", alertMessage, onDismiss }) {
  return (
    <div
      className={`alert alert-${type} alert-dismissible fixed-top fade show p-4 inline`}
      style={{ zIndex: 1100 }}
    >
      {alertMessage}
      <button
        type="button"
        className="btn-close mt-2 me-2"
        onClick={onDismiss}
      ></button>
    </div>
  );
}
