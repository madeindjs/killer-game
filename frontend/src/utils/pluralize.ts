export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

export function pluralizePlayers(count: number): string {
  return `${count} ${pluralize(count, "player", "players")}`;
}

export function pluralizeKills(count: number): string {
  return `${count} ${pluralize(count, "kill", "kills")}`;
}