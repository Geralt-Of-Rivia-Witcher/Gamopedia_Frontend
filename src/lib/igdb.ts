import "server-only";
import { cache } from "react";
import type {
  EditionsResult,
  GameDetails,
  GameResult,
  GameSuggestion,
  GameTimeToBeat,
  ScreenshotResult,
} from "@/types/game";

interface IGDBNamed {
  id: number;
  name: string;
}
interface IGDBCompanyCredit {
  developer?: boolean;
  publisher?: boolean;
  company?: IGDBNamed;
}
interface IGDBWebsite {
  url: string;
  type?: { type: string };
}
interface IGDBExternalGame {
  id: number;
  url?: string;
  name?: string;
  year?: number;
  game_release_format?: { format: string };
  external_game_source?: { name: string };
  platform?: IGDBNamed;
}
interface IGDBVideo {
  name?: string;
  video_id?: string;
}
interface IGDBAgeRating {
  id?: number;
  organization?: { name: string };
  rating_category?: { rating: string };
}
interface IGDBGame {
  id: number;
  name: string;
  slug: string;
  first_release_date?: number;
  summary?: string;
  storyline?: string;
  cover?: { image_id?: string };
  artworks?: Array<{ image_id?: string }>;
  genres?: IGDBNamed[];
  platforms?: IGDBNamed[];
  involved_companies?: IGDBCompanyCredit[];
  age_ratings?: IGDBAgeRating[];
  rating?: number;
  rating_count?: number;
  aggregated_rating?: number;
  aggregated_rating_count?: number;
  total_rating?: number;
  total_rating_count?: number;
  websites?: IGDBWebsite[];
  external_games?: IGDBExternalGame[];
  videos?: IGDBVideo[];
  similar_games?: IGDBNamed[];
  collections?: IGDBNamed[];
  updated_at?: number;
}
interface IGDBGameReference {
  id: number;
  slug: string;
}
interface IGDBSuggestion {
  name: string;
  slug: string;
  first_release_date?: number;
}
interface IGDBEdition {
  id: number;
  name: string;
  slug: string;
  first_release_date?: number;
}
interface IGDBScreenshot {
  id: number;
  image_id?: string;
  width: number;
  height: number;
}
interface IGDBTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}
interface CachedValue<T> {
  data: T;
  timestamp: number;
}
class IGDBRequestError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly authentication = false,
  ) {
    super(message);
    this.name = "IGDBRequestError";
  }
}

function hasVideoId(video: IGDBVideo): video is IGDBVideo & { video_id: string } {
  return typeof video.video_id === "string" && /^[A-Za-z0-9_-]+$/.test(video.video_id);
}

const IGDB_API = "https://api.igdb.com/v4";
const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const SEARCH_TTL = 5 * 60 * 1000;
const RESPONSE_TTL = 5 * 60 * 1000;
const searchCache = new Map<string, CachedValue<GameSuggestion[]>>();
const gameCache = new Map<string, CachedValue<IGDBGame[]>>();
const referenceCache = new Map<string, CachedValue<IGDBGameReference[]>>();
const suggestionCache = new Map<string, CachedValue<IGDBSuggestion[]>>();
const editionCache = new Map<string, CachedValue<IGDBEdition[]>>();
const screenshotCache = new Map<string, CachedValue<IGDBScreenshot[]>>();
const timeCache = new Map<string, CachedValue<GameTimeToBeat[]>>();
const pendingGames = new Map<string, Promise<IGDBGame[]>>();
const pendingReferences = new Map<string, Promise<IGDBGameReference[]>>();
const pendingSuggestions = new Map<string, Promise<IGDBSuggestion[]>>();
const pendingEditions = new Map<string, Promise<IGDBEdition[]>>();
const pendingScreenshots = new Map<string, Promise<IGDBScreenshot[]>>();
const pendingTimes = new Map<string, Promise<GameTimeToBeat[]>>();

let accessToken: string | undefined;
let tokenExpiresAt = 0;
let tokenRequest: Promise<string> | null = null;

function getCredentials() {
  const clientId = process.env.IGDB_CLIENT_ID;
  const clientSecret = process.env.IGDB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("IGDB_CLIENT_ID and IGDB_CLIENT_SECRET must be configured on the server.");
  }
  return { clientId, clientSecret };
}

async function getAccessToken() {
  const { clientId, clientSecret } = getCredentials();
  if (accessToken && Date.now() < tokenExpiresAt) return accessToken;
  if (!tokenRequest) {
    tokenRequest = (async () => {
      const url = new URL(TWITCH_TOKEN_URL);
      url.searchParams.set("client_id", clientId);
      url.searchParams.set("client_secret", clientSecret);
      url.searchParams.set("grant_type", "client_credentials");
      const response = await fetch(url, { method: "POST", cache: "no-store" });
      const data: IGDBTokenResponse = await response.json();
      if (!response.ok || !data.access_token) {
        throw new IGDBRequestError("IGDB authentication failed.", response.status, true);
      }
      accessToken = data.access_token;
      tokenExpiresAt = Date.now() + Math.max(60, data.expires_in - 300) * 1000;
      return accessToken;
    })().finally(() => {
      tokenRequest = null;
    });
  }
  return tokenRequest;
}

async function queryIgdb<T>(
  endpoint: string,
  query: string,
  cache: Map<string, CachedValue<T[]>>,
  pendingQueries: Map<string, Promise<T[]>>,
): Promise<T[]> {
  const cacheKey = `${endpoint}:${query}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < RESPONSE_TTL) return cached.data;
  const pendingQuery = pendingQueries.get(cacheKey);
  if (pendingQuery) return pendingQuery;

  const pending = requestIgdb<T>(endpoint, query, cacheKey, cache).finally(() =>
    pendingQueries.delete(cacheKey),
  );
  pendingQueries.set(cacheKey, pending);
  return pending;
}

async function requestIgdb<T>(
  endpoint: string,
  query: string,
  cacheKey: string,
  cache: Map<string, CachedValue<T[]>>,
): Promise<T[]> {
  const { clientId } = getCredentials();
  const token = await getAccessToken();
  const response = await fetch(`${IGDB_API}/${endpoint}`, {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "text/plain",
    },
    body: query,
    cache: "no-store",
  });
  const data: T[] = await response.json();
  if (!response.ok) {
    if (response.status === 401 && accessToken === token) {
      accessToken = undefined;
      tokenExpiresAt = 0;
    }
    throw new IGDBRequestError("IGDB request failed.", response.status);
  }
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}

function imageUrl(imageId: string | undefined, size: string): string | null {
  return imageId ? `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg` : null;
}

function normalizeGame(game: IGDBGame): GameDetails {
  const companies = game.involved_companies || [];
  const ageRating =
    game.age_ratings?.find((entry) => entry.organization?.name === "ESRB") || game.age_ratings?.[0];
  const ageRatingName = ageRating?.rating_category?.rating;
  const websites = (game.websites || []).map((entry) => ({
    url: entry.url,
    type: entry.type?.type || "Website",
  }));
  const storeGames = (game.external_games || []).filter(
    (entry): entry is IGDBExternalGame & { url: string } =>
      Boolean(entry.url && !/(twitch|youtube)/i.test(entry.external_game_source?.name || "")),
  );
  const videoIds = new Set();
  const videos = (game.videos || [])
    .filter((video): video is IGDBVideo & { video_id: string } => {
      if (!hasVideoId(video) || videoIds.has(video.video_id)) return false;
      videoIds.add(video.video_id);
      return true;
    })
    .map((video) => ({ name: video.name || "Video", video_id: video.video_id }));
  const artwork = game.artworks?.[0]?.image_id;
  const cover = game.cover?.image_id;
  return {
    id: game.id,
    name: game.name,
    slug: game.slug,
    released: game.first_release_date
      ? new Date(game.first_release_date * 1000).toISOString().slice(0, 10)
      : null,
    description_raw: game.summary || game.storyline || "",
    background_image: imageUrl(artwork || cover, artwork ? "1080p" : "cover_big"),
    genres: game.genres || [],
    platforms: game.platforms || [],
    developers: companies
      .filter((entry): entry is IGDBCompanyCredit & { company: IGDBNamed } =>
        Boolean(entry.developer && entry.company),
      )
      .map((entry) => entry.company),
    publishers: companies
      .filter((entry): entry is IGDBCompanyCredit & { company: IGDBNamed } =>
        Boolean(entry.publisher && entry.company),
      )
      .map((entry) => entry.company),
    age_ratings: (game.age_ratings || []).flatMap((entry) => (entry.id ? [{ id: entry.id }] : [])),
    esrb_rating: ageRatingName
      ? { name: `${ageRating.organization?.name || "Age rating"}: ${ageRatingName}` }
      : null,
    rating: game.rating,
    rating_count: game.rating_count,
    aggregated_rating: game.aggregated_rating,
    aggregated_rating_count: game.aggregated_rating_count,
    total_rating: game.total_rating,
    total_rating_count: game.total_rating_count,
    stores: storeGames.map((entry) => ({
      id: entry.id,
      url: entry.url,
      title: entry.name,
      year: entry.year,
      platform: entry.platform?.name,
      releaseFormat: entry.game_release_format?.format,
      store: { name: entry.external_game_source?.name || entry.platform?.name || "Store" },
    })),
    videos,
    websites,
    website: websites.find((entry) => /official/i.test(entry.type))?.url || "",
    reddit_url: websites.find((entry) => /reddit/i.test(entry.type))?.url || "",
    similar_games: game.similar_games || [],
    collection: game.collections?.[0] || null,
    game_time_to_beat: null,
    updated: game.updated_at ? new Date(game.updated_at * 1000).toISOString().slice(0, 10) : null,
  };
}

const GAME_FIELDS = `id,name,slug,first_release_date,summary,storyline,cover.image_id,artworks.image_id,
  genres.name,platforms.name,involved_companies.developer,involved_companies.publisher,involved_companies.company.name,
  age_ratings.organization.name,age_ratings.rating_category.rating,rating,rating_count,aggregated_rating,
  aggregated_rating_count,total_rating,total_rating_count,
  websites.url,websites.type.type,external_games.url,external_games.name,external_games.year,
  external_games.game_release_format.format,external_games.external_game_source.name,external_games.platform.name,
  similar_games.name,similar_games.slug,collections.name,videos.name,videos.video_id,updated_at`;

function quote(value: string | number) {
  return String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

async function findBySlug(slug: string): Promise<IGDBGameReference | null> {
  const result = await queryIgdb(
    "games",
    `fields id,slug; where slug = "${quote(slug)}"; limit 1;`,
    referenceCache,
    pendingReferences,
  );
  return result[0] ?? null;
}

export async function suggestGames(query: string | null): Promise<GameSuggestion[]> {
  const normalizedQuery = String(query || "").trim();
  if (normalizedQuery.length < 2) return [];
  const cacheKey = normalizedQuery.toLowerCase();
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < SEARCH_TTL) return cached.data;

  const results = await queryIgdb(
    "games",
    `search "${quote(normalizedQuery)}"; fields name,slug,first_release_date,game_type; where version_parent = null; limit 7;`,
    suggestionCache,
    pendingSuggestions,
  );
  const suggestions = results.map((game) => ({
    name: game.name,
    slug: game.slug,
    released: game.first_release_date
      ? new Date(game.first_release_date * 1000).toISOString().slice(0, 10)
      : null,
  }));
  searchCache.set(cacheKey, { data: suggestions, timestamp: Date.now() });
  return suggestions;
}

export const getGame = cache(async (nameOrSlug: string): Promise<GameResult> => {
  const value = String(nameOrSlug || "").trim();
  if (!value) return { detail: "Not found." };
  let game: IGDBGame | null =
    (
      await queryIgdb(
        "games",
        `fields ${GAME_FIELDS}; where slug = "${quote(value)}"; limit 1;`,
        gameCache,
        pendingGames,
      )
    )[0] ?? null;
  if (!game) {
    const results = await queryIgdb(
      "games",
      `search "${quote(value)}"; fields ${GAME_FIELDS}; limit 1;`,
      gameCache,
      pendingGames,
    );
    game = results[0] ?? null;
  }
  if (!game) return { detail: "Not found." };
  const normalized = normalizeGame(game);
  if (normalized.id) {
    const times = await queryIgdb(
      "game_time_to_beats",
      `fields hastily,normally,completely,count; where game_id = ${normalized.id}; limit 1;`,
      timeCache,
      pendingTimes,
    );
    normalized.game_time_to_beat = times[0] ?? null;
  }
  return normalized;
});

export const getEditions = cache(async (nameOrSlug: string): Promise<EditionsResult> => {
  const game = await findBySlug(nameOrSlug);
  if (!game) return { count: 0, results: [] };
  const results = await queryIgdb(
    "games",
    `fields id,name,slug,first_release_date; where parent_game = ${game.id} | version_parent = ${game.id}; limit 20;`,
    editionCache,
    pendingEditions,
  );
  return { count: results.length, results };
});

export async function getScreenshots(nameOrSlug: string): Promise<ScreenshotResult> {
  const game = await findBySlug(nameOrSlug);
  if (!game) return { count: 0, results: [] };
  const results = await queryIgdb(
    "screenshots",
    `fields id,image_id,width,height; where game = ${game.id}; limit 30;`,
    screenshotCache,
    pendingScreenshots,
  );
  return {
    count: results.length,
    results: results
      .filter((shot) => shot.image_id)
      .map((shot) => ({
        id: shot.id,
        image: imageUrl(shot.image_id, "screenshot_huge"),
        width: shot.width,
        height: shot.height,
      })),
  };
}
