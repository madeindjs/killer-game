import { useLocationOrigin } from "@/hooks/use-domain";
import { getPlayerKillUrl } from "@/lib/routes";
import Link from "next/link";
import QRCode from "react-qr-code";
import DevOnly from "../molecules/DevOnly";

/**
 * @typedef Props
 * @property {import("@killer-game/types").GameRecordSanitized} game
 * @property {import("@killer-game/types").PlayerRecord} player
 * @property {string} lang
 *
 * @param {Props} props
 */
export default function PlayerKillQrCode(props) {
  const origin = useLocationOrigin();
  const url = getPlayerKillUrl(props.game, props.player, props.lang, origin);

  return (
    <>
      <div className="bg-white p-1 inline-block">
        <QRCode value={url} />
      </div>
      <DevOnly>
        <Link className="text-black" href={url}>
          {url}
        </Link>
      </DevOnly>
    </>
  );
}
