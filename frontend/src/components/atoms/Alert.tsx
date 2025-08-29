import type { ReactNode } from "react";

export default function Alert(props: {
  children: ReactNode;
  className: string;
}) {
  return <div className={"alert " + props.className}>{props.children}</div>;
}
