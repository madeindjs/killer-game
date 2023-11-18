export interface PlayerRecord {
  id: string;
  name: string;
  private_token: string;
  game_id: string;
  action_id: string;
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
  action: GameActionRecord;
  target: PlayerRecord;
}>;

export interface PlayerStatus {
  current: {
    player?: PlayerRecordSanitized;
    action?: GameActionRecord;
  };
  kills: Array<{player: PlayerRecordSanitized; action: GameActionRecord}>;
}

export type PlayerRecordSanitized = Omit<
  PlayerRecord,
  "private_token" | "order" | "action_id" | "kill_token" | "killed_at" | "killed_by"
>;

export interface GameRecord {
  id: string;
  name: string;
  private_token: string;
  started_at?: string;
  finished_at?: string;
}

export type GameRecordSanitized = Omit<GameRecord, "private_token">;

export interface GameActionRecord {
  id: string;
  name: string;
  game_id: string;
}

export type GameActionCreateDTO = Pick<GameActionRecord, "name">;

export type GameCreateDTO = Pick<GameRecord, "name"> & {actions: GameActionCreateDTO[]};

export type PlayerCreateDTO = Omit<
  PlayerRecord,
  "id" | "private_token" | "order" | "killed_at" | "kill_token" | "killed_by"
>;

export type PlayerUpdateDTO = Omit<PlayerRecord, "id" | "private_token">;

/**
 * Statsitic about the game
 */
export interface GameDashboard {
  podium: {
    player: PlayerRecord;
    kills: PlayerRecord[];
  }[];
  events: {
    player: PlayerRecord;
    target: PlayerRecord;
    action: GameActionRecord;
    at: string;
  }[];
}
