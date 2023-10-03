export default function GameCard({ game }) {
  <div className="card w-96 bg-base-100 shadow-xl">
    <div className="card-body">
      <h2 className="card-title">
        {game.name} <span className="badge badge-neutral">pending</span>
      </h2>
      <p>If a dog chews shoes whose shoes does he choose?</p>
      <div className="card-actions justify-end">
        <a href={getGameAdminUrl(game)} className="btn btn-primary">
          See the game
        </a>
      </div>
    </div>
  </div>;
}
