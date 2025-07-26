import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";

import LeftBlock from "./Left_Block/Block.jsx";
import { gameData } from "../Search_Bar/SearchBar.jsx";
import ProgressBar from "./Middle_Block/ProgressBar.jsx";
import PlatformRatings from "./Middle_Block/PlatformRatings.jsx";
import Platforms from "./Left_Block/Platforms.jsx";
import Stores from "./Right_Block/Stores.jsx";
import Editions from "./Right_Block/Editions.jsx";
import { SearchBar } from "../Search_Bar/SearchBar.jsx";
import Screenshots from "./Carousel/Screenshots.jsx";
import Footer from "../Footer/Footer.jsx";

function Game() {
  if (typeof gameData === "undefined") {
    return <Navigate to="/" />;
  }

  return (
    <Flex
      direction="column"
      minH="100vh"
      bgGradient="linear(to-br, #18181b, #232526 80%)"
    >
      <Box className="search-bar">
        <SearchBar class="hideButton" />
      </Box>
      <Flex
        direction={{ base: "column", md: "row" }}
        align="flex-start"
        justify="center"
        px={4}
        py={8}
        flex="1 0 auto"
      >
        <Box flex={1} mr={{ md: 4 }}>
          <img
            src={gameData.background_image}
            alt="Game_Img"
            style={{ width: "100%", borderRadius: 16, marginBottom: 24 }}
          />
        </Box>
        <Box flex={2} ml={{ md: 4 }}>
          <Box mb={6}>
            <Box
              as="h1"
              fontSize={{ base: "3xl", md: "5xl" }}
              fontWeight="extrabold"
              color="orange.400"
              fontFamily="Orbitron, sans-serif"
              textShadow="0 0 16px #ff2c02, 0 0 32px #ff2c02"
              mb={4}
            >
              {gameData.name}
            </Box>
            <Box
              bg="rgba(24,23,22,0.7)"
              borderRadius="2xl"
              p={6}
              boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
              color="gray.100"
              fontSize={{ base: "md", md: "xl" }}
              fontFamily="Rajdhani, sans-serif"
              mb={4}
              maxW="3xl"
            >
              <div
                className="game-description"
                dangerouslySetInnerHTML={{ __html: gameData.description }}
              />
            </Box>
          </Box>
          <Flex mt={8} gap={8} wrap="wrap">
            <Box minW="250px">
              <LeftBlock heading="Developer" info={gameData.developers} />
              <LeftBlock heading="Publisher" info={gameData.publishers} />
              {gameData.tba ? (
                <>
                  <h3 className="heading">Release Data</h3>
                  <p className="info">To Be Announced</p>
                </>
              ) : (
                <LeftBlock heading="Release Date" info={gameData.released} />
              )}
              <LeftBlock heading="Last Updated" info={gameData.updated} />
              <LeftBlock heading="Genre" info={gameData.genres} />
              <h3 className="heading">ESRB Rating</h3>
              <p className="info">
                {gameData.esrb_rating === null
                  ? "Not Available"
                  : gameData.esrb_rating.name}
              </p>
              <Platforms heading="Platforms" info={gameData.platforms} />
            </Box>
            <Box minW="250px">
              <h3 className="heading">Metacritic Rating</h3>
              {gameData.metacritic !== null ? (
                <ProgressBar score={gameData.metacritic} platform="Overall" />
              ) : (
                <p className="info">Not Available</p>
              )}
              {PlatformRatings(gameData.metacritic_platforms)}
            </Box>
            <Box minW="250px">
              <h3 className="heading">Useful Links</h3>
              {gameData.website === "" && gameData.reddit_url === "" ? (
                <p className="info">Not Available</p>
              ) : (
                <>
                  <a
                    href={gameData.website}
                    target="_blank"
                    rel="noreferrer"
                    className="info"
                  >
                    Official Website
                  </a>
                  <br />
                  <br />
                  <a
                    href={gameData.reddit_url}
                    target="_blank"
                    rel="noreferrer"
                    className="info"
                  >
                    Reddit
                  </a>
                  <br />
                  <br />
                </>
              )}
              <h3 className="heading">Stores</h3>
              {Stores(gameData.stores)}
              <h3 className="heading">DLCs & Editions</h3>
              <Editions gameName={gameData.slug} />
            </Box>
          </Flex>
        </Box>
      </Flex>
      <Box>
        <h3 className="heading screenshot-heading">Screenshots</h3>
        <Box className="screenshots-div">
          <Screenshots gameName={gameData.slug} />
        </Box>
      </Box>
      <Box mt="auto">
        <Footer />
      </Box>
    </Flex>
  );
}

export default Game;
