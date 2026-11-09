import React from "react";
import Link from "next/link";

function Footer(): React.JSX.Element {
  return (
    <footer className="site-footer">
      <Link className="footer-wordmark" href="/">
        GAMOPEDIA<span>®</span>
      </Link>
      <p>
        Made for people who love games. Data by{" "}
        <a href="https://www.igdb.com/" target="_blank" rel="noreferrer">
          IGDB
        </a>
        .
      </p>
    </footer>
  );
}

export default Footer;
