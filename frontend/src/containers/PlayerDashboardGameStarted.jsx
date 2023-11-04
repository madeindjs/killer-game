import Fetching from "@/components/Fetching";
import { PlayerKilledCard } from "@/components/PlayerKilledCard";
import { STYLES } from "@/constants/styles";
import { usePlayerStatus } from "@/hooks/use-player-status";
import { pluralizePlayers } from "@/utils/pluralize";
import { PlayerDashboardGameStartedKillCard } from "./PlayerDashboardGameStartedKillCard";

/**
 *
 * @param {{player: import("@killer-game/types").PlayerRecord, game: import("@killer-game/types").GameRecord}} param0
 */
export default function PlayerDashboardGameStarted({ player, game }) {
  const { playerStatusError, playerStatusLoading, playerStatus } = usePlayerStatus(player.id, player.private_token);

  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="flex gap-4 flex-col">
          <h1 className={STYLES.h1}>Dear {player.name},</h1>
          <Fetching loading={playerStatusLoading} error={playerStatusError}>
            {playerStatus && (
              <PlayerDashboardGameStartedKillCard
                player={player}
                target={playerStatus.current.player}
                action={playerStatus.current.action}
              />
            )}
          </Fetching>

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
