"use client";
import { getRandomItemInArray } from "@/utils/array";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { useDefaultActions } from "../../hooks/use-default-actions";
import Modal from "../molecules/Modal";

/**
 * @typedef Props
 * @property {string} value
 * @property {(v: string) => void} onChange
 *
 * @param {Props} props
 */
export default function PlayerActionInput(props) {
  const t = useTranslations("games.PlayerForm");
  const actions = useDefaultActions();
  const id = useId();
  const datalistId = useId();

  /**
   * @param {any} e
   */
  function onRandomClick(e) {
    e.preventDefault();
    props.onChange(String(getRandomItemInArray(actions)));
  }

  return (
    <label className="form-control" htmlFor={id}>
      <div className="label">
        <span className="label-text">{t("actionField")}</span>
      </div>
      <div className="input input-bordered flex items-center gap-2">
        <input
          type="text"
          placeholder="Type here"
          className="grow"
          name="action"
          id={id}
          list={datalistId}
          onChange={(e) => props.onChange(e.target.value)}
          value={props.value}
        />
        <span className="badge badge-ghost cursor-pointer" onClick={onRandomClick}>
          🎲
        </span>
      </div>
      <datalist id={datalistId}>
        {actions.map((action, index) => (
          <option value={action} key={index}></option>
        ))}
      </datalist>
      <div className="label">
        <span className="label-text-alt"></span>
        <span className="label-text-alt">
          <PlayerActionsModal actions={actions} onSelect={(e) => props.onChange(e)} />
        </span>
      </div>
    </label>
  );
}

/**
 * @typedef PlayerActionsModalProps
 * @property {string[]} actions
 * @property {(v: string) => void} onSelect
 *
 *
 * @param {PlayerActionsModalProps} props
 */
function PlayerActionsModal(props) {
  const t = useTranslations("games.PlayerForm");
  const [isOpen, setIsOpen] = useState(false);

  /**
   * @param {string} action
   */
  function onSelect(action) {
    props.onSelect(action);
    setIsOpen(false);
  }

  return (
    <>
      <button className="btn btn-sm btn-link p-0" type="button" onClick={() => setIsOpen(true)}>
        {t("actionsExamples")}
      </button>
      <Modal
        isOpen={isOpen}
        onClosed={() => setIsOpen(false)}
        title={t("actionsExamples")}
        content={
          isOpen && (
            <ul className="flex flex-col gap-2">
              {props.actions.map((action, index) => (
                <li key={index} className="hover:cursor-pointer" onClick={() => onSelect(action)}>
                  {action}
                </li>
              ))}
            </ul>
          )
        }
      />
    </>
  );
}
