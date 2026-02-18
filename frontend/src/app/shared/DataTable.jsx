export default function DataTable({ columns, data, renderRow }) {
  return (
    <div
      className="table-responsive"
      style={{ maxHeight: "60vh", overflowY: "auto" }}
    >
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr height="60">
            {columns.map((col) => {
              const isActions = col.key === "actions";

              return (
                <th
                  key={col.key}
                  className={`bg-dark bg-gradient text-white ${
                    isActions ? "text-end pe-4" : ""
                  } sticky-header`}
                  style={isActions ? { width: "160px" } : {}}
                >
                  {col.label}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>{data.map((item) => renderRow(item))}</tbody>
      </table>
    </div>
  );
}
