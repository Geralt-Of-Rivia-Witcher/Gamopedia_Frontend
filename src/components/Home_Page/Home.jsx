import React from "react";
import Link from "next/link";
import { SearchBar } from "../Search_Bar/SearchBar.jsx";
import Footer from "../Footer/Footer.jsx";

function Home() {
  return (
    <main className="home-page">
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="Gamopedia home">
          <span className="wordmark-mark">G</span>
          <span>GAMOPEDIA</span>
        </Link>
        <span className="header-note">THE VIDEO GAME INDEX</span>
      </header>

      <section className="home-intro" aria-labelledby="home-title">
        <div className="intro-copy">
          <p className="eyebrow">
            <span className="eyebrow-line" />A field guide to video games
          </p>
          <h1 id="home-title">
            Every game
            <br />
            has a <em>story.</em>
          </h1>
          <p className="intro-description">
            Find the details behind the games you love. Search a title to explore its worlds,
            creators, platforms, reviews, and more.
          </p>
          <div className="home-search">
            <SearchBar />
            <span className="search-hint">
              Search by title <kbd>↵</kbd>
            </span>
          </div>
          <p className="data-credit">
            A growing catalogue, powered by{" "}
            <a href="https://www.igdb.com/" target="_blank" rel="noreferrer">
              IGDB
            </a>
            .
          </p>
        </div>

        <div className="archive-art" aria-hidden="true">
          <div className="archive-art-top">
            <span>GAME ARCHIVE</span>
            <span>EST. 2024</span>
          </div>
          <div className="archive-art-orbit orbit-one" />
          <div className="archive-art-orbit orbit-two" />
          <div className="archive-art-disc">
            <span>
              PLAY
              <br />
              ON
            </span>
          </div>
          <div className="archive-art-cross">✳</div>
          <div className="archive-art-caption">
            <span>EXPLORE THE INDEX</span>
            <span>01 — ∞</span>
          </div>
        </div>
      </section>

      <section className="home-bottom" aria-label="About the catalogue">
        <div>
          <span className="bottom-index">01</span>
          <p>
            <strong>Look it up</strong>
            <br />
            Search thousands of game titles.
          </p>
        </div>
        <div>
          <span className="bottom-index">02</span>
          <p>
            <strong>Get the full picture</strong>
            <br />
            Ratings, release dates, platforms, and more.
          </p>
        </div>
        <div className="bottom-aside">
          GOOD GAMES
          <br />
          LEAVE A TRACE.
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default Home;
