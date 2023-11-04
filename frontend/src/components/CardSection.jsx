export default function CardSection({ children }) {
  return (
    <div className="card bg-base-100 card-compact">
      <div className="card-body">{children}</div>
    </div>
  );
}
