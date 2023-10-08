export interface PlayerRecord {
  id: string;
  name: string;
  private_token: string;
  game_id: string;
  action_id: string;
  order: number;
  /**
   * JSON configuration for https://github.com/dapi-labs/react-nice-avatar
   */
  avatar?: string | object
}

export type PlayerRecordSanitized = Omit<PlayerRecord, 'private_token' | 'order' | 'action_id'>


export interface GameRecord {
  id: string;
  name: string;
  private_token: string;
  started_at?: string;
}

export type GameRecordSanitized = Omit<GameRecord, 'private_token'>

export interface GameActionRecord {
  id: string;
  name: string;
  game_id: string;
}

export type GameActionCreateDTO = Pick<GameActionRecord, 'name'>

export type GameCreateDTO = Pick<GameRecord, "name"> & {actions: GameActionCreateDTO[]};

export type PlayerCreateDTO = Omit<PlayerRecord, 'id' | 'private_token' | 'order'>

export type PlayerUpdateDTO = Omit<PlayerRecord, 'id' | 'private_token'>
