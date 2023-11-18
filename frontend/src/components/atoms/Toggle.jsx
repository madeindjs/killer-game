/**
 * @typedef Props
 * @property {string} labelChecked
 * @property {string} labelUnchecked
 * @property {boolean} checked
 * @property {(checked: boolean) => void} onChange
 *
 * @param {Props} param0
 */
export default function Toggle({ labelChecked, labelUnchecked, checked, onChange }) {
  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <span className="label-text">{checked ? labelChecked : labelUnchecked}</span>
        <input type="checkbox" className="toggle" checked={checked} onChange={() => onChange(!checked)} />
      </label>
    </div>
  );
}
