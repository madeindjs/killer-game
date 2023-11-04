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
 * @param {{level: string, message: string}} param0
 * @returns
 */
function Toast({ level, message }) {
  // TODO: level
  return (
    <div className={"alert alert-" + level}>
      <span>{message}</span>
    </div>
  );
}

/**
 * @param {{children: JSX.Element}} param0
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  /**
   * @param {string} level
   * @param {string} message
   */
  function push(level, message) {
    const id = Date.now();
    setToasts((old) => [...old, { level, message, id }]);
    setTimeout(() => setToasts((old) => old.filter((t) => t.id !== id)), 5_000);
  }

  return (
    <ToastContext.Provider value={{ toasts, push }}>
      {children}
      <div className="toast">
        {toasts.map((toast) => (
          <Toast key={toast.id} level={toast.level} message={toast.message}></Toast>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
