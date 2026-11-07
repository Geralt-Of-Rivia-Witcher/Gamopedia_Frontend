import { getEditions, getGame, getScreenshots, suggestGames } from "@/lib/igdb";

const allowedMethods = {
  suggest: ["GET"],
  gameName: ["POST"],
  editions: ["POST"],
  screenshots: ["POST"],
};

async function handle(request, context) {
  const { endpoint } = await context.params;
  if (
    !Object.hasOwn(allowedMethods, endpoint) ||
    !allowedMethods[endpoint].includes(request.method)
  ) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  try {
    if (endpoint === "suggest") {
      const url = new URL(request.url);
      return Response.json(await suggestGames(url.searchParams.get("query")));
    }

    const body = await request.json();
    const gameName = body?.gameName;
    if (typeof gameName !== "string" || !gameName.trim()) {
      return Response.json({ error: "A game name is required." }, { status: 400 });
    }

    const data =
      endpoint === "gameName"
        ? await getGame(gameName)
        : endpoint === "editions"
          ? await getEditions(gameName)
          : await getScreenshots(gameName);
    return Response.json(data);
  } catch (error) {
    if (!process.env.IGDB_CLIENT_ID || !process.env.IGDB_CLIENT_SECRET) {
      return Response.json(
        {
          error:
            "Server setup is missing IGDB credentials. Add IGDB_CLIENT_ID and IGDB_CLIENT_SECRET to frontend/.env.local, then restart Next.js.",
        },
        { status: 503 },
      );
    }

    const igdbStatus = error?.status;
    if (error?.authentication || igdbStatus === 400 || igdbStatus === 401 || igdbStatus === 403) {
      return Response.json(
        {
          error: `IGDB rejected the credentials (HTTP ${igdbStatus}). Check the Twitch app client ID and secret.`,
        },
        { status: 502 },
      );
    }
    if (igdbStatus === 429) {
      return Response.json(
        { error: "IGDB rate limited this search. Wait a moment and try again." },
        { status: 502 },
      );
    }
    if (igdbStatus === 502 || igdbStatus === 503 || igdbStatus === 504) {
      return Response.json(
        {
          error: `IGDB is temporarily unavailable (HTTP ${igdbStatus}). Wait a few minutes, then try again.`,
        },
        { status: 502 },
      );
    }
    if (igdbStatus) {
      return Response.json({ error: `IGDB request failed (HTTP ${igdbStatus}).` }, { status: 502 });
    }

    console.error("IGDB request failed before receiving a valid response.");
    return Response.json(
      {
        error:
          "Next.js could not reach IGDB. Check the server's network connection and IGDB credentials.",
      },
      { status: 502 },
    );
  }
}

export const GET = handle;
export const POST = handle;
