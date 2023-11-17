export default function HeroWithCard({ card, side, className = "min-h-screen" }) {
  return (
    <div className={"hero " + className}>
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">{side}</div>
        <div className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
          <div className="card-body">{card}</div>
        </div>
      </div>
    </div>
  );
}
