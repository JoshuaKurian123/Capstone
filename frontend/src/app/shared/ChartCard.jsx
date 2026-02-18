export default function ChartCard({ title, hasData, children }) {
  return (
    <div
      className="card border-0 shadow-sm rounded-3 h-100"
      style={{ minHeight: "20rem" }}
    >
      <div className="card-body d-flex flex-column p-4">
        <h6 className="fw-semibold mb-3">{title}</h6>

        {!hasData ? (
          <div className="text-center text-muted flex-grow-1 d-flex align-items-center justify-content-center">
            No data available
          </div>
        ) : (
          <div className="flex-grow-1 d-flex align-items-center justify-content-center">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
