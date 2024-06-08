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
 *
 * @param {InputWithLabelProps} param0
 * @returns
 */
export default function SelectWithLabel({ value, label, name, required, className, readOnly, inputClassName, error }) {
  const id = useId();
  return (
    <div className={"form-control w-full " + (className ?? "")}>
      <label className={"label " + (inputClassName ?? "")} htmlFor={id}>
        <span className="label-text">{label}</span>
      </label>
      <select className="select select-bordered">
        <option disabled selected>
          Pick one
        </option>
        <option>Star Wars</option>
        <option>Harry Potter</option>
        <option>Lord of the Rings</option>
        <option>Planet of the Apes</option>
        <option>Star Trek</option>
      </select>
    </div>
  );
}
