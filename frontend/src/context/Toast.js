import { createContext, useState } from "react";

export const ToastContext = createContext({
  toast: [],
  /**
   * @param {string} level
   * @param {string} message
   */
  push: (level, message) => {},
});

/**
 * @param {{level: string, message: string, onClick: () => void}} param0
 * @returns
 */
function Toast({ level, message, onClick }) {
  return (
    <div className={"cursor-pointer alert alert-" + level} onClick={onClick}>
      <span>{message}</span>
    </div>
  );
}

/**
 * @param {{children: JSX.Element}} param0
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function isSameToast(a, b) {
    return a.level === b.level && a.message === b.message;
  }

  /**
   * @param {string} level
   * @param {string} message
   */
  function push(level, message) {
    setToasts((old) => {
      const toast = { level, message };
      if (old.some((t) => isSameToast(t, toast))) return old;

      setTimeout(() => removeToast(toast), 5_000);
      return [...old, toast];
    });
  }

  function removeToast(toast) {
    setToasts((old) => old.filter((t) => !isSameToast(toast, t)));
  }

  return (
    <ToastContext.Provider value={{ toasts, push }}>
      {children}
      <div className="toast ">
        {toasts.map((toast) => (
          <Toast key={toast.id} level={toast.level} message={toast.message} onClick={() => removeToast(toast)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
