"use client";

import { useLocationOrigin } from "@/hooks/use-location";
import { client } from "@/lib/client";
import { useTranslations } from "next-intl";
import { useContext, useState } from "react";
import { ToastContext } from "@/context/Toast";
import type { GameRecord } from "@killer-game/types";

interface GameUpgradeButtonProps {
  game: GameRecord;
  className?: string;
  disabled?: boolean;
}

/**
 * "Passer en Pro" call-to-action. Calls the API to create a Stripe Checkout
 * session, then redirects the browser to the Stripe-hosted payment page.
 * Hidden when the game is already premium (use <GamePremiumBadge /> instead).
 */
export default function GameUpgradeButton({
  game,
  className = "",
  disabled = false,
}: GameUpgradeButtonProps) {
  const t = useTranslations("games");
  const { push: pushToast } = useContext(ToastContext);
  const origin = useLocationOrigin();
  const [loading, setLoading] = useState(false);

  if (game.premium) return null;

  async function handleClick() {
    setLoading(true);
    try {
      const result = await client.createCheckoutSession(game.id, game.private_token, {
        origin,
      });
      if (result.checkout_url) {
        window.location.href = result.checkout_url;
        return;
      }
      pushToast("error", t("GameUpgradeButton.error"));
    } catch {
      pushToast("error", t("GameUpgradeButton.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className={`btn btn-outline btn-primary gap-1 ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
      title={t("GameUpgradeButton.tooltip")}
    >
      {loading ? (
        <span className="loading loading-spinner loading-xs" />
      ) : (
        <span>⭐</span>
      )}
      {t("GameUpgradeButton.cta")}
    </button>
  );
}