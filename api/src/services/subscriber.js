import "../model.js";

export const SubscriberEventNames = {
  GameCreated: "GameCreated",
  GameUpdated: "GameUpdated",
  GameDeleted: "GameDeleted",
  PlayerCreated: "PlayerCreated",
  PlayerUpdated: "PlayerUpdated",
  PlayerDeleted: "PlayerDeleted",
};

/**
 * @typedef {keyof typeof SubscriberEventNames} SubscriberEventKeys
 * @typedef {typeof SubscriberEventNames[SubscriberEventKeys]} SubscriberEventName
 * @typedef {any} SubscriberEventPayload
 * @typedef {(event: SubscriberEventName, payload: SubscriberEventPayload) => void} SubscriberHandler
 */

export class Subscriber {
  /**
   * @type {Set<SubscriberHandler>}
   */
  #handler = new Set();

  /**
   * @param {SubscriberHandler} handler
   */
  add(handler) {
    console.log("add sub");

    this.#handler.add(handler);
  }

  /**
   * @param {SubscriberHandler} handler
   */
  delete(handler) {
    console.log("delete sub");
    this.#handler.delete(handler);
  }

  /**
   * @param {SubscriberEventName} event
   * @param {SubscriberEventPayload} event
   */
  emit(event, payload) {
    for (const handler of this.#handler) {
      handler(event, payload);
    }
  }
}
