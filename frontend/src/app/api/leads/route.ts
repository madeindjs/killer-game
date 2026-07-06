import { sendLeadToMatrix } from "@/lib/matrix";
import { validateLead } from "@/lib/leads";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalidBody" }, { status: 400 });
  }

  const result = validateLead((body ?? {}) as Record<string, unknown>);
  if (!result.ok || !result.lead) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    await sendLeadToMatrix(result.lead);
  } catch (err) {
    console.error("[B2B_LEAD] failed to send lead:", err);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}