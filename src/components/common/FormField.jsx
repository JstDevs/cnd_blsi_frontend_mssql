import { ErrorMessage } from "formik";
import clsx from "clsx";

function FormField({
  label,
  name,
  type = "text",
  placeholder = "",
  required = false,
  disabled = false,
  readOnly = false,
  className = "",
  options = [],
  value,
  onChange,
  onBlur,
  error,
  touched,
  helperText,
  ...props
}) {
  const isInvalid = error && touched;

  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            id={name}
            name={name}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            rows={props.rows || 3}
            className={clsx(
              "form-textarea border border-gray-300 focus:border-primary-500 focus:ring-primary-500",
              isInvalid &&
                "border-error-300 text-error-900 placeholder-error-300 focus:ring-error-500 focus:border-error-500",
              className
            )}
            {...props}
          />
        );

      case "select":
        return (
          <select
            id={name}
            name={name}
            disabled={disabled}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={clsx(
              "form-select border border-gray-300 focus:border-primary-500 focus:ring-primary-500",
              isInvalid &&
                "border-error-300 text-error-900 focus:ring-error-500 focus:border-error-500",
              className
            )}
            {...props}
          >
            <option value="">{props.defaultOption || "Select"}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              id={name}
              name={name}
              type="checkbox"
              disabled={disabled}
              checked={value}
              onChange={onChange}
              onBlur={onBlur}
              className={clsx(
                "form-checkbox",
                isInvalid &&
                  "border-error-300 text-error-900 focus:ring-error-500 focus:border-error-500",
                className
              )}
              {...props}
            />
            <label
              htmlFor={name}
              className="ml-2 block text-sm text-neutral-700"
            >
              {label}
            </label>
          </div>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  id={`${name}-${option.value}`}
                  name={name}
                  type="radio"
                  value={option.value}
                  disabled={disabled}
                  checked={value === option.value}
                  onChange={onChange}
                  onBlur={onBlur}
                  className={clsx(
                    "form-radio",
                    isInvalid &&
                      "border-error-300 text-error-900 focus:ring-error-500 focus:border-error-500",
                    className
                  )}
                  {...props}
                />
                <label
                  htmlFor={`${name}-${option.value}`}
                  className="ml-2 block text-sm text-neutral-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case "date":
      case "number":
      case "email":
      case "password":
      case "text":
      default:
        return (
          <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={clsx(
              "form-input border border-gray-300 focus:border-primary-500 focus:ring-primary-500",
              isInvalid &&
                "border-error-300 text-error-900 placeholder-error-300 focus:ring-error-500 focus:border-error-500",
              className
            )}
            {...props}
          />
        );
    }
  };

  // Don't render the additional label for checkbox type since it's handled inline
  return (
    <div className={`form-group ${type === "checkbox" ? "" : "space-y-1"}`}>
      {type !== "checkbox" && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-error-500">*</span>}
        </label>
      )}

      {renderInput()}

      {isInvalid ? (
        <div className="mt-1 text-error-600 text-sm">{error}</div>
      ) : helperText ? (
        <div className="mt-1 text-neutral-500 text-xs">{helperText}</div>
      ) : null}
    </div>
  );
}

export default FormField;
