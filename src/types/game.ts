export interface NamedEntity {
  id: number;
  name: string;
}

export interface RelatedGame extends NamedEntity {
  slug: string;
  cover_image: string | null;
}

export interface GameSuggestion {
  name: string;
  slug: string;
  released: string | null;
}

export interface ApiErrorResponse {
  error: string;
}

export interface StoreListing {
  id: number | string;
  url: string;
  title?: string;
  year?: number;
  platform?: string;
  releaseFormat?: string;
  store: { name: string };
}

export interface GameVideo {
  name: string;
  video_id: string;
}

export interface GameWebsite {
  url: string;
  type: string;
}

export interface GameEdition {
  id: number;
  name: string;
  slug: string;
  first_release_date?: number;
}

export interface GameTimeToBeat {
  hastily?: number;
  normally?: number;
  completely?: number;
  count?: number;
}

export interface GameDetails {
  id: number;
  name: string;
  slug: string;
  tba?: boolean;
  released: string | null;
  description_raw: string;
  background_image: string | null;
  genres: NamedEntity[];
  platforms: NamedEntity[];
  developers: NamedEntity[];
  publishers: NamedEntity[];
  age_ratings: Array<{ id: number }>;
  esrb_rating: { name: string } | null;
  rating?: number;
  rating_count?: number;
  aggregated_rating?: number;
  aggregated_rating_count?: number;
  total_rating?: number;
  total_rating_count?: number;
  stores: StoreListing[];
  videos: GameVideo[];
  websites: GameWebsite[];
  website: string;
  reddit_url: string;
  similar_games: RelatedGame[];
  collection: NamedEntity | null;
  game_time_to_beat: GameTimeToBeat | null;
  updated: string | null;
}

export interface NotFoundGame {
  detail: "Not found.";
}

export type GameResult = GameDetails | NotFoundGame;

export interface Screenshot {
  id: number;
  image: string | null;
  width: number;
  height: number;
}

export interface ScreenshotResult {
  count: number;
  results: Screenshot[];
}

export interface EditionsResult {
  count: number;
  results: GameEdition[];
}
