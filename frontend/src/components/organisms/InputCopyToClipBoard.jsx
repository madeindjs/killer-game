"use client";
import useTranslation from "next-translate/useTranslation";
import { useRef, useState } from "react";

/**
 * @typedef Props
 * @property {string} value
 *
 * @param {Props} param0
 */
export default function InputCopyToClipBoard({ value }) {
  const inputRef = useRef(null);
  const [message, setMessage] = useState();
  const { t } = useTranslation("games");

  function copyToClipboard() {
    inputRef.current.select();
    document.execCommand("copy");
    setMessage(t("GameJoinLink.copiedToTheClipboard"));
    setTimeout(() => setMessage(undefined), 5_000);
  }

  return (
    <>
      <input
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
