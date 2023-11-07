import { DEFAULT_LANG } from "@/lib/i18n";
import IconWarning from "../atoms/IconWarning";

/**
 * @typedef Props
 * @property {import("@/lib/i18n").Lang} lang
 *
 * @param {Props} param0
 */
export default function Unauthorized({ children, lang = DEFAULT_LANG }) {
  return (
    <div className="alert alert-error">
      <IconWarning />
      <div>
        <h3 className="font-bold">You do not have access to this page!</h3>
        <div className="text-xs">{children}</div>
      </div>
    </div>
  );
}
