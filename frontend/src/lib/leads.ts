export interface B2BLead {
  email: string;
  companySize: string;
  eventType: string;
  eventDate?: string;
  message?: string;
  locale?: string;
  honeypot?: string;
}

export const COMPANY_SIZES = ["s1", "s2", "s3", "s4", "s5"] as const;
export type CompanySize = (typeof COMPANY_SIZES)[number];

export const EVENT_TYPES = [
  "seminar",
  "offsite",
  "teamBuilding",
  "afterwork",
  "other",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ValidationResult {
  ok: boolean;
  error?: string;
  lead?: B2BLead;
}

export function validateLead(input: Partial<B2BLead>): ValidationResult {
  if (input.honeypot && input.honeypot.trim() !== "") {
    return { ok: false, error: "spam" };
  }

  const email = (input.email ?? "").trim();
  if (!email) return { ok: false, error: "emailRequired" };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "emailInvalid" };

  const companySize = (input.companySize ?? "").trim();
  if (!(COMPANY_SIZES as readonly string[]).includes(companySize)) {
    return { ok: false, error: "companySizeRequired" };
  }

  const eventType = (input.eventType ?? "").trim();
  if (!(EVENT_TYPES as readonly string[]).includes(eventType)) {
    return { ok: false, error: "eventTypeRequired" };
  }

  const eventDate = (input.eventDate ?? "").trim().slice(0, 32) || undefined;
  const message = (input.message ?? "").trim().slice(0, 2000) || undefined;
  const locale = (input.locale ?? "").trim().slice(0, 8) || undefined;

  return {
    ok: true,
    lead: { email, companySize, eventType, eventDate, message, locale },
  };
}

export function formatLeadMessage(lead: B2BLead): string {
  const lines = [
    "🎯 New B2B / team-building lead",
    `• Email: ${lead.email}`,
    `• Company size: ${lead.companySize}`,
    `• Event type: ${lead.eventType}`,
  ];
  if (lead.eventDate) lines.push(`• Approx. date: ${lead.eventDate}`);
  if (lead.locale) lines.push(`• Locale: ${lead.locale}`);
  if (lead.message) lines.push(`• Message: ${lead.message}`);
  return lines.join("\n");
}