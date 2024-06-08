import { useTranslations as useTranslation } from "next-intl";
import { useId, useMemo } from "react";

/**
 * @typedef Props
 * @property {string} value
 * @property {(value: string) => void} onChange
 * @property {import("@killer-game/types").GameActionRecord[]} actions
 * @property {boolean} [readonly]
 *
 *
 * @param {Props} param0
 */
export default function PlayerActionSelector({ value, actions, onChange, readonly }) {
  const t = useTranslation("common");
  const id = useId();
  const actionsSorted = useMemo(() => {
    if (!actions) return [];

    const collator = new Intl.Collator();
    return [...actions].sort((a, b) => collator.compare(a.name, b.name));
  }, [actions]);

  return (
    <div className={"form-control w-full"}>
      <label className={"label"} htmlFor={id}>
        <span className="label-text">{t("PlayerActionSelector.label")}</span>
      </label>
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
    </div>
  );
}
