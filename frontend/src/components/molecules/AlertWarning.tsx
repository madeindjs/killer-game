import type { PropsWithChildren } from "react";
import Alert from "../atoms/Alert";
import IconWarning from "../atoms/IconWarning";

type Props = PropsWithChildren<{ className?: string }>;

export default function AlertWarning({ children, className }: Props) {
  return (
    <Alert className={"alert-warning " + className}>
      <IconWarning />
      <span>{children}</span>
    </Alert>
  );
}
