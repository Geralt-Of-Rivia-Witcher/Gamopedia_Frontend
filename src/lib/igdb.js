import "server-only";
import { cache } from "react";

const IGDB_API = "https://api.igdb.com/v4";
const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const SEARCH_TTL = 5 * 60 * 1000;
const RESPONSE_TTL = 5 * 60 * 1000;
const searchCache = new Map();
const responseCache = new Map();
const pendingQueries = new Map();

let accessToken;
let tokenExpiresAt = 0;
let tokenRequest;

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
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.access_token) {
        const error = new Error("IGDB authentication failed.");
        error.status = response.status;
        error.authentication = true;
        throw error;
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

async function queryIgdb(endpoint, query) {
  const cacheKey = `${endpoint}:${query}`;
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < RESPONSE_TTL) return cached.data;
  if (pendingQueries.has(cacheKey)) return pendingQueries.get(cacheKey);

  const pending = requestIgdb(endpoint, query, cacheKey).finally(() =>
    pendingQueries.delete(cacheKey),
  );
  pendingQueries.set(cacheKey, pending);
  return pending;
}

async function requestIgdb(endpoint, query, cacheKey) {
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
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && accessToken === token) {
      accessToken = undefined;
      tokenExpiresAt = 0;
    }
    const error = new Error("IGDB request failed.");
    error.status = response.status;
    throw error;
  }
  responseCache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}

function imageUrl(imageId, size) {
  return imageId ? `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg` : null;
}

function normalizeGame(game) {
  const companies = game.involved_companies || [];
  const ageRating =
    game.age_ratings?.find((entry) => entry.organization?.name === "ESRB") || game.age_ratings?.[0];
  const ageRatingName = ageRating?.rating_category?.rating;
  const websites = (game.websites || []).map((entry) => ({
    url: entry.url,
    type: entry.type?.type || "Website",
  }));
  const storeGames = (game.external_games || []).filter(
    (entry) => entry.url && !/twitch/i.test(entry.external_game_source?.name || ""),
  );
  const videoIds = new Set();
  const videos = (game.videos || [])
    .filter((video) => {
      if (!/^[A-Za-z0-9_-]+$/.test(video.video_id || "") || videoIds.has(video.video_id))
        return false;
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
      .filter((entry) => entry.developer)
      .map((entry) => entry.company)
      .filter(Boolean),
    publishers: companies
      .filter((entry) => entry.publisher)
      .map((entry) => entry.company)
      .filter(Boolean),
    age_ratings: game.age_ratings || [],
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

function quote(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

async function findBySlug(slug, fields = "id,slug") {
  const result = await queryIgdb(
    "games",
    `fields ${fields}; where slug = "${quote(slug)}"; limit 1;`,
  );
  return result[0] || null;
}

export async function suggestGames(query) {
  const normalizedQuery = String(query || "").trim();
  if (normalizedQuery.length < 2) return [];
  const cacheKey = normalizedQuery.toLowerCase();
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < SEARCH_TTL) return cached.data;

  const results = await queryIgdb(
    "games",
    `search "${quote(normalizedQuery)}"; fields name,slug,first_release_date,game_type; where version_parent = null; limit 7;`,
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

export const getGame = cache(async (nameOrSlug) => {
  const value = String(nameOrSlug || "").trim();
  if (!value) return { detail: "Not found." };
  let game = await findBySlug(value, GAME_FIELDS);
  if (!game) {
    const results = await queryIgdb(
      "games",
      `search "${quote(value)}"; fields ${GAME_FIELDS}; limit 1;`,
    );
    game = results[0] || null;
  }
  if (!game) return { detail: "Not found." };
  const normalized = normalizeGame(game);
  if (normalized.id) {
    const times = await queryIgdb(
      "game_time_to_beats",
      `fields hastily,normally,completely,count; where game_id = ${normalized.id}; limit 1;`,
    );
    normalized.game_time_to_beat = times[0] || null;
  }
  return normalized;
});

export const getEditions = cache(async (nameOrSlug) => {
  const game = await findBySlug(nameOrSlug);
  if (!game) return { count: 0, results: [] };
  const results = await queryIgdb(
    "games",
    `fields id,name,slug,first_release_date; where parent_game = ${game.id} | version_parent = ${game.id}; limit 20;`,
  );
  return { count: results.length, results };
});

export async function getScreenshots(nameOrSlug) {
  const game = await findBySlug(nameOrSlug);
  if (!game) return { count: 0, results: [] };
  const results = await queryIgdb(
    "screenshots",
    `fields image_id,width,height; where game = ${game.id}; limit 30;`,
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
