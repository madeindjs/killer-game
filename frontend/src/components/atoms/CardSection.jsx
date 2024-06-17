/**
 * @typedef Props
 * @property {string} [className]
 *
 * @param {import("react").PropsWithChildren<Props>} param0
 */
export default function CardSection({ children, className }) {
  return (
    <div className={"card bg-base-100 card-compact " + className}>
      <div className="card-body">{children}</div>
    </div>
  );
}
