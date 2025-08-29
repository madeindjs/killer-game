import type { PropsWithChildren } from "react";
import Alert from "../atoms/Alert";
import IconSuccess from "../atoms/IconSuccess";

type Props = PropsWithChildren<{ className?: string }>;

export default function AlertSuccess({ children, className }: Props) {
  return (
    <Alert className={"alert-success " + className}>
      <IconSuccess />
      <span>{children}</span>
    </Alert>
  );
}
