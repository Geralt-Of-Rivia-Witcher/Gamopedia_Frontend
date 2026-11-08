"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

function isValidVideoId(videoId) {
  return typeof videoId === "string" && /^[A-Za-z0-9_-]+$/.test(videoId);
}

export default function VideoGallery({ videos = [] }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const triggerRef = useRef(null);
  const availableVideos = videos.filter((video) => isValidVideoId(video?.video_id));
  const activeVideo = Number.isInteger(activeIndex) ? availableVideos[activeIndex] : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (activeVideo && dialog && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
    }
  }, [activeVideo]);

  const close = useCallback(() => {
    if (dialogRef.current?.open) dialogRef.current.close();
    setActiveIndex(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const move = useCallback(
    (direction) => {
      setActiveIndex((index) => {
        if (!availableVideos.length) return null;
        const current = Number.isInteger(index) ? index : 0;
        return (current + direction + availableVideos.length) % availableVideos.length;
      });
    },
    [availableVideos.length],
  );

  useEffect(() => {
    if (!activeVideo) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeVideo, close, move]);

  if (!availableVideos.length) return null;

  return (
    <>
      <div className={`video-grid${availableVideos.length === 1 ? " video-grid-single" : ""}`}>
        {availableVideos.map((video, index) => (
          <article className="video-card" key={video.video_id}>
            <button
              className="video-preview"
              type="button"
              aria-label={`Play ${video.name}`}
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setActiveIndex(index);
              }}
            >
              <Image
                src={`https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`}
                alt=""
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
                unoptimized
              />
              <span className="video-preview-shade" aria-hidden="true" />
              <span className="video-play-mark" aria-hidden="true">
                ▶
              </span>
              <span className="video-index" aria-hidden="true">
                VIDEO {String(index + 1).padStart(2, "0")}
              </span>
            </button>
            <p className="video-title">{video.name}</p>
          </article>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox video-lightbox"
        aria-label={activeVideo?.name || "Video player"}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClose={() => {
          if (activeVideo) setActiveIndex(null);
          triggerRef.current?.focus();
        }}
      >
        <button
          ref={closeRef}
          type="button"
          className="lightbox-close"
          onClick={close}
          aria-label="Close video"
        >
          ×
        </button>
        {activeVideo && availableVideos.length > 1 && (
          <>
            <button
              type="button"
              className="lightbox-arrow lightbox-prev"
              onClick={() => move(-1)}
              aria-label="Previous video"
            >
              ←
            </button>
            <button
              type="button"
              className="lightbox-arrow lightbox-next"
              onClick={() => move(1)}
              aria-label="Next video"
            >
              →
            </button>
          </>
        )}
        {activeVideo && (
          <figure className="video-player">
            <div className="video-player-frame">
              <iframe
                key={activeVideo.video_id}
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.video_id}?autoplay=1&rel=0`}
                title={activeVideo.name}
                allow="autoplay; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <figcaption>{activeVideo.name}</figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
