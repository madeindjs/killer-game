import { useMessages } from "next-intl";

/**
 * @returns {string[]}
 */
export function useDefaultActions() {
  const messages = useMessages();
  const actions = messages.actions?.defaultActions;
  return Array.isArray(actions) ? actions : [];
}
