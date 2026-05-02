import { useLocale, useTranslations } from "next-intl";
import Modal from "../molecules/Modal";
import PlayerForm from "./PlayerForm";
import type { GameRecord, PlayerRecord, PlayerRecordSanitized } from "@killer-game/types";
import Link from "next/link";
import { getPlayerUrl } from "@/lib/routes";

interface PlayerModalProps {
  game: GameRecord;
  player?: PlayerRecord | PlayerRecordSanitized | undefined;
  onPlayerUpdate: (player: PlayerRecord | PlayerRecordSanitized) => void;
  onPlayerDelete: () => void;
  onClosed: () => void;
}

export default function PlayerModal(props: PlayerModalProps) {
  const t = useTranslations("common");
  const lang = useLocale();

  return (
    <Modal
      isOpen={!!props.player}
      title="Edit the player"
      onClosed={props.onClosed}
      content={
        props.player && (
          <PlayerForm
            player={props.player}
            onChange={props.onPlayerUpdate}
            allowChangeAction
          />
        )
      }
      actions={
        props.player && (
          <div className="join">
            {"private_token" in props.player && props.player.private_token && (
              <Link
                className="btn btn-link"
                href={getPlayerUrl(props.game, props.player, lang)}
                target="_blank"
              >
                Dashboard
              </Link>
            )}
            <button
              className="btn btn-link text-error join-item"
              onClick={() => props.onPlayerDelete?.()}
            >
              {t("delete")}
            </button>
          </div>
        )
      }
    />
  );
}
