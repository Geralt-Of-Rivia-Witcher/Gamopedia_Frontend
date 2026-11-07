import Link from "next/link";

export default function NotFound() {
  return (
    <main className="state-page">
      <div className="state-mark">?</div>
      <p className="eyebrow">NOT IN THE INDEX</p>
      <h1>We lost that trail.</h1>
      <p className="state-copy">That page isn’t in the catalogue. Search for another game title.</p>
      <Link className="text-link" href="/">
        ← Back to search
      </Link>
    </main>
  );
}
