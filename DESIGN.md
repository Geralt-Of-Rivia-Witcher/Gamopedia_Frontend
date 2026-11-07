# Gamopedia design direction

## Product

Gamopedia is a game discovery and reference site. Visitors search IGDB's catalogue and inspect a game's summary, reception, release information, platforms, screenshots, and related links. The UI should feel like a thoughtfully kept index of games rather than a storefront or a dashboard.

## Visual direction: the game archive

Use an editorial archive language: warm catalogue paper, dark evergreen ink, and a vermilion annotation color. IGDB artwork is the main source of image and color on detail pages. The home page uses a bespoke circular disc/orbit illustration as its signature; keep other decoration quiet.

### Tokens

| Role       | Value     | Use                            |
| ---------- | --------- | ------------------------------ |
| Paper      | `#f1eee5` | Main canvas                    |
| Deep paper | `#e6e1d5` | Hover and secondary surfaces   |
| Ink        | `#242b27` | Primary text                   |
| Soft ink   | `#58615a` | Supporting copy                |
| Rule       | `#c9c5b9` | Dividers and outlines          |
| Annotation | `#de593d` | Links, emphasis, active marks  |
| Evergreen  | `#334d41` | Primary action and archive art |

### Type

- Rajdhani (400/600/700) for the wordmark, display headings, and short labels. Its compact letterforms nod to game packaging while staying readable at large sizes.
- Arial/Helvetica for paragraphs and controls; use a system stack to avoid remote font dependencies.
- Courier New for small catalogue metadata, where its tabular rhythm helps labels read as indexing marks.

### Layout and interaction

- Home is a two-part editorial cover: a plain-language search proposition beside the circular archive illustration. Search remains the primary action.
- Game pages use a full-bleed IGDB image with a strong dark scrim, then return to the paper canvas for scannable information sections.
- Use thin rules, square corners, restrained movement, and visible keyboard focus. Hover may refine an image or link but does not reveal required information.
- Keep IGDB attribution visible. Never invent discovery rows or scores when the API response does not provide them.

### Runtime mapping

This file is the visual source of truth. Values are declared as CSS custom properties in `src/styles.css`; shared page, search, and detail components consume those variables. The screenshot viewer uses the native dialog element so it does not need a separate component library.
