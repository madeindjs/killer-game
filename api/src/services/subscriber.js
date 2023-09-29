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
 * @typedef {(gameId: string, event: SubscriberEventName, payload: SubscriberEventPayload) => void} SubscriberHandler
 */

export class Subscriber {
  /** @type {Set<SubscriberHandler>} */
  #handler = new Set();
  /** @type {import('fastify').FastifyBaseLogger} */
  #logger;

  /**
   * @param {import('fastify').FastifyBaseLogger} logger
   */
  constructor(logger) {
    this.#logger = logger;
  }

  /**
   * @param {SubscriberHandler} handler
   */
  add(handler) {
    this.#logger.debug("[Subscriber] add subscription");
    this.#handler.add(handler);
  }

  /**
   * @param {SubscriberHandler} handler
   */
  delete(handler) {
    this.#logger.debug("[Subscriber] remove subscription");
    this.#handler.delete(handler);
  }

  /**
   * @param {string} gameId
   * @param {SubscriberEventName} event
   * @param {SubscriberEventPayload} event
   */
  emit(gameId, event, payload) {
    for (const handler of this.#handler) {
      handler(gameId, event, payload);
    }
  }
}
