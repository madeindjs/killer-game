import { useRef, useState } from "react";
import Avatar, { genConfig } from "react-nice-avatar";
import AvatarEditor from "./AvatarEditor";

/**
 * @param {{player: import('@killer-game/types').PlayerRecord, size?: 'm' | 's', editable?: boolean}} param0
 */
export default function PlayerAvatar({ player, size = "m", editable }) {
  // todo: update on backend side
  const [config, setConfig] = useState(genConfig(player.name));
  const modal = useRef();

  function showModal() {
    if (!editable) return;
    modal.current.showModal();
  }

  return (
    <>
      <div
        className={`avatar placeholder ` + (editable ? "cursor-pointer" : "")}
        title={player.name}
        onClick={showModal}
      >
        <Avatar className={"text-neutral-content rounded-full " + (size === "s" ? "w-12 " : "w-24 ")} {...config} />
      </div>
      {editable && (
        <dialog id="my_modal_1" className="modal" ref={modal}>
          <div className="modal-box">
            <h3 className="font-bold text-lg">Edit the avatar</h3>
            <div className="py-4">
              <AvatarEditor config={config} onUpdate={setConfig} />
            </div>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
