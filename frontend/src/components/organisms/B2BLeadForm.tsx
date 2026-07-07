"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const COMPANY_SIZE_KEYS = ["s1", "s2", "s3", "s4", "s5"] as const;
const EVENT_TYPE_KEYS = [
  "seminar",
  "offsite",
  "teamBuilding",
  "afterwork",
  "other",
] as const;

export default function B2BLeadForm() {
  const t = useTranslations("b2b.leadForm");
  const lang = useLocale();

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? "").trim(),
      companySize: String(formData.get("companySize") ?? "").trim(),
      eventType: String(formData.get("eventType") ?? "").trim(),
      eventDate: String(formData.get("eventDate") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      locale: lang,
      honeypot: String(formData.get("website") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("success");
        return;
      }

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      const code = data.error ?? "server";

      if (code === "spam") {
        setStatus("success");
        return;
      }

      const fieldMap: Record<string, string> = {
        emailRequired: "email",
        emailInvalid: "email",
        companySizeRequired: "companySize",
        eventTypeRequired: "eventType",
      };
      const field = fieldMap[code];
      if (field) {
        setFieldErrors({ [field]: t(`validation.${code}`) });
        setStatus("idle");
      } else {
        setErrorMsg(t("error"));
        setStatus("error");
      }
    } catch {
      setErrorMsg(t("error"));
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="alert alert-success shadow-lg"
        role="status"
        data-testid="b2b-lead-success"
      >
        <span>✅ {t("success")}</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card bg-base-100 shadow-xl border border-base-200"
      data-testid="b2b-lead-form"
      noValidate
    >
      <div className="card-body">
        <h3 className="card-title text-2xl">{t("title")}</h3>
        <p className="opacity-80 mb-2">{t("subtitle")}</p>

        {status === "error" && errorMsg && (
          <div className="alert alert-error" role="alert">
            <span>{errorMsg}</span>
          </div>
        )}

        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          value=""
          onChange={() => {}}
        />

        <label className="form-control">
          <span className="label label-text font-semibold">{t("email")}</span>
          <input
            type="email"
            name="email"
            required
            placeholder={t("emailPlaceholder")}
            className="input input-bordered w-full min-h-[2.75rem]"
            aria-invalid={fieldErrors.email ? "true" : "false"}
            autoComplete="email"
            inputMode="email"
            enterKeyHint="next"
          />
          {fieldErrors.email && (
            <span className="label label-text-alt text-error">
              {fieldErrors.email}
            </span>
          )}
        </label>

        <label className="form-control">
          <span className="label label-text font-semibold">
            {t("companySize")}
          </span>
          <select
            name="companySize"
            required
            defaultValue=""
            className="select select-bordered w-full"
            aria-invalid={fieldErrors.companySize ? "true" : "false"}
          >
            <option value="" disabled>
              —
            </option>
            {COMPANY_SIZE_KEYS.map((k) => (
              <option key={k} value={k}>
                {t(`companySizes.${k}`)}
              </option>
            ))}
          </select>
          {fieldErrors.companySize && (
            <span className="label label-text-alt text-error">
              {fieldErrors.companySize}
            </span>
          )}
        </label>

        <label className="form-control">
          <span className="label label-text font-semibold">
            {t("eventType")}
          </span>
          <select
            name="eventType"
            required
            defaultValue=""
            className="select select-bordered w-full"
            aria-invalid={fieldErrors.eventType ? "true" : "false"}
          >
            <option value="" disabled>
              —
            </option>
            {EVENT_TYPE_KEYS.map((k) => (
              <option key={k} value={k}>
                {t(`eventTypes.${k}`)}
              </option>
            ))}
          </select>
          {fieldErrors.eventType && (
            <span className="label label-text-alt text-error">
              {fieldErrors.eventType}
            </span>
          )}
        </label>

        <label className="form-control">
          <span className="label label-text font-semibold">
            {t("eventDate")}
          </span>
          <input
            type="month"
            name="eventDate"
            className="input input-bordered w-full"
          />
          <span className="label label-text-alt opacity-70">
            {t("eventDateHint")}
          </span>
        </label>

        <label className="form-control">
          <span className="label label-text font-semibold">{t("message")}</span>
          <textarea
            name="message"
            rows={4}
            placeholder={t("messagePlaceholder")}
            className="textarea textarea-bordered w-full"
          />
        </label>

        <button
          type="submit"
          className="btn btn-primary w-full min-h-[2.75rem]"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? t("submitting") : t("submit")}
        </button>
      </div>
    </form>
  );
}