import { useLocationOrigin } from "@/hooks/use-domain";
import { getPlayerUrl } from "@/lib/routes";
import useTranslation from "next-translate/useTranslation";
import Modal from "../molecules/Modal";
import InputCopyToClipBoard from "./InputCopyToClipBoard";

const { useId, useState } = require("react");

/**
 * @typedef GameStartButtonProps
 * @property {import('@killer-game/types').GameRecord} game
 * @property {import('@killer-game/types').PlayerRecord[]} players
 * @property {() => void} [onChange]
 *
 * @param {GameStartButtonProps} param0
 */
export default function GameStartButton({ game, players, onChange, disabled }) {
  const fieldId = useId();
  const { t, lang } = useTranslation("games");
  const [isOpen, setIsOpen] = useState(false);

  const origin = useLocationOrigin();

  /**
   * @param {SubmitEvent} e
   */
  function onSubmit(e) {
    e.preventDefault();
    if (!game.started_at) return setIsOpen(true);
    onChange();
  }

  function onModalSubmit() {
    setIsOpen(false);
    onChange();
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor={fieldId} className="sr-only">
        <span>{t("GameStartButton.start")}</span>
        <input
          id={fieldId}
          type="checkbox"
          checked={Boolean(game.started_at)}
          onChange={onChange}
          readOnly={disabled}
        />
      </label>
      <input
        type="submit"
        value={game.started_at ? `⏸️ ${t("GameStartButton.stop")}` : `▶️ ${t("GameStartButton.start")}`}
        className={"btn " + (game.started_at ? "btn-neutral" : "btn-primary")}
        disabled={disabled}
      />
      <Modal
        isOpen={isOpen}
        onClosed={() => setIsOpen(false)}
        title={"You are about to start the game"}
        content={
          <>
            <p className="mb-2">{t("GameStartButton.areYouSure")}</p>
            <table className="table mb-2">
              <tr>
                <th>{t("GameStartButton.tablePlayer")}</th>
                <th>{t("GameStartButton.tableLink")}</th>
              </tr>
              {players.map((player) => (
                <tr key={player.id}>
                  <td>{player.name}</td>

                  <td>
                    <InputCopyToClipBoard value={getPlayerUrl(game, player, lang, origin)} />
                  </td>
                </tr>
              ))}
            </table>
            <button className="btn btn-primary sticky bottom-0" onClick={onModalSubmit}>
              {t("GameStartButton.confirm")}
            </button>
          </>
        }
      />
    </form>
  );
}
