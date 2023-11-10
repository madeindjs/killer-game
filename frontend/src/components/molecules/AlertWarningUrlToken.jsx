/**
 * @typedef Props
 * @property {string} content
 *
 * @param {Props} param0
 */
export default function AlertWarningUrlToken({ content }) {
  return (
    <div className="">
      <span className="text-warning">
        Don&apos;t share this URL, it contains your private token and give access to your profile.
      </span>
    </div>
  );
}
