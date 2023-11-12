import { STYLES } from "@/constants/styles";
import useTranslation from "next-translate/useTranslation";
import CardSection from "../atoms/CardSection";
import Details from "../atoms/Details";
import GamePlayersTimeline from "./GamePlayersTimeline";

export default function GameTutorialExample() {
  const { t, lang } = useTranslation("game-example");

  /** @type {import("@killer-game/types").PlayerRecord[]} */
  const players = [
    { name: "Player 1", id: "1" },
    { name: "Player 2", id: "2" },
    { name: "Player 3", id: "3" },
  ];

  /** @type {import("@killer-game/types").GameActionRecord{}} */
  const actions = [
    { id: "1", name: "action 1" },
    { id: "2", name: "action 2" },
    { id: "3", name: "action 2" },
  ];

  /** @type {import("@killer-game/types").GamePlayersTable} */
  const table1 = [
    { player: players[0], target: players[1], action: actions[0] },
    { player: players[1], target: players[2], action: actions[1] },
    { player: players[2], target: players[0], action: actions[2] },
  ];

  return (
    <CardSection>
      <h2 className={STYLES.h2}>{t("title")}</h2>
      <h3 className={STYLES.h3}>{t("step1.title")}</h3>
      <p>{t("step1.content")}</p>
      <Details
        open
        summary={t("illustration")}
        content={<GamePlayersTimeline actions={actions} players={players} table={table1} />}
      />
      <h3 className={STYLES.h3}>{t("step2.title")}</h3>
      <p>
        {t("step2.content", {
          playerName: players[0].name,
          targetName: players[1].name,
          newTargetName: players[2].name,
        })}
      </p>
    </CardSection>
  );
}
