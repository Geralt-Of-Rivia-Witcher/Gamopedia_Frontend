import React, { useState, useEffect } from "react";
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
import { Navigate, useLocation } from "react-router-dom";
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
import { GlassCards } from "./RatingShowcase.jsx";

const Game = () => {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const location = useLocation();
  const [_, forceUpdate] = useState(0);

  // When location changes (i.e., after a search), force a re-render to pick up new gameData
  useEffect(() => {
    forceUpdate((v) => v + 1);
  }, [location]);

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
      {/* Info Grid (Game Data) */}
      <Box maxW="6xl" mx="auto" w="full" mb={8}>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={6}
          px={{ base: 2, md: 8 }}
          mb={4}
        >
          {infoFields.length % 3 === 1 && infoFields.length > 3
            ? [
                ...infoFields
                  .slice(0, infoFields.length - 1)
                  .map((field, idx) => (
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
                  )),
                // Center the last card
                <GridItem
                  key={infoFields[infoFields.length - 1].label}
                  colStart={{ base: 1, md: 2 }}
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
                    <Icon
                      as={infoFields[infoFields.length - 1].icon}
                      color="orange.300"
                      boxSize={5}
                    />
                    <Text
                      fontSize="sm"
                      color="gray.400"
                      fontWeight="bold"
                      textTransform="uppercase"
                    >
                      {infoFields[infoFields.length - 1].label}
                    </Text>
                  </Flex>
                  <Text
                    fontSize="lg"
                    color="white"
                    fontWeight="bold"
                    wordBreak="break-word"
                  >
                    {Array.isArray(infoFields[infoFields.length - 1].value)
                      ? infoFields[infoFields.length - 1].value
                          .map((v) => v.name || v)
                          .join(", ")
                      : infoFields[infoFields.length - 1].value}
                  </Text>
                </GridItem>,
              ]
            : infoFields.map((field, idx) => (
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
      </Box>
      {ratings.length > 0 && (
        <>
          <Box
            w="full"
            borderBottom="2px solid"
            borderColor="gray.700"
            mb={8}
          />
          {/* Ratings */}
          <Box maxW="6xl" mx="auto" w="full" mb={8}>
            <Text
              as="h3"
              className="heading ratings-heading"
              fontSize="2xl"
              color="orange.300"
              fontWeight="bold"
              mb={4}
              textAlign="center"
            >
              Ratings
            </Text>
            <GlassCards ratings={ratings} />
          </Box>
          <Box
            w="full"
            borderBottom="2px solid"
            borderColor="gray.700"
            mb={8}
          />
        </>
      )}
      {/* Links, Stores, Editions - Revamped */}
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
        <Flex direction={{ base: "column", md: "row" }} gap={8} align="stretch">
          {/* Useful Links */}
          <Box
            flex={1}
            minW={0}
            borderRight={{ md: "1px solid #333" }}
            pr={{ md: 6 }}
            mb={{ base: 6, md: 0 }}
          >
            <Text fontSize="xl" color="orange.300" fontWeight="bold" mb={4}>
              Useful Links
            </Text>
            <Flex gap={3} wrap="wrap">
              {gameData.website && (
                <a
                  href={gameData.website}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <Flex
                    align="center"
                    px={4}
                    py={2}
                    bg="orange.500"
                    borderRadius="full"
                    boxShadow="0 0 8px #ff9100"
                    color="#fff"
                    fontWeight="bold"
                    minW={40}
                    _hover={{ bg: "orange.400", boxShadow: "0 0 16px #ff9100" }}
                  >
                    <Icon as={FaLink} mr={2} /> Official Website
                  </Flex>
                </a>
              )}
              {gameData.reddit_url && (
                <a
                  href={gameData.reddit_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <Flex
                    align="center"
                    px={4}
                    py={2}
                    bg="blue.500"
                    borderRadius="full"
                    boxShadow="0 0 8px #1A74E2"
                    color="#fff"
                    fontWeight="bold"
                    minW={40}
                    _hover={{ bg: "blue.400", boxShadow: "0 0 16px #1A74E2" }}
                  >
                    <Icon as={FaLink} mr={2} /> Reddit
                  </Flex>
                </a>
              )}
              {!gameData.website && !gameData.reddit_url && (
                <Text color="gray.400">Not Available</Text>
              )}
            </Flex>
          </Box>
          {/* Stores */}
          <Box
            flex={1}
            minW={0}
            borderRight={{ md: "1px solid #333" }}
            pr={{ md: 6 }}
            mb={{ base: 6, md: 0 }}
          >
            <Text fontSize="xl" color="orange.300" fontWeight="bold" mb={4}>
              Stores
            </Text>
            {gameData.stores && gameData.stores.length > 0 ? (
              <Flex gap={2} wrap="wrap">
                {gameData.stores.map((store) => (
                  <a
                    key={store.id}
                    href={`https://${store.store.domain}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <Flex
                      align="center"
                      px={4}
                      py={2}
                      bg="gray.800"
                      borderRadius="full"
                      boxShadow="0 0 8px #1A74E2"
                      color="#fff"
                      fontWeight="bold"
                      minW={32}
                      _hover={{ bg: "gray.700", boxShadow: "0 0 16px #1A74E2" }}
                    >
                      {/* You can add store icons here if available */}
                      {store.store.name}
                    </Flex>
                  </a>
                ))}
              </Flex>
            ) : (
              <Text color="gray.400">Not Available</Text>
            )}
          </Box>
          {/* DLCs & Editions */}
          <Box flex={1} minW={0}>
            <Text fontSize="xl" color="orange.300" fontWeight="bold" mb={4}>
              DLCs & Editions
            </Text>
            <Editions gameName={gameData.slug} />
          </Box>
        </Flex>
      </Box>
      {/* Screenshots */}
      <Box mb={12}>
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
        <Box display="flex" justifyContent="center" width="100%">
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
