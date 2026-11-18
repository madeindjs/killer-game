"use client";
import { useLocationOrigin } from "@/hooks/use-location";
import { getPlayerUrl } from "@/lib/routes";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";
import Modal from "../molecules/Modal";
import InputCopyToClipBoard from "./InputCopyToClipBoard";
import type { GameRecord, PlayerRecord } from "@killer-game/types";

export interface GameStartOptions {
  /** Randomly reassign the whole chain of targets when starting the game. */
  shuffle: boolean;
}

interface GameStartButtonProps {
  game: GameRecord;
  players: PlayerRecord[];
  /** Called to toggle the game: start it (after confirmation) or stop it. */
  onChange?: (options: GameStartOptions) => void;
  disabled?: boolean;
}

export default function GameStartButton({
  game,
  players,
  onChange,
  disabled,
}: GameStartButtonProps) {
  const fieldId = useId();
  const shuffleId = useId();
  const t = useTranslations("games");
  const lang = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  const origin = useLocationOrigin();

  function toggle() {
    if (!game.started_at) {
      setShuffle(false);
      return setIsOpen(true);
    }
    onChange?.({ shuffle: false });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    toggle();
  }

  function onModalSubmit() {
    setIsOpen(false);
    onChange?.({ shuffle });
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor={fieldId} className="sr-only">
          <span>{t("GameStartButton.start")}</span>
          <input
            id={fieldId}
            type="checkbox"
            checked={Boolean(game.started_at)}
            onChange={toggle}
            readOnly={disabled}
          />
        </label>
        <input
          type="submit"
          value={
            game.started_at
              ? `⏸️ ${t("GameStartButton.stop")}`
              : `▶️ ${t("GameStartButton.start")}`
          }
          className={"btn " + (game.started_at ? "btn-neutral" : "btn-primary")}
          disabled={disabled}
        />
      </form>
      <Modal
        isOpen={isOpen}
        onClosed={() => setIsOpen(false)}
        title={t("GameStartButton.areYouSure")}
        content={
          isOpen && (
            <>
              <p className="mb-2">{t("GameStartButton.areYouSure")}</p>
              <table className="table mb-2">
                <thead>
                  <tr>
                    <th>{t("GameStartButton.tablePlayer")}</th>
                    <th>{t("GameStartButton.tableLink")}</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.id}>
                      <td>{player.name}</td>

                      <td>
                        <InputCopyToClipBoard
                          value={getPlayerUrl(game, player, lang, origin)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="form-control mb-2">
                <label htmlFor={shuffleId} className="label cursor-pointer justify-start gap-2">
                  <input
                    id={shuffleId}
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={shuffle}
                    onChange={(e) => setShuffle(e.target.checked)}
                  />
                  <span className="label-text">🔀 {t("GameStartButton.shuffle")}</span>
                </label>
                <p className="text-sm opacity-70">{t("GameStartButton.shuffleHelp")}</p>
              </div>
              <button
                className="btn btn-primary sticky bottom-0"
                onClick={onModalSubmit}
                type="button"
              >
                {t("GameStartButton.confirm")}
              </button>
            </>
          )
        }
      />
    </div>
  );
}