import { useId } from "react";

/**
 * @typedef InputWithLabelProps
 * @property {string} value
 * @property {string} label
 * @property {boolean} [required]
 * @property {boolean} [readOnly]
 * @property {string} name
 * @property {string} [className]
 * @property {string} [inputClassName]
 * @property {any} [error]
 * @property {(value: string) => void } onChange
 *
 *
 * @param {InputWithLabelProps} param0
 * @returns
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
}) {
  const id = useId();
  return (
    <div className={"form-control w-full " + (className ?? "")}>
      <label className={"label " + (inputClassName ?? "")} htmlFor={id}>
        <span className="label-text">{label}</span>
      </label>
      <input
        className={"input input-bordered input-primary w-full " + (error ? "input-error" : "")}
        type="text"
        name={name}
        id={id}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        readOnly={readOnly}
      />
    </div>
  );
}
