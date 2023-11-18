export default function Card({ children }) {
  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">{children}</div>
    </div>
  );
}
