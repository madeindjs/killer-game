"use client";
import {
  buildQrPosterHtml,
  downloadBlob,
  getQrCodeFileName,
  serializeSvg,
  svgToPngBlob,
} from "@/lib/qr-code";
import type { GameRecord, GameRecordSanitized } from "@killer-game/types";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";

interface GameJoinQrCodeProps {
  game: GameRecord | GameRecordSanitized;
  /** Absolute invitation URL encoded in the QR code. */
  url: string;
}

/**
 * QR code encoding the game invitation link. Organizers can project it full
 * screen, download it as a PNG or print it as a poster (or save it as PDF) so
 * participants join the game by scanning it on arrival.
 */
export default function GameJoinQrCode({ game, url }: GameJoinQrCodeProps) {
  const t = useTranslations("games");
  const locale = useLocale();
  const previewRef = useRef<HTMLDivElement>(null);
  const presentationRef = useRef<HTMLDialogElement>(null);
  const [presenting, setPresenting] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const dialog = presentationRef.current;
    if (!presenting || !dialog) return;

    // a modal <dialog> lives in the top layer, above the invite modal
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");

    // best effort: hide the browser UI on the projector
    dialog.requestFullscreen?.().catch(() => {});

    function onFullscreenChange() {
      if (!document.fullscreenElement) setPresenting(false);
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    };
  }, [presenting]);

  function getSvg(): SVGSVGElement | null {
    return previewRef.current?.querySelector("svg") ?? null;
  }

  async function download() {
    const svg = getSvg();
    if (!svg) return;
    try {
      const blob = await svgToPngBlob(svg);
      downloadBlob(blob, getQrCodeFileName(game.slug, "png"));
      setError(false);
    } catch {
      setError(true);
    }
  }

  function print() {
    const svg = getSvg();
    if (!svg) return;
    const poster = window.open("", "_blank");
    if (!poster) return setError(true);

    poster.document.write(
      buildQrPosterHtml({
        lang: locale,
        title: game.name,
        headline: t("GameJoinQrCode.scanToJoin"),
        instructions: t("GameJoinQrCode.instructions"),
        url,
        svg: serializeSvg(svg),
      }),
    );
    poster.document.close();
    setError(false);
  }

  // the origin is only known client side: do not encode a relative link
  if (!/^https?:\/\//.test(url)) return null;

  return (
    <div className="mt-4">
      <label className="label">
        <span className="label-text">{t("GameJoinQrCode.title")}</span>
      </label>
      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
        <div ref={previewRef} className="bg-white p-2 rounded shrink-0">
          <QRCode
            value={url}
            size={160}
            level="M"
            title={t("GameJoinQrCode.scanToJoin")}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <p className="text-sm opacity-70">{t("GameJoinQrCode.hint")}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => setPresenting(true)}
            >
              📺 {t("GameJoinQrCode.present")}
            </button>
            <button type="button" className="btn btn-sm" onClick={download}>
              ⬇️ {t("GameJoinQrCode.download")}
            </button>
            <button type="button" className="btn btn-sm" onClick={print}>
              🖨️ {t("GameJoinQrCode.print")}
            </button>
          </div>
          {error && <p className="text-error text-sm">{t("GameJoinQrCode.error")}</p>}
        </div>
      </div>

      {presenting && (
        <dialog
          ref={presentationRef}
          aria-label={t("GameJoinQrCode.present")}
          className="m-0 p-0 w-screen h-screen max-w-none max-h-none bg-white text-black backdrop:bg-black"
          onClose={() => setPresenting(false)}
        >
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6 text-center">
            <button
              type="button"
              className="btn btn-circle btn-ghost absolute right-4 top-4 text-black"
              aria-label={t("GameJoinQrCode.close")}
              onClick={() => setPresenting(false)}
            >
              ✕
            </button>
            <h2 className="text-3xl md:text-5xl font-bold">{game.name}</h2>
            <p className="text-xl md:text-3xl">{t("GameJoinQrCode.scanToJoin")}</p>
            <div style={{ width: "min(65vh, 85vw)", height: "min(65vh, 85vw)" }}>
              <QRCode
                value={url}
                level="M"
                style={{ width: "100%", height: "100%" }}
                title={t("GameJoinQrCode.scanToJoin")}
              />
            </div>
            <p className="text-lg md:text-2xl">{t("GameJoinQrCode.instructions")}</p>
            <p className="font-mono text-sm md:text-lg break-all">{url}</p>
          </div>
        </dialog>
      )}
    </div>
  );
}
