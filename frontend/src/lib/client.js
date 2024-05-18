import { KillerClient } from "@killer-game/client";

export const client = new KillerClient(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001");
export const client2 = new KillerClient(`/api/v1/`);
