import { useId } from "react";

/**
 * @typedef InputWithLabelProps
 * @property {string} value
 * @property {string} label
 * @property {boolean} [required]
 * @property {boolean} [readOnly]
 * @property {string} name
 * @property {string} type
 * @property {string} [className]
 * @property {string} [inputClassName]
 * @property {import("react").HtmlHTMLAttributes<HTMLInputElement>['onChange']} [onChange]
 * @property {any} [error]
 *
 *
 * @param {InputWithLabelProps} param0
 * @returns
 */
export default function InputWithLabel(props) {
  const id = useId();
  return (
    <div className={"form-control w-full " + (props.className ?? "")}>
      <label className={"label " + (props.inputClassName ?? "")} htmlFor={id}>
        <span className="label-text">{props.label}</span>
      </label>
      <input
        className={"input input-bordered input-primary w-full " + (props.error ? "input-error" : "")}
        type={props.type}
        name={props.name}
        id={id}
        value={props.value}
        required={props.required}
        readOnly={props.readOnly}
        onChange={props.onChange}
      />
    </div>
  );
}
