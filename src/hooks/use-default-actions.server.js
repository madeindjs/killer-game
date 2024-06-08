import { getMessages } from "next-intl/server";

/**
 * @returns {string[]}
 */
export async function useDefaultActions() {
  const messages = await getMessages();
  const actions = messages.actions?.defaultActions;
  return Array.isArray(actions) ? actions : [];
}
