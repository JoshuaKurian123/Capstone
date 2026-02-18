export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  inputStyles = "",
  required = false,
  error = "",
  helpText = "",
  options = [],
  ...rest
}) {
  const isSelect = type === "select";

  return (
    <div className="mb-3">
      {label && (
        <label className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      {isSelect ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`form-select ${inputStyles} ${error ? "is-invalid" : ""}`}
          {...rest}
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`form-control ${inputStyles} ${error ? "is-invalid" : ""}`}
          {...rest}
        />
      )}

      {error && <div className="invalid-feedback">{error}</div>}

      {!error && helpText && <small className="text-muted">{helpText}</small>}
    </div>
  );
}
