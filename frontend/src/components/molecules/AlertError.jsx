import IconError from "../atoms/IconError";

export default function AlertError({ children }) {
  return (
    <div className="alert alert-error">
      <IconError />
      <span>{children}</span>
    </div>
  );
}
