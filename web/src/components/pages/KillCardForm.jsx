"use client";

const { client } = require("@/lib/client");
const { useState } = require("react");
const { default: InputWithLabel } = require("../atoms/InputWithLabel");

/**
 * @typedef KillCardFormProps
 * @property {string} playerId
 * @property {string} privateToken
 * @property {string} targetId
 * @property {() => void} [onKill]
 *
 *
 * @param {KillCardFormProps} param0
 */
export default function KillCardForm({ playerId, privateToken, targetId, onKill, disabled }) {
  const [killToken, setKillToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState();

  function handleSubmit(event) {
    event.preventDefault();
    console.log(privateToken);
    setBusy(true);
    setError(undefined);
    client
      .killPlayer(playerId, privateToken, targetId, killToken)
      .then(() => onKill?.())
      .catch(setError)
      .finally(() => setBusy(false));
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={busy} className="w-full">
      <InputWithLabel
        label="Secret token of the player"
        name="name"
        onChange={setKillToken}
        value={killToken}
        className="mb-3"
        readOnly={busy}
        error={error}
        required
      />
      <div className="text-center">
        <input
          type="submit"
          className="btn btn-primary"
          disabled={busy || disabled}
          value="I accomplished the mission"
        />
      </div>
    </form>
  );
}
