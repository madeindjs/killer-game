import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{ className: string }>;

export default function CardSection({ children, className }: Props) {
  return (
    <div className={"card bg-base-100 card-compact " + className}>
      <div className="card-body">{children}</div>
    </div>
  );
}
