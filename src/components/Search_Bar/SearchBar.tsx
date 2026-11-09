"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent, ChangeEvent, KeyboardEvent } from "react";
import type { ApiErrorResponse, GameResult, GameSuggestion } from "@/types/game";

interface SearchBarProps {
  compact?: boolean;
}
export function SearchBar({ compact = false }: SearchBarProps) {
  const router = useRouter();
  const [isNavigating, startNavigation] = useTransition();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GameSuggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const requestId = useRef(0);
  const busy = submitting || isNavigating;

  useEffect(() => {
    const trimmed = query.trim();
    const id = ++requestId.current;
    if (trimmed.length < 2) {
      return undefined;
    }
    const timer = window.setTimeout(() => {
      fetch(`/api/suggest?query=${encodeURIComponent(trimmed)}`)
        .then(async (response) => {
          const payload: GameSuggestion[] | ApiErrorResponse = await response.json();
          if (!response.ok) {
            const message = "error" in payload ? payload.error : undefined;
            throw new Error(message || "Suggestion request failed.");
          }
          return Array.isArray(payload) ? payload : [];
        })
        .then((data) => {
          if (id !== requestId.current) return;
          setSuggestions(data || []);
          setOpen(true);
          setActiveIndex(-1);
        })
        .catch((error) => {
          if (id === requestId.current) {
            setSuggestions([]);
            setMessage(
              error instanceof Error
                ? error.message
                : "Couldn’t search the game catalogue. Please try again.",
            );
            setSuggestionError(true);
            setOpen(true);
          }
        })
        .finally(() => {
          if (id === requestId.current) setLoadingSuggestions(false);
        });
    }, 280);
    return () => {
      window.clearTimeout(timer);
      if (requestId.current === id) requestId.current += 1;
    };
  }, [query, retryCount]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      )
        setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const selectSuggestion = (suggestion: GameSuggestion) => {
    if (busy) return;
    setQuery(suggestion.name);
    setOpen(false);
    setMessage("");
    setSuggestionError(false);
    setLoadingSuggestions(false);
    setSuggestions([]);
    startNavigation(() => router.push(`/game/${suggestion.slug}`));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      selectSuggestion(suggestions[activeIndex]);
      return;
    }
    const value = query.trim();
    if (!value || submitting) return;
    setSubmitting(true);
    setMessage("");
    setSuggestionError(false);
    setOpen(false);
    try {
      const response = await fetch("/api/gameName", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameName: value }),
      });
      const payload: GameResult | ApiErrorResponse = await response.json();
      if (!response.ok) {
        const message = "error" in payload ? payload.error : undefined;
        throw new Error(message || "Game search failed.");
      }
      if (!("slug" in payload) || !payload.slug) {
        setMessage("No game found. Check the title and try again.");
      } else {
        router.push(`/game/${payload.slug}`);
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Couldn’t reach the game catalogue. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && suggestions.length) {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => (current + 1) % suggestions.length);
    } else if (event.key === "ArrowUp" && suggestions.length) {
      event.preventDefault();
      setActiveIndex((current) => (current <= 0 ? suggestions.length - 1 : current - 1));
    } else if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    setMessage("");
    setSuggestionError(false);
    setOpen(true);
    setSuggestions([]);
    setActiveIndex(-1);
    setLoadingSuggestions(value.trim().length >= 2);
  };

  const listId = `game-suggestions-${compact ? "compact" : "main"}`;

  return (
    <div className={`search-wrap${compact ? " search-wrap-compact" : ""}`} ref={rootRef}>
      <form className="search-form" role="search" onSubmit={submit} aria-busy={busy}>
        <label className="sr-only" htmlFor={listId}>
          Search video games
        </label>
        <span className="search-symbol" aria-hidden="true">
          ⌕
        </span>
        <input
          id={listId}
          type="search"
          value={query}
          disabled={busy}
          placeholder="Try a game title…"
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open && suggestions.length > 0}
          aria-controls={`${listId}-list`}
          aria-activedescendant={activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined}
          onChange={onQueryChange}
          onFocus={() => suggestions.length && setOpen(true)}
          onKeyDown={onKeyDown}
        />
        <button
          className="search-submit"
          type="submit"
          disabled={!query.trim() || busy}
          aria-label={busy ? "Opening selected game" : "Search games"}
          aria-busy={busy}
        >
          {busy ? (
            <span className="button-spinner" aria-hidden="true" />
          ) : (
            <span aria-hidden="true">↗</span>
          )}
        </button>
      </form>
      {open &&
        query.trim().length >= 2 &&
        (suggestions.length > 0 || loadingSuggestions || !message) && (
          <div
            className="suggestion-panel"
            id={`${listId}-list`}
            role="listbox"
            aria-label="Game suggestions"
          >
            {loadingSuggestions && (
              <div className="suggestion-status">Searching the catalogue…</div>
            )}
            {suggestions.map((item, index) => (
              <button
                id={`${listId}-option-${index}`}
                className={`suggestion-item${activeIndex === index ? " is-active" : ""}`}
                type="button"
                role="option"
                aria-selected={activeIndex === index}
                disabled={busy}
                key={item.slug}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectSuggestion(item)}
              >
                <span className="suggestion-title">{item.name}</span>
                <span className="suggestion-year">
                  {item.released ? item.released.slice(0, 4) : "Release date unknown"}
                </span>
                <span className="suggestion-arrow" aria-hidden="true">
                  ↗
                </span>
              </button>
            ))}
            {!loadingSuggestions && suggestions.length === 0 && !message && (
              <div className="suggestion-status">
                No matching titles yet. Press enter to try a full search.
              </div>
            )}
          </div>
        )}
      {message && (
        <p className="search-message" role="alert">
          {message}
        </p>
      )}
      {message && suggestionError && (
        <button
          className="search-retry"
          type="button"
          onClick={() => {
            setMessage("");
            setLoadingSuggestions(true);
            setRetryCount((count) => count + 1);
          }}
        >
          Retry search
        </button>
      )}
    </div>
  );
}
