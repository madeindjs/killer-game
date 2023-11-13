import InputWithLabel from "../atoms/InputWithLabel";
import PlayersAvatars from "../organisms/PlayersAvatars";

/**
 * @typedef ActionEditorProps
 * @property {import("@killer-game/types").GameActionRecord} action
 * @property {import("@killer-game/types").PlayerRecord[]} players
 * @property {(action: import("@killer-game/types").GameActionRecord) => void} onActionCreate
 * @property {(action: import("@killer-game/types").GameActionRecord) => void} onActionUpdate
 * @property {(action: import("@killer-game/types").GameActionRecord) => void} onActionRemove
 *
 * @param {ActionEditorProps} param0
 */
function ActionEditor({ action, players }) {
  return (
    <div>
      <InputWithLabel name="name" label="Action" value={action.name} />
      <PlayersAvatars players={players} />
    </div>
  );
}

/**
 * @typedef ActionsEditorProps
 * @property {import("@killer-game/types").GameActionRecord[]} actions
 * @property {import("@killer-game/types").PlayerRecord[]} players
 * @property {(action: import("@killer-game/types").GameActionRecord) => void} onActionCreate
 * @property {(action: import("@killer-game/types").GameActionRecord) => void} onActionUpdate
 * @property {(action: import("@killer-game/types").GameActionRecord) => void} onActionRemove
 *
 * @param {ActionsEditorProps} param0
 */
export default function ActionsEditor({ actions, players }) {
  const getPlayersForAction = useCallback((actionId) => players.filter((p) => p.action_id === actionId), [players]);

  return (
    <div>
      {actions.map((action) => (
        <ActionEditor key={action.id} action={action} players={getPlayersForAction(action.id)} />
      ))}
    </div>
  );
}
