"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

function validImageSource(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export default function Screenshots({ gameName }) {
  const [shots, setShots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const isOpen = selected !== null;

  useEffect(() => {
    let mounted = true;
    fetch("/api/screenshots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameName }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Screenshot request failed");
        return response.json();
      })
      .then((data) => {
        const validShots = (Array.isArray(data?.results) ? data.results : []).filter((shot) =>
          validImageSource(shot?.image),
        );
        if (mounted) setShots(validShots);
      })
      .catch(() => {
        if (mounted) setShots([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [gameName]);

  const move = useCallback(
    (direction) =>
      setSelected((index) => {
        if (!shots.length) return null;
        const current = Number.isInteger(index) ? index : 0;
        return (current + direction + shots.length) % shots.length;
      }),
    [shots.length],
  );
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog || dialog.open) return undefined;
    dialog.showModal();
    closeRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, move]);

  const close = () => {
    if (dialogRef.current?.open) dialogRef.current.close();
    setSelected(null);
  };
  const open = (index) => setSelected(index);
  const selectedShot = Number.isInteger(selected) ? shots[selected] : null;
  const selectedImage = validImageSource(selectedShot?.image);

  if (loading)
    return (
      <div className="media-state" role="status">
        Loading screenshots…
      </div>
    );
  if (!shots.length)
    return <div className="media-state">No screenshots are available for this title.</div>;

  return (
    <>
      <div className="screenshot-grid">
        {shots.slice(0, 6).map((shot, index) => {
          const imageSource = validImageSource(shot?.image);
          if (!imageSource) return null;
          return (
            <button
              className="screenshot-thumb"
              type="button"
              key={shot.id ?? imageSource}
              onClick={() => open(index)}
              aria-label={`View screenshot ${index + 1}`}
            >
              <Image
                src={imageSource}
                alt={`${gameName} screenshot ${index + 1}`}
                fill
                sizes="(max-width: 760px) 50vw, 33vw"
                unoptimized
              />
              <span className="thumb-index">FRAME {String(index + 1).padStart(2, "0")}</span>
            </button>
          );
        })}
      </div>
      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label="Screenshot viewer"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClose={() => {
          if (selected !== null) setSelected(null);
        }}
      >
        <button
          ref={closeRef}
          type="button"
          className="lightbox-close"
          onClick={close}
          aria-label="Close screenshot"
        >
          ×
        </button>
        {isOpen && shots.length > 1 && (
          <button
            type="button"
            className="lightbox-arrow lightbox-prev"
            onClick={() => move(-1)}
            aria-label="Previous screenshot"
          >
            ←
          </button>
        )}
        <figure>
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt={`${gameName} screenshot ${selected + 1}`}
              width={selectedShot.width || 1920}
              height={selectedShot.height || 1080}
              unoptimized
            />
          ) : (
            <p className="media-state">This screenshot is unavailable.</p>
          )}
          <figcaption>
            {gameName} · {String((selected ?? 0) + 1).padStart(2, "0")} /{" "}
            {String(shots.length).padStart(2, "0")}
          </figcaption>
        </figure>
        {isOpen && shots.length > 1 && (
          <button
            type="button"
            className="lightbox-arrow lightbox-next"
            onClick={() => move(1)}
            aria-label="Next screenshot"
          >
            →
          </button>
        )}
      </dialog>
    </>
  );
}
