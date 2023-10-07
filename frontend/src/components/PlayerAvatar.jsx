import { useRef } from "react";
import Avatar, { genConfig } from "react-nice-avatar";
import AvatarEditor from "./AvatarEditor";

/**
 * @typedef Props
 * @property {import('@killer-game/types').PlayerRecord} player
 * @property {'m' | 's'} [size]
 * @property {boolean} [editable]
 * @property {(config: AvatarConfig) => void} [onAvatarUpdate]
 */

/**
 * @param {Props} param0
 */
export default function PlayerAvatar({ player, size = "m", editable, onAvatarUpdate }) {
  const modal = useRef();

  function showModal() {
    if (!editable) return;
    modal.current.showModal();
  }

  let avatarConfig = undefined;

  switch (typeof player.avatar) {
    case "undefined":
      avatarConfig = genConfig(player.name);
      break;
    case "object":
      avatarConfig = player.avatar;
      break;
    case "string":
      avatarConfig = JSON.parse(player.avatar);
      break;
  }

  return (
    <>
      <div
        className={`avatar placeholder ` + (editable ? "cursor-pointer" : "")}
        title={player.name}
        onClick={showModal}
      >
        <Avatar
          className={"text-neutral-content rounded-full " + (size === "s" ? "w-12 " : "w-24 ")}
          {...avatarConfig}
        />
      </div>
      {editable && (
        <dialog id="my_modal_1" className="modal" ref={modal}>
          <div className="modal-box">
            <h3 className="font-bold text-lg">Edit the avatar</h3>
            <div className="py-4">
              <AvatarEditor config={avatarConfig} onUpdate={onAvatarUpdate} />
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
