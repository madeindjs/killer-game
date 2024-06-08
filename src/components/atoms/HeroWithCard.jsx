export default function HeroWithCard({ card, side, className = "min-h-screen" }) {
  return (
    <div className={"hero " + className}>
      <div className="hero-content grid grid-cols-1 lg:grid-cols-2 lg:grid gap-8">
        <div className="text-center lg:text-left lg:order-2">{side}</div>
        <div className="lg:order-1 flex justify-center lg:justify-end">
          <div className="card w-full max-w-md shadow-2xl bg-base-100 ">
            <div className="card-body">{card}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
