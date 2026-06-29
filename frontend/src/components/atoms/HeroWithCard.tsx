import { ReactNode } from "react";

interface HeroWithCardProps {
  side: ReactNode;
  card: ReactNode;
  className?: string;
}

export default function HeroWithCard({
  side,
  card,
  className = "",
}: HeroWithCardProps) {
  return (
    <div className={"hero " + className}>
      <div className="hero-content grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full max-w-6xl">
        <div className="text-center lg:text-left order-1">{side}</div>
        <div className="order-2 flex justify-center lg:justify-end">
          <div className="card w-full max-w-md shadow-2xl bg-base-100">
            <div className="card-body">{card}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
