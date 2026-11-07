import Link from "next/link";
import { notFound } from "next/navigation";
import GamePage from "@/components/Game_Page/Game";
import { getEditions, getGame } from "@/lib/igdb";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const game = await getGame(slug);
    if (game?.slug && game?.name) {
      const description = (game.description_raw || game.description || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 155);
      return {
        title: `${game.name} — Gamopedia`,
        ...(description ? { description } : {}),
      };
    }
  } catch {
    // The page itself renders the catalogue error state.
  }
  return { title: "Game details — Gamopedia" };
}

export default async function Page({ params }) {
  const { slug } = await params;
  let game;
  try {
    game = await getGame(slug);
  } catch {
    return (
      <main className="state-page">
        <div className="state-mark">!</div>
        <p className="eyebrow">CATALOGUE UNAVAILABLE</p>
        <h1>We couldn’t reach the archive.</h1>
        <p className="state-copy">
          The IGDB catalogue may be temporarily unavailable. Try this page again in a moment.
        </p>
        <Link className="text-link" href="/">
          ← Back to search
        </Link>
      </main>
    );
  }

  if (!game?.slug || game?.detail === "Not found.") {
    notFound();
  }

  let editions = [];
  try {
    const response = await getEditions(game.slug);
    editions = response?.results || [];
  } catch {
    // Related editions are optional catalogue data.
  }

  return <GamePage game={game} editions={editions} />;
}
