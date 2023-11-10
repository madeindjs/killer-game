import DateTime from "../atoms/DateTime";
import PlayersAvatars from "./PlayersAvatars";

/**
 * @typedef Props
 * @property {import("@killer-game/types").GameDashboard['events']} events
 *
 * @param {Props} param0
 */
export default function GameEvents({ events }) {
  return (
    <div>
      {events.map((event, i) => (
        <>
          <div key={i} className="flex flex-wrap gap-2">
            <div>
              <PlayersAvatars players={[event.player, event.target]} />
            </div>
            <div>
              <p className="mb-2 font-bold">{event.action.name}</p>
              <p>
                <DateTime date={event.at} />
              </p>
            </div>
          </div>
          {i + 1 !== events.length && <div className="divider" key={"divider_" + i}></div>}
        </>
      ))}
    </div>
  );
}
