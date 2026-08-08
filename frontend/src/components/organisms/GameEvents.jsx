import DateTime from "../atoms/DateTime";
import Empty from "../atoms/Empty";
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
      {events.length === 0 && <Empty />}
      {events.map((event, i) => {
        const players = [event.player, event.target].filter(Boolean);
        return (
          <div key={event.at + "-" + i}>
            <div className="flex flex-wrap gap-2">
              <div>
                {players.length > 0 && <PlayersAvatars players={players} />}
              </div>
              <div>
                <p className="mb-2 font-bold">{event.action}</p>
                <p>
                  <DateTime date={event.at} />
                </p>
              </div>
            </div>
            {i + 1 !== events.length && <div className="divider"></div>}
          </div>
        );
      })}
    </div>
  );
}
