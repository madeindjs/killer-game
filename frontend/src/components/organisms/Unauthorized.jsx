import IconWarning from "../atoms/IconWarning";

export default function Unauthorized({ children }) {
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
