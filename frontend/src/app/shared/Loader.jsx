export default function Loader({
  loaderStyle = "spinner-grow text-success",
  label = "Loading...",
}) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-3">
      <div className={loaderStyle} role="status" aria-hidden="true"></div>
      <small className="text-muted mt-2">{label}</small>
    </div>
  );
}
