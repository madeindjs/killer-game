export default function CardSection({ children, className }) {
  return (
    <div className={"card bg-base-100 card-compact " + className}>
      <div className="card-body">{children}</div>
    </div>
  );
}
