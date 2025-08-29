import type { PropsWithChildren } from "react";
import Alert from "../atoms/Alert";
import IconError from "../atoms/IconError";

type Props = PropsWithChildren<{ className?: string }>;

export default function AlertWarning({ children, className }: Props) {
  return (
    <Alert className={"alert-warning " + className}>
      <IconError />
      <span>{children}</span>
    </Alert>
  );
}
