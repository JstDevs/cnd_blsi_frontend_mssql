import { ErrorMessage } from 'formik';
import clsx from 'clsx';
import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
function FormField({
  label,
  name,
  type = 'text',
  placeholder = '',
  required = false,
  disabled = false,
  readOnly = false,
  className = '',
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
  const [showPassword, setShowPassword] = useState(false);
  const renderInput = () => {
    switch (type) {
      case 'textarea':
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
              'form-textarea border border-gray-300 px-4 py-2',
              isInvalid &&
                'border-error-300 text-error-900 placeholder-error-300 focus:ring-error-500 focus:border-error-500',
              className
            )}
            {...props}
          />
        );
      case 'multiselect':
        return (
          <select
            id={name}
            name={name}
            disabled={disabled}
            multiple
            value={value || []}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(
                (option) => option.value
              );
              onChange({ target: { name, value: selected } });
            }}
            onBlur={onBlur}
            className={clsx(
              'form-select border border-gray-300 px-4 py-2 h-auto',
              isInvalid &&
                'border-error-300 text-error-900 focus:ring-error-500 focus:border-error-500',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'select':
        return (
          <select
            id={name}
            name={name}
            disabled={disabled}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={clsx(
              'form-select border border-gray-300 px-4 py-2 pr-10',
              isInvalid &&
                'border-error-300 text-error-900 focus:ring-error-500 focus:border-error-500',
              className
            )}
            {...props}
          >
            <option value="">{props.defaultOption || 'Select'}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center h-full">
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
                  'form-checkbox',
                  isInvalid &&
                    'border-error-300 text-error-900 focus:ring-error-500 focus:border-error-500',
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
          </div>
        );

      case 'radio':
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
                    'form-radio ',
                    isInvalid &&
                      'border-error-300 text-error-900 focus:ring-error-500 focus:border-error-500',
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
      case 'password':
        return (
          <div className="relative">
            <input
              id={name}
              name={name}
              type={showPassword ? 'text' : 'password'}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={readOnly}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              className={clsx(
                'form-input border border-gray-300 h-[42px] px-4 py-2 pr-10 w-full',
                isInvalid &&
                  'border-error-300 text-error-900 placeholder-error-300 focus:ring-error-500 focus:border-error-500',
                className
              )}
              {...props}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        );

      case 'date':
      case 'number':
      case 'email':
      case 'text':
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
              'form-input border border-gray-300 h-[42px] px-4 py-2',
              isInvalid &&
                'border-error-300 text-error-900 placeholder-error-300 focus:ring-error-500 focus:border-error-500',
              className
            )}
            {...props}
          />
        );
    }
  };

  // Don't render the additional label for checkbox type since it's handled inline
  return (
    <div className={`form-group ${type === 'checkbox' ? '' : 'space-y-1'}`}>
      {type !== 'checkbox' && (
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
