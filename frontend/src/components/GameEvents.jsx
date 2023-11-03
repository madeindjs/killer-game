import PlayersAvatars from "./PlayersAvatars";

/**
 * @param {{events: import("@killer-game/types").GameDashboard['events']}} param0
 * @returns
 */
export default function GameEvents({ events }) {
  return (
    <div>
      {events.map((event, i) => (
        <div key={i} className="flex gap-2">
          <PlayersAvatars players={[event.player, event.target]} />
          <div>
            <p className="mb-2 font-bold">{event.action.name}</p>
            <p>{event.at}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
