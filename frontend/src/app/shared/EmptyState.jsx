export default function EmptyState({ title = "No Data Found" }) {
  return (
    <div className="text-center py-5">
      <p className="text-muted fw-semibold mb-0">{title}</p>
    </div>
  );
}
