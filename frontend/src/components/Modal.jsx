/**
 * @typedef Props
 * @property {JSX.Element | string} title
 * @property {JSX.Element | string} content
 * @property {boolean} isOpen
 * @property {() => void} [onOpened]
 * @property {() => void} [onClosed]
 */

import { useEffect, useRef } from "react";

/**
 * @param {Props} param0
 * @returns
 */
export default function Modal({ title, content, isOpen, onClosed, onOpened }) {
  const modal = useRef();

  useEffect(() => {
    if (isOpen) {
      modal.current.showModal();
      onOpened?.();
    } else {
      modal.current.close();
      onClosed?.();
    }
  }, [isOpen]);

  return (
    <dialog id="my_modal_1" className="modal" ref={modal}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="py-4">{content}</div>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn" onClick={() => onClosed?.()}>
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
