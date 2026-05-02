import { useId } from "react";

/**
 * @typedef InputWithLabelProps
 * @property {string} value
 * @property {string} [label]
 * @property {boolean} [required]
 * @property {boolean} [readOnly]
 * @property {string} name
 * @property {string} [className]
 * @property {string} [inputClassName]
 * @property {any} [error]
 * @property {string} [type]
 * @property {string} [placeholder]
 * @property {string} [hint]
 * @property {(value: string) => void } onChange
 *
 * @param {InputWithLabelProps} param0
 */
export default function InputWithLabel({
  value,
  onChange,
  label,
  name,
  required,
  className,
  readOnly,
  inputClassName,
  error,
  type = "text",
  placeholder,
  hint,
}) {
  const id = useId();
  return (
    <div className={"form-control w-full " + (className ?? "")}>
      {label && (
        <label className={"label " + (inputClassName ?? "")} htmlFor={id}>
          <span className="label-text">{label}</span>
        </label>
      )}
      <input
        className={"input input-bordered input-primary w-full " + (error ? "input-error" : "")}
        type={type}
        name={name}
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        readOnly={readOnly}
      />
      {hint && <p className="text-sm text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}
