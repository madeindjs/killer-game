import IconWarning from "../atoms/IconWarning";

export default function AlertWarning({ children, className }) {
  return (
    <div className={"alert alert-warning " + className}>
      <IconWarning />
      <span>{children}</span>
    </div>
  );
}
