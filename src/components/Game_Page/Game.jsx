"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SearchBar } from "../Search_Bar/SearchBar.jsx";
import Screenshots from "./Carousel/Screenshots.jsx";
import VideoGallery from "./VideoGallery.jsx";
import Footer from "../Footer/Footer.jsx";
import { formatDate } from "../../utils/formatDate";

function listNames(items) {
  if (!items?.length) return "Not listed";
  return items
    .map((item) => item?.name || item?.platform?.name || item)
    .filter(Boolean)
    .join(", ");
}

function groupStoreListings(stores = [], gameName = "") {
  const groupsByName = new Map();

  stores.forEach((listing) => {
    if (!listing?.url) return;
    const name = listing.store?.name || "Store";
    const groupKey = name.trim().toLocaleLowerCase();
    if (!groupsByName.has(groupKey)) {
      groupsByName.set(groupKey, { name: name.trim(), listings: [], urls: new Set() });
    }
    const group = groupsByName.get(groupKey);
    if (group.urls.has(listing.url)) return;
    group.urls.add(listing.url);

    const title = listing.title?.trim();
    const descriptors = [
      title && title.toLocaleLowerCase() !== gameName.trim().toLocaleLowerCase() ? title : null,
      listing.platform,
      listing.releaseFormat,
      listing.year,
    ].filter(Boolean);
    group.listings.push({
      id: listing.id || listing.url,
      url: listing.url,
      label: descriptors.join(" · ") || "View listing",
    });
  });

  return Array.from(groupsByName.values()).map(({ name, listings }) => {
    const labelCounts = new Map();
    return {
      name,
      listings: listings.map((listing) => {
        const count = (labelCounts.get(listing.label) || 0) + 1;
        labelCounts.set(listing.label, count);
        return count > 1 ? { ...listing, label: `${listing.label} · ${count}` } : listing;
      }),
    };
  });
}

function Detail({ label, children }) {
  return (
    <div className="detail-row">
      <dt>{label}</dt>
      <dd>{children || "Not listed"}</dd>
    </div>
  );
}

function Game({ game, editions = [] }) {
  const [expanded, setExpanded] = useState(false);
  if (!game) return null;
  const ratings = (() => {
    const values = [];
    if (game.aggregated_rating != null)
      values.push({ label: "IGDB critic score", value: Math.round(game.aggregated_rating) });
    if (game.rating != null)
      values.push({ label: "IGDB user score", value: Math.round(game.rating) });
    return values;
  })();

  const description = (game.description_raw || game.description || "")
    .replace(/<[^>]*>/g, "")
    .trim();
  const clipped = description.length > 560 && !expanded;
  const storeGroups = groupStoreListings(game.stores, game.name);
  const details = [
    ["Release date", game.tba ? "To be announced" : formatDate(game.released)],
    ["Developer", listNames(game.developers)],
    ["Publisher", listNames(game.publishers)],
    ["Genres", listNames(game.genres)],
    ["Platforms", listNames(game.platforms)],
    ["Age rating", game.esrb_rating?.name],
    [
      "Play time",
      game.game_time_to_beat?.normally
        ? `${Math.round(game.game_time_to_beat.normally / 3600)} hours (main story + extras)`
        : "Not listed",
    ],
  ];

  return (
    <main className="game-page">
      <header className="game-header">
        <Link className="wordmark" href="/" aria-label="Gamopedia home">
          <span className="wordmark-mark">G</span>
          <span>GAMOPEDIA</span>
        </Link>
        <div className="game-header-search">
          <SearchBar compact />
        </div>
      </header>

      <section
        className="game-hero"
        style={
          game.background_image
            ? { "--hero-image": `url("${game.background_image.replace(/"/g, '\\"')}")` }
            : undefined
        }
      >
        <div className="game-hero-content">
          <Link href="/" className="back-link">
            ← <span>All games</span>
          </Link>
          <div className="hero-game-copy">
            <p className="eyebrow">
              {game.tba
                ? "COMING SOON"
                : game.released
                  ? `RELEASED ${game.released.slice(0, 4)}`
                  : "GAME INDEX"}
            </p>
            <h1>{game.name}</h1>
            <div className="hero-meta">
              {game.genres?.slice(0, 3).map((genre) => (
                <span key={genre.id}>{genre.name}</span>
              ))}
              {game.esrb_rating?.name && (
                <span className="age-rating">{game.esrb_rating.name}</span>
              )}
            </div>
          </div>
          <div className="hero-release">
            <span>RELEASE DATE</span>
            <strong>{game.tba ? "TBA" : formatDate(game.released)}</strong>
          </div>
        </div>
        <span className="hero-index">G / {String(game.id || "—").padStart(5, "0")}</span>
      </section>

      <div className="game-content">
        {ratings.length > 0 && (
          <section className="rating-strip" aria-label="Game ratings">
            {ratings.slice(0, 4).map((rating, index) => {
              const card = (
                <span className="rating-card">
                  <span className="rating-number">{rating.suffix || rating.value}</span>
                  <span className="rating-label">{rating.label}</span>
                </span>
              );
              return (
                <div
                  className={`rating-cell${index === 0 ? " rating-cell-featured" : ""}`}
                  key={`${rating.label}-${index}`}
                >
                  {rating.url ? (
                    <a
                      href={rating.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${rating.label}: ${rating.value}`}
                    >
                      {card}
                    </a>
                  ) : (
                    card
                  )}
                </div>
              );
            })}
          </section>
        )}

        <section className="game-overview">
          <div className="section-heading">
            <span className="eyebrow">THE STORY SO FAR</span>
            <span className="section-rule" />
          </div>
          <div className="overview-grid">
            <h2>
              A world
              <br />
              worth knowing.
            </h2>
            <div className="overview-text">
              {description ? (
                <p>{clipped ? `${description.slice(0, 560).trim()}…` : description}</p>
              ) : (
                <p className="muted-copy">No overview has been added for this title yet.</p>
              )}
              {description.length > 560 && (
                <button className="inline-button" onClick={() => setExpanded((value) => !value)}>
                  {expanded ? "Show less ↑" : "Read the full overview ↓"}
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="screenshots-section">
          <div className="section-heading">
            <span className="eyebrow">A CLOSER LOOK</span>
            <span className="section-rule" />
          </div>
          {game.videos?.length > 0 && (
            <>
              <div className="section-title-row">
                <h2>Videos</h2>
                <span>Select a preview to play</span>
              </div>
              <VideoGallery videos={game.videos} />
            </>
          )}
          <div className="section-title-row">
            <h2>Scenes from the game</h2>
            <span>Click an image to enlarge</span>
          </div>
          <Screenshots
            key={game.slug}
            gameName={game.slug}
            hasVideos={Boolean(game.videos?.length)}
          />
        </section>

        <section className="details-section">
          <div className="section-heading">
            <span className="eyebrow">THE RECORD</span>
            <span className="section-rule" />
          </div>
          <div className="details-grid">
            <div className="details-intro">
              <h2>
                Game
                <br />
                details
              </h2>
              <p>The people, dates, and places behind the title.</p>
            </div>
            <dl className="details-list">
              {details.map(([label, value]) => (
                <Detail key={label} label={label}>
                  {value}
                </Detail>
              ))}
            </dl>
          </div>
        </section>

        <section className="availability-section">
          <div className="section-heading">
            <span className="eyebrow">WHERE TO FIND IT</span>
            <span className="section-rule" />
          </div>
          <div className="availability-grid">
            <div>
              <h2>Available at</h2>
              {storeGroups.length ? (
                <ul className="link-list">
                  {storeGroups.map((group) => (
                    <li key={group.name}>
                      {group.listings.length === 1 ? (
                        <a href={group.listings[0].url} target="_blank" rel="noreferrer">
                          {group.name}
                          <span>↗</span>
                        </a>
                      ) : (
                        <details className="store-disclosure">
                          <summary>
                            <span>{group.name}</span>
                            <span className="store-disclosure-meta">
                              {group.listings.length} listings
                              <span className="store-disclosure-icon" aria-hidden="true">
                                ⌄
                              </span>
                            </span>
                          </summary>
                          <ul className="store-listings">
                            {group.listings.map((listing) => (
                              <li key={listing.id}>
                                <a href={listing.url} target="_blank" rel="noreferrer">
                                  {listing.label}
                                  <span>↗</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted-copy">No store links listed.</p>
              )}
            </div>
            <div>
              <h2>Related editions</h2>
              {editions.length ? (
                <ul className="edition-list">
                  {editions.slice(0, 8).map((edition) => (
                    <li key={edition.id}>
                      {edition.slug ? (
                        <Link className="edition-link" href={`/game/${edition.slug}`}>
                          {edition.name}
                          <span aria-hidden="true">↗</span>
                        </Link>
                      ) : (
                        edition.name
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted-copy">No related editions listed.</p>
              )}
            </div>
            <div>
              <h2>On the web</h2>
              <ul className="link-list">
                {game.websites?.length ? (
                  game.websites.slice(0, 6).map((site) => (
                    <li key={site.url}>
                      <a href={site.url} target="_blank" rel="noreferrer">
                        {site.type}
                        <span>↗</span>
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="muted-copy">No community links listed.</li>
                )}
              </ul>
            </div>
          </div>
        </section>
        <div className="game-data-note">
          GAME INFORMATION PROVIDED BY{" "}
          <a href="https://www.igdb.com/" target="_blank" rel="noreferrer">
            IGDB
          </a>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default Game;
