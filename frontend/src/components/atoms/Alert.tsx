import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{ className?: string }>;

export default function Alert(props: Props) {
  return <div className={"alert " + props.className}>{props.children}</div>;
}
