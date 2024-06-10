import Alert from "../atoms/Alert";
import IconWarning from "../atoms/IconWarning";

export default function AlertWarning({ children, className }) {
  return (
    <Alert className={"alert-warning " + className}>
      <IconWarning />
      <span>{children}</span>
    </Alert>
  );
}
