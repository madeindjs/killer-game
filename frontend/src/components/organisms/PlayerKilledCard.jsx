import PlayerAvatar from "../molecules/PlayerAvatar";

/**
 * @param {{player: import("@killer-game/types").PlayerRecordSanitized, action: import("@killer-game/types").GameActionRecord}} param0
 */
export function PlayerKilledCard({ player, action }) {
  return (
    <div className="flex gap-2">
      <PlayerAvatar player={player} />
      <div className="flex flex-col gap-1 justify-center">
        <p className="font-bold">{player.name}</p>
        <p>{action.name}</p>
      </div>
    </div>
  );
}
