"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import Modal from "../molecules/Modal";

/**
 * @typedef KilledQrCodeButtonProps
 * @property {import("@killer-game/types").PlayerRecord} player
 *
 * @param {KilledQrCodeButtonProps} param0
 */
export default function KilledQrCodeButton({ player }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("player-dashboard");

  let url = "";

  useEffect(() => {}, [player.kill_token]);

  return (
    <>
      <Modal
        onClosed={() => setIsOpen(false)}
        title={t("KilledQrCodeButton.modal.title")}
        isOpen={isOpen}
        content={
          isOpen && (
            <>
              <QRCode value={"hello"} c />
            </>
          )
        }
      />
      <button className="btn btn-secondary" onClick={() => setIsOpen(!isOpen)}>
        💀 {t("KilledQrCodeButton.showQrCode")}
      </button>
    </>
  );
}
