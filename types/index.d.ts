export interface PlayerRecord {
  id: string;
  name: string;
  private_token: string;
  game_id: string;
  action_id: string;
  order: number;
}

export interface GameRecord {
  id: string;
  name: string;
  private_token: string;
  started_at?: string;
}

export interface GameActionRecord {
  id: string;
  name: string;
  game_id: string;
}

export type GameCreateDTO = Pick<GameRecord, "name"> & {actions: string[]};

