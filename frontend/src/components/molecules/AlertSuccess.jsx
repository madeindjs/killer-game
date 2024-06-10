import Alert from "../atoms/Alert";
import IconSuccess from "../atoms/IconSuccess";

export default function AlertSuccess({ children, className }) {
  return (
    <Alert className={"alert-success " + className}>
      <IconSuccess />
      <span>{children}</span>
    </Alert>
  );
}
