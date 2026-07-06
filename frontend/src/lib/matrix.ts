import { formatLeadMessage, type B2BLead } from "./leads";

export interface MatrixConfig {
  homeserver: string;
  accessToken: string;
  roomId: string;
}

export function getMatrixConfig(): MatrixConfig | null {
  const accessToken = process.env.MATRIX_ACCESS_TOKEN;
  if (!accessToken) return null;
  return {
    homeserver: process.env.MATRIX_HOMESERVER ?? "https://matrix.rsseau.fr",
    accessToken,
    roomId:
      process.env.MATRIX_ROOM_ID ?? "!PwwMTrItUOESnbsmVy:matrix.rsseau.fr",
  };
}

export async function sendMatrixMessage(
  config: MatrixConfig,
  body: string,
): Promise<string> {
  const txnId = `killer-lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const url =
    `${config.homeserver}/_matrix/client/v3/rooms/${encodeURIComponent(config.roomId)}` +
    `/send/m.room.message/${encodeURIComponent(txnId)}` +
    `?access_token=${encodeURIComponent(config.accessToken)}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ msgtype: "m.text", body }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Matrix send failed: ${res.status} ${res.statusText} ${text}`,
    );
  }

  const json = (await res.json()) as { event_id?: string };
  return json.event_id ?? txnId;
}

export async function sendLeadToMatrix(lead: B2BLead): Promise<string> {
  const config = getMatrixConfig();
  if (!config) {
    console.log(
      "[B2B_LEAD] MATRIX_ACCESS_TOKEN not set — logging lead instead:\n" +
        formatLeadMessage(lead),
    );
    return "logged";
  }
  return sendMatrixMessage(config, formatLeadMessage(lead));
}