import React, { useState } from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Text,
  Badge,
  Icon,
  Tooltip,
  useBreakpointValue,
  Collapse,
  Button,
} from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import {
  FaUserTie,
  FaBuilding,
  FaCalendarAlt,
  FaClock,
  FaTags,
  FaGamepad,
  FaStore,
  FaLink,
} from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { GiConsoleController } from "react-icons/gi";

import { gameData } from "../Search_Bar/SearchBar.jsx";

import ProgressBar from "./Middle_Block/ProgressBar.jsx";
import Platforms from "./Left_Block/Platforms.jsx";
import Stores from "./Right_Block/Stores.jsx";
import Editions from "./Right_Block/Editions.jsx";
import { SearchBar } from "../Search_Bar/SearchBar.jsx";
import Screenshots from "./Carousel/Screenshots.jsx";
import Footer from "../Footer/Footer.jsx";
import { formatDate } from "../../utils/formatDate";
import PlatformRatings from "./Middle_Block/PlatformRatings.jsx";

const Game = () => {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (typeof gameData === "undefined") {
    return <Navigate to="/" />;
  }

  // Short description logic
  const desc = gameData.description?.replace(/<[^>]+>/g, "");
  const shortDesc =
    desc && desc.length > 220 ? desc.slice(0, 220) + "..." : desc;

  // Info grid data
  const infoFields = [
    {
      label: "Developer",
      value: gameData.developers,
      icon: FaUserTie,
    },
    {
      label: "Publisher",
      value: gameData.publishers,
      icon: FaBuilding,
    },
    {
      label: "Release Date",
      value: gameData.tba ? "To Be Announced" : formatDate(gameData.released),
      icon: FaCalendarAlt,
    },
    {
      label: "Last Updated",
      value: formatDate(gameData.updated),
      icon: FaClock,
    },
    {
      label: "Genre",
      value: gameData.genres,
      icon: MdCategory,
    },
    {
      label: "ESRB Rating",
      value: gameData.esrb_rating?.name || "Not Available",
      icon: FaGamepad,
    },
    {
      label: "Platforms",
      value:
        gameData.platforms?.map((p) => p.platform.name).join(", ") ||
        "Not Available",
      icon: GiConsoleController,
    },
  ];

  // Ratings row data
  const ratings = [
    ...(gameData.metacritic !== null
      ? [
          {
            label: "Metacritic",
            value: gameData.metacritic,
            color: "orange.400",
            icon: FaTags,
          },
        ]
      : []),
    ...(gameData.metacritic_platforms || []).map((rating) => ({
      label: rating.platform.name,
      value: rating.metascore,
      color: "blue.400",
      icon: GiConsoleController,
      url: rating.url,
    })),
  ];

  return (
    <Flex
      direction="column"
      minH="100vh"
      bgGradient="linear(to-br, #18181b, #232526 80%)"
    >
      <Box className="search-bar">
        <SearchBar />
      </Box>
      {/* Hero Section */}
      <Box
        position="relative"
        w="full"
        mb={8}
        minH={{ base: "320px", md: "420px" }}
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          position="absolute"
          inset={0}
          bgImage={`url(${gameData.background_image})`}
          bgSize="cover"
          bgPosition="center"
          filter="blur(16px) brightness(0.5)"
          zIndex={0}
        />
        <Flex
          position="relative"
          zIndex={1}
          align="center"
          justify="center"
          w="full"
        >
          {/* Add gap between card and background by using marginTop */}
          <Box
            as={showFullDesc ? "div" : "section"}
            bg="rgba(24,23,22,0.85)"
            borderRadius="2xl"
            px={{ base: 4, md: 10 }}
            py={{ base: 6, md: 8 }}
            maxW="3xl"
            mx="auto"
            textAlign="center"
            mt={{ base: 10, md: 16 }}
            mb={{ base: 10, md: 16 }}
            minH={{ base: "180px", md: "220px" }}
            transition="all 0.5s cubic-bezier(.4,0,.2,1)"
            transform={showFullDesc ? "scale(1.03)" : "scale(1)"}
            boxShadow={
              showFullDesc
                ? "0 0 12px 2px #ff9100, 0 0 24px 4px #ff2c02"
                : "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
            }
          >
            <Text
              as="h1"
              fontSize={{ base: "2xl", md: "5xl" }}
              fontWeight="extrabold"
              color="orange.400"
              fontFamily="Orbitron, sans-serif"
              textShadow="0 0 16px #ff2c02, 0 0 32px #ff2c02"
              mb={2}
            >
              {gameData.name}
            </Text>
            <Text
              color="gray.200"
              fontSize={{ base: "md", md: "xl" }}
              fontFamily="Rajdhani, sans-serif"
              mb={2}
              noOfLines={showFullDesc ? undefined : 3}
              transition="all 0.5s cubic-bezier(.4,0,.2,1)"
            >
              {showFullDesc ? desc : shortDesc}
            </Text>
            {desc && desc.length > 220 && (
              <Button
                size="sm"
                colorScheme="orange"
                variant="link"
                onClick={() => setShowFullDesc((v) => !v)}
                mb={2}
                style={{
                  fontWeight: 700,
                  fontSize: "1.1em",
                  letterSpacing: "0.5px",
                  transition: "color 0.3s",
                }}
              >
                {showFullDesc ? "Show less" : "Read more"}
              </Button>
            )}
          </Box>
        </Flex>
      </Box>
      {/* Ratings Row */}
      {ratings.length > 0 && (
        <Box
          bg="rgba(24,23,22,0.7)"
          borderRadius="2xl"
          boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
          px={{ base: 4, md: 10 }}
          py={{ base: 4, md: 6 }}
          maxW="3xl"
          mx="auto"
          mb={6}
        >
          {ratings.length > 0 && (
            <Box>
              <PlatformRatings array={gameData.metacritic_platforms} />
            </Box>
          )}
        </Box>
      )}
      {/* Info Grid */}
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={6}
        px={{ base: 2, md: 8 }}
        mb={8}
        w="full"
        maxW="6xl"
        mx="auto"
      >
        {infoFields.map((field, idx) => (
          <GridItem
            key={field.label}
            bg="rgba(24,23,22,0.7)"
            borderRadius="xl"
            boxShadow="0 0 16px #1A74E2"
            p={5}
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            minH="90px"
          >
            <Flex align="center" gap={2} mb={1}>
              <Icon as={field.icon} color="orange.300" boxSize={5} />
              <Text
                fontSize="sm"
                color="gray.400"
                fontWeight="bold"
                textTransform="uppercase"
              >
                {field.label}
              </Text>
            </Flex>
            <Text
              fontSize="lg"
              color="white"
              fontWeight="bold"
              wordBreak="break-word"
            >
              {Array.isArray(field.value)
                ? field.value.map((v) => v.name || v).join(", ")
                : field.value}
            </Text>
          </GridItem>
        ))}
      </Grid>
      {/* Links, Stores, Editions */}
      <Box
        bg="rgba(24,23,22,0.7)"
        borderRadius="2xl"
        boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
        px={{ base: 4, md: 10 }}
        py={{ base: 6, md: 8 }}
        maxW="6xl"
        mx="auto"
        mb={8}
      >
        <Flex direction={{ base: "column", md: "row" }} gap={8}>
          <Box flex={1}>
            <Text fontSize="xl" color="orange.300" fontWeight="bold" mb={2}>
              Useful Links
            </Text>
            {gameData.website === "" && gameData.reddit_url === "" ? (
              <Text color="gray.400">Not Available</Text>
            ) : (
              <Flex direction="column" gap={2}>
                {gameData.website && (
                  <Flex align="center" gap={2}>
                    <Icon as={FaLink} color="orange.200" />
                    <a
                      href={gameData.website}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#fff" }}
                    >
                      Official Website
                    </a>
                  </Flex>
                )}
                {gameData.reddit_url && (
                  <Flex align="center" gap={2}>
                    <Icon as={FaLink} color="orange.200" />
                    <a
                      href={gameData.reddit_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#fff" }}
                    >
                      Reddit
                    </a>
                  </Flex>
                )}
              </Flex>
            )}
          </Box>
          <Box flex={1}>
            <Text fontSize="xl" color="orange.300" fontWeight="bold" mb={2}>
              Stores
            </Text>
            {Stores(gameData.stores)}
          </Box>
          <Box flex={1}>
            <Text fontSize="xl" color="orange.300" fontWeight="bold" mb={2}>
              DLCs & Editions
            </Text>
            <Editions gameName={gameData.slug} />
          </Box>
        </Flex>
      </Box>
      {/* Screenshots */}
      <Box>
        <Text
          as="h3"
          className="heading screenshot-heading"
          fontSize="2xl"
          color="orange.300"
          fontWeight="bold"
          mb={4}
          textAlign="center"
        >
          Screenshots
        </Text>
        <Box className="screenshots-div">
          <Screenshots gameName={gameData.slug} />
        </Box>
      </Box>
      <Box mt="auto">
        <Footer />
      </Box>
    </Flex>
  );
};

export default Game;
