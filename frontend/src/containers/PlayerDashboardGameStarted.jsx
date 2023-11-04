import { KillCard } from "@/components/KillCard";
import Loader from "@/components/Loader";
import { PlayerKilledCard } from "@/components/PlayerKilledCard";
import { STYLES } from "@/constants/styles";
import { usePlayerStatus } from "@/hooks/use-player-status";
import { pluralizePlayers } from "@/utils/pluralize";

export default /**
 *
 * @param {{player: import("@killer-game/types").PlayerRecord, game: import("@killer-game/types").GameRecord}} param0
 */
function PlayerDashboardGameStarted({ player, game }) {
  const { playerStatusError, playerStatusLoading, playerStatus } = usePlayerStatus(player.id, player.private_token);

  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div>
          <h1 className={STYLES.h1}>Dear {player.name},</h1>
          {playerStatusLoading && <Loader />}
          {playerStatus && (
            <p className="py-6">
              You need to kill <strong>{playerStatus.current.player.name}</strong>
            </p>
          )}

          {playerStatus && (
            <KillCard player={player} target={playerStatus.current.player} action={playerStatus.current.action} />
          )}

          <h2 className={STYLES.h2}>You get killed ?</h2>
          <p>Communicate you killed token: {player.kill_token}</p>

          {playerStatus && (
            <>
              <h2 className={STYLES.h2}>You already killed {pluralizePlayers(playerStatus.kills.length)}</h2>
              {playerStatus.kills.map((kill) => (
                <PlayerKilledCard key={player.id} player={kill.player} action={kill.action} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
