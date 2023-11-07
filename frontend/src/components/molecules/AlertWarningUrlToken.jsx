import { DEFAULT_LANG } from "@/lib/i18n";

/**
 * @typedef Props
 * @property {import("@/lib/i18n").Lang} lang
 *
 * @param {Props} param0
 */
export default function AlertWarningUrlToken({ children, lang = DEFAULT_LANG }) {
  return (
    <div className="">
      <span className="text-warning">
        Don&apos;t share this URL, it contains your private token and give access to your profile.
      </span>
    </div>
  );
}
