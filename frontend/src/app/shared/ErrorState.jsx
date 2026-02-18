export default function ErrorState({
  message = "Something went wrong. Please try again.",
}) {
  return (
    <div className="text-center my-4">
      <div className="alert alert-danger d-inline-flex align-items-center gap-2 shadow-sm px-4 py-3">
        <i className="bi bi-exclamation-circle"></i>
        <span className="fw-medium">{message}</span>
      </div>
    </div>
  );
}
