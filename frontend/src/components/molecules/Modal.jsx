/**
 * @import { ReactNode } from "react";
 *
 * @typedef Props
 * @property {ReactNode | string} title
 * @property {ReactNode | string | false} content
 * @property {ReactNode | string} [actions]
 * @property {boolean} isOpen
 * @property {() => void} [onOpened]
 * @property {() => void} [onClosed]
 */

import { useEffect, useId, useRef } from "react";

/**
 * @param {Props} param0
 * @returns
 */
export default function Modal({
  title,
  content,
  isOpen,
  onClosed,
  onOpened,
  actions,
}) {
  // @ts-ignore
  const modal = useRef();
  const id = useId();

  useEffect(() => {
    if (isOpen) {
      modal.current.showModal();
      onOpened?.();
    } else {
      modal.current.close();
      onClosed?.();
    }
  }, [isOpen, onClosed, onOpened]);

  return (
    <dialog id={id} className="modal" ref={modal}>
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => onClosed?.()}
          aria-label="Close the modal"
          type="button"
        >
          ✕
        </button>
        <h3 className="font-bold text-2xl text-bold">{title}</h3>
        <div className="py-4">{content}</div>
        {actions && <div className="modal-action">{actions}</div>}
      </div>
    </dialog>
  );
}
