export interface Game {
  appid: number;
  name: string;
  playtime_forever?: number;
}

export interface SteamApiResponse {
  response?: {
    game_count?: number;
    games?: Game[];
  };
}

export interface SteamFormData {
  apiKey: string;
  steamId: string;
}