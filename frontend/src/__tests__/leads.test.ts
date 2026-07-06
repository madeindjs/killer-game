import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/leads/route";
import { validateLead, formatLeadMessage } from "@/lib/leads";

vi.mock("@/lib/matrix", () => ({
  sendLeadToMatrix: vi.fn(async () => "event-id-mock"),
}));

import { sendLeadToMatrix } from "@/lib/matrix";

function jsonReq(body: unknown): Request {
  return new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("/api/leads POST", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it("returns 400 for invalid JSON body", async () => {
    const req = new Request("http://localhost/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when email is missing", async () => {
    const res = await POST(
      jsonReq({ companySize: "s2", eventType: "seminar" }),
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("emailRequired");
    expect(sendLeadToMatrix).not.toHaveBeenCalled();
  });

  it("returns 400 when companySize is invalid", async () => {
    const res = await POST(
      jsonReq({ email: "a@b.com", companySize: "huge", eventType: "seminar" }),
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("companySizeRequired");
  });

  it("returns 400 when eventType is invalid", async () => {
    const res = await POST(
      jsonReq({ email: "a@b.com", companySize: "s2", eventType: "party" }),
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("eventTypeRequired");
  });

  it("accepts a valid lead and forwards to Matrix", async () => {
    const res = await POST(
      jsonReq({
        email: "alice@corp.com",
        companySize: "s3",
        eventType: "offsite",
        eventDate: "2026-09",
        message: "Looking for an offsite activity",
        locale: "fr",
      }),
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(sendLeadToMatrix).toHaveBeenCalledTimes(1);
    const lead = (sendLeadToMatrix as unknown as ReturnType<typeof vi.fn>)
      .mock.calls[0][0];
    expect(lead.email).toBe("alice@corp.com");
    expect(lead.companySize).toBe("s3");
    expect(lead.eventType).toBe("offsite");
  });

  it("treats a filled honeypot as spam (returns 400, does not send)", async () => {
    const res = await POST(
      jsonReq({
        email: "spam@x.com",
        companySize: "s1",
        eventType: "other",
        honeypot: "https://spam.example",
      }),
    );
    expect(res.status).toBe(400);
    expect(sendLeadToMatrix).not.toHaveBeenCalled();
  });

  it("returns 500 when Matrix send fails", async () => {
    vi.mocked(sendLeadToMatrix).mockRejectedValueOnce(new Error("boom"));
    const res = await POST(
      jsonReq({ email: "a@b.com", companySize: "s1", eventType: "other" }),
    );
    expect(res.status).toBe(500);
  });
});

describe("leads validation helpers", () => {
  it("validateLead trims and clamps long fields", () => {
    const r = validateLead({
      email: "  a@b.com  ",
      companySize: "s1",
      eventType: "other",
      message: "x".repeat(5000),
    });
    expect(r.ok).toBe(true);
    expect(r.lead?.email).toBe("a@b.com");
    expect(r.lead?.message?.length).toBe(2000);
  });

  it("formatLeadMessage contains the key fields", () => {
    const msg = formatLeadMessage({
      email: "a@b.com",
      companySize: "s2",
      eventType: "seminar",
      eventDate: "2026-09",
      message: "hi",
      locale: "en",
    });
    expect(msg).toContain("a@b.com");
    expect(msg).toContain("s2");
    expect(msg).toContain("seminar");
    expect(msg).toContain("2026-09");
    expect(msg).toContain("hi");
  });
});