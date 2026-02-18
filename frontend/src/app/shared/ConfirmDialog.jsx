export default function ConfirmDialog({
  showModal,
  title,
  message,
  onConfirm,
  onCancel,
}) {
  if (!showModal) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>

      <div className="modal fade show d-block">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-3">
            <div className="modal-header bg-dark bg-gradient text-white py-3 px-4">
              <h5 className="modal-title mb-0">{title}</h5>
            </div>

            <div className="modal-body px-4 py-3">
              <p className="mb-0 text-muted">{message}</p>
            </div>

            <div className="modal-footer px-4 py-3">
              <button className="btn btn-outline-secondary" onClick={onCancel}>
                Cancel
              </button>

              <button className="btn btn-danger" onClick={onConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
