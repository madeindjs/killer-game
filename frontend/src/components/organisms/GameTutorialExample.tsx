import { STYLES } from "@/constants/styles";
import { useDefaultActions } from "@/hooks/use-default-actions";
import { useTranslations } from "next-intl";
import CardSection from "../atoms/CardSection";
import GamePodium from "./GamePodium";
import PlayerAvatarWithStatus from "./PlayerAvatarWithStatus";
import type { GameDashboard, PlayerRecord } from "@killer-game/types";
import { GameTimeline } from "./GameTimeline";

export default function GameTutorialExample() {
  const t = useTranslations("help.GameTutorialExample");

  const actionsNames = useDefaultActions();

  const action1 = actionsNames[1]!;
  const action2 = actionsNames[2]!;
  const action3 = actionsNames[3]!;

  const playerBase: PlayerRecord = {
    game_id: "",
    id: "",
    name: "",
    action: "",
    kill_token: 1,
    killed_at: null,
    killed_by: null,
    order: 0,
    private_token: "",
  };
  const player1: PlayerRecord = {
    ...playerBase,
    name: "Bob",
    id: "1",
    order: 1,
    action: action1,
  };
  const player2: PlayerRecord = {
    ...playerBase,
    name: "Alice",
    id: "2",
    order: 2,
    action: action2,
  };
  const player3: PlayerRecord = {
    ...playerBase,
    name: "Luc",
    id: "3",
    order: 3,
    action: action3,
  };
  const player1X = markPlayerDead(player1);
  const player2X = markPlayerDead(player2);
  function markPlayerDead(p: PlayerRecord): PlayerRecord {
    return { ...p, killed_at: "2025" };
  }

  const players = [player1, player2, player3];

  const podium: GameDashboard["podium"] = [
    { player: player3, kills: [player1X] },
    { player: player1X, kills: [player2X] },
    { player: player2X, kills: [] },
  ];

  const translationValues = {
    player1: player1.name,
    player2: player2.name,
    player3: player3.name,
    action1: action1,
    action2: action2,
    action3: action3,
  };

  function TransStep(props: { i18nKey: string }) {
    const inner = t.markup(props.i18nKey, {
      ...translationValues,
      b: (chunks) => `<strong class="text-primary">${chunks}</strong>`,
    });

    return <p dangerouslySetInnerHTML={{ __html: inner }} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className={STYLES.PARAGRAPHS}>
        <h3 className={STYLES.h3}>{t("step1.title")}</h3>
        <TransStep i18nKey="step1.desc" />
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
        <h3 className={STYLES.h3}>{t("step2.title")}</h3>
        <p>{t("step2.desc1")}</p>
        <TransStep i18nKey="step2.desc2" />
        <TransStep i18nKey="step2.desc3" />
      </div>
      <CardSection>
        <GameTimeline players={[player1, player2, player3]} />
      </CardSection>

      <div className="divider col-span-full"></div>

      <div className="flex flex-col gap-2">
        <h3 className={STYLES.h3}>{t("step3.title")}</h3>
        <p>{t("step3.desc1")}</p>
        <TransStep i18nKey="step3.desc2" />
        <TransStep i18nKey="step3.desc3" />
      </div>
      <div className={STYLES.PARAGRAPHS}>
        <CardSection>
          <GameTimeline players={[player1, player2X, player3]} />
        </CardSection>
        <CardSection>
          <div className="flex flex-wrap gap-4 justify-evenly">
            {[player1, player2X, player3].map((p) => (
              <PlayerAvatarWithStatus player={p} key={p.id} />
            ))}
          </div>
        </CardSection>
      </div>

      <div className="divider col-span-full"></div>

      <div className="flex flex-col gap-2">
        <h3 className={STYLES.h3}>{t("step4.title")}</h3>
        <TransStep i18nKey="step4.desc1" />
        <TransStep i18nKey="step4.desc2" />
      </div>
      <div className={STYLES.PARAGRAPHS}>
        <CardSection>
          <GamePodium podium={podium} />
        </CardSection>
      </div>
    </div>
  );
}
