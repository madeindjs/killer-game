"use client";

import { useTranslations } from "next-intl";
import { Fragment, useRef } from "react";
import classNames from "classnames";
import type { GameDashboard, PlayerRecord } from "@killer-game/types";
import { useDefaultActions } from "@/hooks/use-default-actions";
import {
  usePrefersReducedMotion,
  useScrollScrub,
} from "@/hooks/use-scroll-scrub";
import { STYLES } from "@/constants/styles";
import AvatarEliminated from "../molecules/AvatarEliminated";
import CardSection from "../atoms/CardSection";
import { GameTimeline } from "./GameTimeline";
import GamePodium from "./GamePodium";

const STEP_KEYS = ["step1", "step2", "step3", "step4"] as const;
const STEP_COUNT = STEP_KEYS.length;

interface TutorialData {
  players: PlayerRecord[];
  states: PlayerRecord[][];
  podium: GameDashboard["podium"];
  translationValues: Record<string, string>;
}

function useTutorialData(): TutorialData {
  const actionsNames = useDefaultActions();

  function makePlayer(id: number, name: string): PlayerRecord {
    return {
      game_id: "",
      id: String(id),
      name,
      action: actionsNames[id] ?? "",
      kill_token: 1,
      killed_at: null,
      killed_by: null,
      order: id,
      private_token: "",
    };
  }

  function markPlayerDead(p: PlayerRecord): PlayerRecord {
    return { ...p, killed_at: "2025" };
  }

  const player1 = makePlayer(1, "Bob");
  const player2 = makePlayer(2, "Alice");
  const player3 = makePlayer(3, "Luc");
  const player4 = makePlayer(4, "Jean");
  const player2X = markPlayerDead(player2);
  const player4X = markPlayerDead(player4);
  const player1X = markPlayerDead(player1);

  const players = [player1, player2, player3, player4];

  const states: PlayerRecord[][] = [
    players,
    players,
    [player1, player2X, player3, player4],
    [player1X, player2X, player3, player4X],
  ];

  const podium: GameDashboard["podium"] = [
    { player: player3, kills: [player4X, player1X] },
    { player: player1X, kills: [player2X] },
    { player: player4X, kills: [] },
    { player: player2X, kills: [] },
  ];

  const translationValues = {
    player1: player1.name,
    player2: player2.name,
    player3: player3.name,
    player4: player4.name,
    action1: player1.action,
  };

  return { players, states, podium, translationValues };
}

function StepText(props: { i18nKey: string; values: Record<string, string> }) {
  const t = useTranslations("homepage.HowDoesItWork");
  const inner = t.markup(props.i18nKey, {
    ...props.values,
    b: (chunks: string) => `<strong class="text-primary">${chunks}</strong>`,
  });

  return <p dangerouslySetInnerHTML={{ __html: inner }} />;
}

function StepDots(props: { activeStep: number }) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: STEP_COUNT }).map((_, i) => (
        <span
          key={i}
          data-testid="step-dot"
          className={classNames(
            "h-2 w-8 rounded-full transition-colors duration-300",
            i <= props.activeStep ? "bg-primary" : "bg-base-300",
          )}
        />
      ))}
    </div>
  );
}

function VisualPanel(props: {
  activeStep: number;
  playersState: PlayerRecord[];
  podium: GameDashboard["podium"];
}) {
  const showTimeline = props.activeStep >= 1 && props.activeStep < 3;
  const showPodium = props.activeStep === 3;

  return (
    <div className="card w-full bg-base-100 shadow-xl border border-base-200">
      <div className="card-body gap-4 lg:gap-6 items-center p-4 lg:p-8">
        <StepDots activeStep={props.activeStep} />

        <div className="flex flex-wrap gap-3 lg:gap-4 justify-evenly w-full">
          {props.playersState.map((p, i) => (
            <AvatarEliminated
              key={p.id}
              player={p}
              killed={!!p.killed_at}
              delayMs={i * 150}
            />
          ))}
        </div>

        <div
          data-testid="how-it-works-timeline"
          aria-hidden={!showTimeline}
          className={classNames(
            "w-full overflow-hidden transition-all duration-700 ease-out",
            showTimeline
              ? "opacity-100 max-h-[40rem]"
              : "opacity-0 max-h-0 pointer-events-none",
          )}
        >
          <div className="overflow-x-auto">
            <GameTimeline players={props.playersState} />
          </div>
        </div>

        <div
          data-testid="how-it-works-podium"
          aria-hidden={!showPodium}
          className={classNames(
            "w-full overflow-hidden transition-all duration-700 ease-out",
            showPodium
              ? "opacity-100 max-h-[30rem]"
              : "opacity-0 max-h-0 pointer-events-none",
          )}
        >
          <GamePodium podium={props.podium} />
        </div>
      </div>
    </div>
  );
}

export default function HowItWorksScroll() {
  const t = useTranslations("homepage.HowDoesItWork");
  const reducedMotion = usePrefersReducedMotion();
  const { states, podium, translationValues } = useTutorialData();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const { activeStep } = useScrollScrub(containerRef, STEP_COUNT);

  if (reducedMotion) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {STEP_KEYS.map((stepKey, i) => (
          <Fragment key={stepKey}>
            <div className={STYLES.PARAGRAPHS}>
              <h3 className={STYLES.h3}>{t(`${stepKey}.title`)}</h3>
              <StepText i18nKey={`${stepKey}.desc`} values={translationValues} />
            </div>
            <CardSection>
              <div className="flex flex-col gap-6 items-center">
                <div className="flex flex-wrap gap-4 justify-evenly w-full">
                  {states[i].map((p) => (
                    <AvatarEliminated
                      key={p.id}
                      player={p}
                      killed={!!p.killed_at}
                    />
                  ))}
                </div>
                {i >= 1 && i < 3 && <GameTimeline players={states[i]} />}
                {i === 3 && <GamePodium podium={podium} />}
              </div>
            </CardSection>
          </Fragment>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="block lg:grid lg:grid-cols-2 lg:gap-12">
      <div
        data-testid="how-it-works-sticky-panel"
        className={
          "sticky top-2 z-10 self-start max-h-[70vh] overflow-y-auto " +
          "lg:top-24 lg:max-h-none lg:overflow-visible"
        }
      >
        <VisualPanel
          activeStep={activeStep}
          playersState={states[Math.min(activeStep, states.length - 1)]!}
          podium={podium}
        />
      </div>

      <div className="order-2 flex flex-col">
        {STEP_KEYS.map((stepKey, i) => (
          <div
            key={stepKey}
            data-testid="how-it-works-step"
            className={classNames(
              "flex flex-col justify-center gap-2 py-8 min-h-[60vh] lg:min-h-[70vh]",
              "transition-opacity duration-500",
              i === activeStep ? "opacity-100" : "opacity-40",
            )}
          >
            <h3 className={STYLES.h3}>{t(`${stepKey}.title`)}</h3>
            <StepText i18nKey={`${stepKey}.desc`} values={translationValues} />
          </div>
        ))}
      </div>
    </div>
  );
}
