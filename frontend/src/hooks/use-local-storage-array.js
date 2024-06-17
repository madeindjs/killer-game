import { useCallback, useEffect, useState } from "react";

function getLocalStorageJSON(key) {
  const gamesStr = localStorage.getItem(key);
  if (!gamesStr) return [];

  try {
    return JSON.parse(gamesStr);
  } catch (error) {
    console.error(error);
    localStorage.removeItem(key);
    return [];
  }
}

/**
 * @template {import("@killer-game/types").GameRecord} T
 * @param {string} key
 * @returns {{addItem: (v: T) => void, removeItem: (v: T) => void, items: T[], getItems: T[]}}
 */
export function useLocalStorageArray(key) {
  const [items, _setItems] = useState([]);

  /** @param {T} newItem */
  function setItems(newItem) {
    console.trace();
    try {
      localStorage.setItem(key, JSON.stringify(newItem));
    } catch (error) {
      console.error(`Cannot set item in localStorage ${error}`);
    }
    _setItems(newItem);
  }

  /** @returns {T[]} */
  const getItems = useCallback(() => getLocalStorageJSON(key), [key]);

  /**
   *
   * @param {T} game
   */
  function removeItem(game) {
    setItems(items.filter((g) => g.id !== game.id));
  }

  /**
   *
   * @param {T} game
   */
  function addItem(game) {
    setItems([...items, game]);
  }

  useEffect(() => {
    _setItems(getItems());
  }, [_setItems, getItems]);

  return { addItem, removeItem, items, getItems };
}
