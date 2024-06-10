import Alert from "../atoms/Alert";
import IconError from "../atoms/IconError";

export default function AlertWarning({ children, className }) {
  return (
    <Alert className={"alert-warning " + className}>
      <IconError />
      <span>{children}</span>
    </Alert>
  );
}
