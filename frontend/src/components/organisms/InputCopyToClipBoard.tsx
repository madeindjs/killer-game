"use client";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

interface Props {
  value: string;
  /** Lets a `<label htmlFor>` target the input. */
  id?: string;
  /** Accessible name when there is no visible label. */
  "aria-label"?: string;
}

export default function InputCopyToClipBoard({ value, id, "aria-label": ariaLabel }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | undefined>();
  const t = useTranslations("games");

  function copyToClipboard() {
    inputRef.current?.select();
    document.execCommand("copy");
    setMessage(t("GameJoinLink.copiedToTheClipboard"));
    setTimeout(() => setMessage(undefined), 5_000);
  }

  return (
    <>
      <input
        id={id}
        aria-label={ariaLabel}
        type="text"
        className="input input-bordered w-full"
        readOnly
        value={value}
        onClick={copyToClipboard}
        ref={inputRef}
      />
      {message && <p className="text-success mt-2">{message}</p>}
    </>
  );
}
