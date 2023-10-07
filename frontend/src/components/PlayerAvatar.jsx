import { useState } from "react";
import Avatar, { genConfig } from "react-nice-avatar";
import AvatarEditor from "./AvatarEditor";
import Modal from "./Modal";

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
  const [showModal, setShowModal] = useState();

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
        onClick={() => setShowModal((o) => !o)}
      >
        <Avatar
          className={"text-neutral-content rounded-full " + (size === "s" ? "w-12 " : "w-24 ")}
          {...avatarConfig}
        />
      </div>
      {editable && (
        <Modal
          isOpen={showModal}
          title="Edit the avatar"
          onClosed={() => setShowModal(false)}
          content={<AvatarEditor config={avatarConfig} onUpdate={onAvatarUpdate} />}
        />
      )}
    </>
  );
}
