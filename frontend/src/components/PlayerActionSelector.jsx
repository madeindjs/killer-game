import { useMemo } from "react";

/**
 * @typedef Props
 * @property {string} [id]
 * @property {string} value
 * @property {(value: string) => void} onChange
 * @property {import("@killer-game/types").GameActionRecord[]} actions
 * @property {boolean} [readonly]
 *
 *
 * @param {Props} param0
 */
export default function PlayerActionSelector({ value, actions, onChange, id, readonly }) {
  const actionsSorted = useMemo(() => {
    if (!actions) return [];

    const collator = new Intl.Collator();
    return [...actions].sort((a, b) => collator.compare(a.name, b.name));
  }, [actions]);

  return (
    <select
      className="input input-bordered input-primary w-full"
      type="text"
      name="action"
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      disabled={readonly}
    >
      {actionsSorted.map((action) => (
        <option key={action.id} value={action.id}>
          {action.name}
        </option>
      ))}
    </select>
  );
}
