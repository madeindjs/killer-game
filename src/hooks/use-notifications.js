export function useNotifications() {
  /**
   * @param {string} message
   * @returns {}
   */
  async function notify(message) {
    if (!("Notification" in window)) {
      return;
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      return new Notification(message);
      // …
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          return new Notification(message);
        }
      } catch (error) {
        console.error(error);
        return;
      }
    }
  }

  return { notify };
}
