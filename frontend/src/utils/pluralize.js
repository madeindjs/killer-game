export function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural;
}

export const pluralizePlayers = (count) => `${count} ${pluralize(count, "player", "players")}`;
