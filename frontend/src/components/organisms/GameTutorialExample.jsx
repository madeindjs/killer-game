import { STYLES } from "@/constants/styles";
import { useDefaultActions } from "@/hooks/use-default-actions";
import { useTranslations } from "next-intl";
import CardSection from "../atoms/CardSection";
import GamePlayersTimeline from "./GamePlayersTimeline";
import GamePodium from "./GamePodium";
import PlayerAvatarWithStatus from "./PlayerAvatarWithStatus";

export default function GameTutorialExample() {
  const t = useTranslations("help");

  const actionsNames = useDefaultActions();

  /** @type {import("@killer-game/types").PlayerRecord} */
  const player1 = { name: "Bob", id: "1" };
  /** @type {import("@killer-game/types").PlayerRecord} */
  const player2 = { name: "Alice", id: "2" };
  /** @type {import("@killer-game/types").PlayerRecord} */
  const player3 = { name: "Luc", id: "3" };

  const players = [player1, player2, player3];

  /** @type {import("@killer-game/types").GameActionRecord} */
  const action1 = { id: "1", name: actionsNames[0] };
  /** @type {import("@killer-game/types").GameActionRecord} */
  const action2 = { id: "2", name: actionsNames[1] };
  /** @type {import("@killer-game/types").GameActionRecord} */
  const action3 = { id: "3", name: actionsNames[2] };

  /** @type {import("@killer-game/types").GameActionRecord[]} */
  const actions = [action1, action2, action3];

  /** @type {import("@killer-game/types").GamePlayersTable} */
  const table1 = [
    { player: player1, target: player2, action: action1 },
    { player: player2, target: player3, action: action2 },
    { player: player3, target: player1, action: action3 },
  ];

  /** @type {import("@killer-game/types").GamePlayersTable} */
  const table2 = [
    { player: player1, target: player3, action: action1 },
    { player: player3, target: player1, action: action3 },
  ];

  /** @type {import("@killer-game/types").GameDashboard['podium']} */
  const podium = [
    { player: player3, kills: [makesPlayerDead(player1)] },
    { player: makesPlayerDead(player1), kills: [makesPlayerDead(player2)] },
    { player: makesPlayerDead(player2), kills: [] },
  ];

  /**
   * @param {import("@killer-game/types").PlayerRecord} player
   * @returns {import("@killer-game/types").PlayerRecord}
   */
  function makesPlayerDead(player) {
    return { ...player, killedAt: "1" };
  }

  const translationValues = {
    player1: player1.name,
    player2: player2.name,
    player3: player3.name,
    action1: action1.name,
    action2: action2.name,
    action3: action3.name,
  };

  function TransStep({ i18nKey }) {
    return (
      <strong
        className="text-primary"
        dangerouslySetInnerHTML={{ __html: t(`GameTutorialExample.${i18nKey}`, translationValues) }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className={STYLES.PARAGRAPHS}>
        <h3 className={STYLES.h3}>{t("GameTutorialExample.step1.title")}</h3>
        <p>
          <TransStep i18nKey="step1.desc" />
        </p>
      </div>

      <CardSection>
        <div className="flex flex-wrap gap-4 justify-evenly">
          {players.map((p) => (
            <PlayerAvatarWithStatus player={p} key={p.id} />
          ))}
        </div>
      </CardSection>

      <div className="divider col-span-full"></div>

      <div className={STYLES.PARAGRAPHS}>
        <h3 className={STYLES.h3}>{t("GameTutorialExample.step2.title")}</h3>
        <p>{t("GameTutorialExample.step2.desc1")}</p>
        <p>
          <TransStep i18nKey="step2.desc2" />
        </p>
        <p>
          <TransStep i18nKey="step2.desc3" />
        </p>
        <p>{t("GameTutorialExample.step2.desc4")}</p>
      </div>
      <CardSection>
        <GamePlayersTimeline actions={actions} players={players} table={table1} />
      </CardSection>

      <div className="divider col-span-full"></div>

      <div className="flex flex-col gap-2">
        <h3 className={STYLES.h3}>{t("GameTutorialExample.step3.title")}</h3>
        <p>{t("GameTutorialExample.step3.desc1")}</p>
        <p>
          <TransStep i18nKey="step3.desc2" />
        </p>
        <p>
          <TransStep i18nKey="step3.desc3" />
        </p>
        <p>
          <TransStep i18nKey="step3.desc4" />
        </p>
      </div>
      <div className={STYLES.PARAGRAPHS}>
        <CardSection>
          <GamePlayersTimeline actions={actions} players={players} table={table2} />
        </CardSection>
        <CardSection>
          <div className="flex flex-wrap gap-4 justify-evenly">
            {[player1, makesPlayerDead(player2), player3].map((p) => (
              <PlayerAvatarWithStatus player={p} key={p.id} />
            ))}
          </div>
        </CardSection>
      </div>

      <div className="divider col-span-full"></div>

      <div className="flex flex-col gap-2">
        <h3 className={STYLES.h3}>{t("GameTutorialExample.step4.title")}</h3>
        <p>
          <TransStep i18nKey="step4.desc1" />
        </p>
        <p>
          <TransStep i18nKey="step4.desc2" />
        </p>
      </div>
      <div className={STYLES.PARAGRAPHS}>
        <CardSection>
          <GamePodium podium={podium} />
        </CardSection>
      </div>
    </div>
  );
}
