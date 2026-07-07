import { useId } from "react";

type InputType = "text" | "email" | "tel" | "url" | "search" | "password" | "number";

interface InputWithLabelProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  name: string;
  required?: boolean;
  readOnly?: boolean;
  className?: string;
  inputClassName?: string;
  error?: unknown;
  type?: InputType;
  placeholder?: string;
  hint?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "url" | "search" | "numeric" | "decimal" | "none";
  enterKeyHint?: "enter" | "done" | "go" | "next" | "previous" | "search" | "send";
}

export default function InputWithLabel({
  value,
  onChange,
  label,
  name,
  required,
  className,
  readOnly,
  inputClassName,
  error,
  type = "text",
  placeholder,
  hint,
  autoComplete,
  inputMode,
  enterKeyHint,
}: InputWithLabelProps) {
  const id = useId();
  return (
    <div className={"form-control w-full " + (className ?? "")}>
      {label && (
        <label className={"label " + (inputClassName ?? "")} htmlFor={id}>
          <span className="label-text">{label}</span>
        </label>
      )}
      <input
        className={"input input-bordered input-primary w-full min-h-[2.75rem] " + (error ? "input-error" : "")}
        type={type}
        name={name}
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        readOnly={readOnly}
        autoComplete={autoComplete}
        inputMode={inputMode}
        enterKeyHint={enterKeyHint}
      />
      {hint && <p className="text-sm text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}