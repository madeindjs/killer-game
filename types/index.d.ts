export interface PlayerRecord {
  id: string;
  name: string;
  private_token: string;
  game_id: string;
  action: string;
  order: number;
  killed_at: string | null;
  killed_by: string | null;
  /**
   * The token needed to kill this player
   */
  kill_token: number;
  /**
   * JSON configuration for https://github.com/dapi-labs/react-nice-avatar
   */
  avatar?: string | object;
}

export type GamePlayersTable = Array<{
  player: PlayerRecord;
  action: string;
  target: PlayerRecord;
}>;

export interface PlayerStatus {
  current: {
    player?: PlayerRecordSanitized;
    action?: string;
  };
  kills: Array<{ player: PlayerRecordSanitized; action: string }>;
}

export type PlayerRecordSanitized = Omit<
  PlayerRecord,
  | "private_token"
  | "order"
  | "action"
  | "kill_token"
  | "killed_at"
  | "killed_by"
>;

export interface GameRecord {
  id: string;
  name: string;
  slug: string;
  private_token: string;
  started_at?: string;
  finished_at?: string;
}

export type GameRecordSanitized = Omit<GameRecord, "private_token">;

export type GameCreateDTO = Pick<GameRecord, "name">;
export type GameUpdateDTO = Pick<GameRecord, "name" | "started_at">;

export type PlayerCreateDTO = Omit<
  PlayerRecord,
  | "id"
  | "private_token"
  | "order"
  | "killed_at"
  | "kill_token"
  | "killed_by"
  | "slug"
>;

export type PlayerUpdateDTO = Omit<PlayerRecord, "private_token">;

/**
 * Statistics about the game
 */
export interface GameDashboard {
  podium: {
    player: PlayerRecord;
    kills: PlayerRecord[];
  }[];
  events: {
    player: PlayerRecord;
    target: PlayerRecord;
    action: string;
    at: string;
  }[];
}

export interface ApplicationStats {
  counts: {
    games_started: number;
    games_finished: number;
    players_killed: number;
  };
  version: string;
}
