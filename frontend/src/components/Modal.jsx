/**
 * @typedef Props
 * @property {JSX.Element | string} title
 * @property {JSX.Element | string} content
 * @property {JSX.Element | string} [actions]
 * @property {boolean} isOpen
 * @property {() => void} [onOpened]
 * @property {() => void} [onClosed]
 */

import { useEffect, useRef } from "react";

/**
 * @param {Props} param0
 * @returns
 */
export default function Modal({ title, content, isOpen, onClosed, onOpened, actions }) {
  const modal = useRef();

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
    <dialog id="my_modal_1" className="modal" ref={modal}>
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => onClosed?.()}
            aria-label="Close the modal"
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-2xl text-bold">{title}</h3>
        <div className="py-4">{content}</div>
        {actions && <div className="modal-action">{actions}</div>}
      </div>
    </dialog>
  );
}
