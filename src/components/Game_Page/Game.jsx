import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Text,
  Icon,
  Button,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUserTie,
  FaBuilding,
  FaCalendarAlt,
  FaClock,
  FaTags,
  FaGamepad,
  FaLink,
} from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { GiConsoleController } from "react-icons/gi";

import axios from "axios";

import Editions from "./Right_Block/Editions.jsx";
import { SearchBar } from "../Search_Bar/SearchBar.jsx";
import Screenshots from "./Carousel/Screenshots.jsx";
import Footer from "../Footer/Footer.jsx";
import { formatDate } from "../../utils/formatDate";
import { GlassCards } from "./RatingShowcase.jsx";

const CACHE_TTL = 60 * 60 * 1000; // 1 hour in ms
const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/";

const Game = () => {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper: get/set cache with TTL
  function getCachedGame(slug) {
    try {
      const cached = localStorage.getItem(`game_${slug}`);
      if (!cached) return null;
      const { data, ts } = JSON.parse(cached);
      if (Date.now() - ts > CACHE_TTL) {
        localStorage.removeItem(`game_${slug}`);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }
  function setCachedGame(slug, data) {
    localStorage.setItem(
      `game_${slug}`,
      JSON.stringify({ data, ts: Date.now() })
    );
  }

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Try cache first
    const cached = getCachedGame(slug);
    if (cached) {
      setGameData(cached);
      setLoading(false);
      return;
    }
    // Fetch from backend
    axios
      .post(BACKEND_URL + "api/gameName", { gameName: slug })
      .then((res) => {
        if (res.data.detail === "Not found.") {
          setError("Game not found.");
          setLoading(false);
          setGameData(null);
          navigate("/");
        } else {
          setGameData(res.data);
          setCachedGame(slug, res.data);
          setLoading(false);
        }
      })
      .catch(() => {
        setError("Error loading game data.");
        setLoading(false);
        setGameData(null);
      });
  }, [slug, navigate]);

  // Hero image fade-out on scroll logic
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const heroHeight =
    typeof window !== "undefined"
      ? Math.min(window.innerHeight * 0.85, 700)
      : 480;
  // Fade out image as you scroll heroHeight px
  const imageOpacity = useTransform(
    scrollY,
    [0, heroHeight * 0.7, heroHeight],
    [1, 0.3, 0]
  );
  const imageScale = useTransform(scrollY, [0, heroHeight], [1, 1.08]);
  const contentTranslate = useTransform(
    scrollY,
    [0, heroHeight * 0.7, heroHeight],
    [80, 0, 0]
  );

  if (loading)
    return (
      <Box color="orange.300" p={8} textAlign="center">
        Loading...
      </Box>
    );
  if (error || !gameData)
    return (
      <Box color="red.300" p={8} textAlign="center">
        {error || "Game not found."}
      </Box>
    );

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
    <Flex direction="column" minH="100vh" bg="rgb(35, 37, 38)">
      {/* Hero Section: search bar always visible at top, image fixed, overlay, etc. */}
      <Box
        ref={heroRef}
        position="relative"
        w="full"
        minH="100vh"
        maxH="100vh"
        overflow="hidden"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        mb={0}
        bg="rgb(35, 37, 38)"
      >
        {/* Search bar at top, always visible */}
        <Box
          position="relative"
          zIndex={10}
          w={{ base: "100%", md: "700px" }}
          maxW="100vw"
          mx="auto"
          pt={{ base: 6, md: 10 }}
          px={{ base: 2, md: 0 }}
        >
          <SearchBar />
        </Box>
        {/* Fixed hero image, stays in place while fading out */}
        <motion.img
          src={gameData.background_image}
          alt={gameData.name}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            zIndex: 0,
            opacity: imageOpacity,
            scale: imageScale,
            transition: "opacity 0.4s, scale 0.4s",
            willChange: "opacity, scale",
            pointerEvents: "none",
            userSelect: "none",
          }}
          draggable={false}
        />
        {/* Softer overlay for cinematic effect, more transparent in center */}
        <Box
          position="fixed"
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          zIndex={1}
          pointerEvents="none"
          bgGradient="linear(to-b, #18181b 0%, transparent 30%)"
        />
      </Box>
      {/* Title and description, always off-screen at first, slide up as you scroll, with dynamic spacing and Read More */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: -40,
          y: contentTranslate,
          transition: "y 0.4s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <Text
          as="h1"
          fontSize={{ base: "2xl", md: "5xl", lg: "6xl" }}
          fontWeight="extrabold"
          color="orange.300"
          fontFamily="Orbitron, sans-serif"
          textShadow="0 0 32px #ff2c02, 0 0 64px #ff2c02"
          mb={4}
          textAlign="center"
          letterSpacing="0.06em"
        >
          {gameData.name}
        </Text>
        <Box maxW="2xl" w="full" textAlign="center" mb={showFullDesc ? 6 : 2}>
          <Text
            color="gray.200"
            fontSize={{ base: "md", md: "xl" }}
            fontFamily="Rajdhani, sans-serif"
            transition="all 0.5s cubic-bezier(.4,0,.2,1)"
            whiteSpace="pre-line"
            mb={2}
          >
            {showFullDesc ? desc : shortDesc}
          </Text>
          {desc && desc.length > 220 && (
            <Button
              size="sm"
              colorScheme="orange"
              variant="outline"
              onClick={() => setShowFullDesc((v) => !v)}
              mt={1}
              mb={2}
              _hover={{ bg: "orange.600", color: "white" }}
            >
              {showFullDesc ? "Show Less" : "Read More"}
            </Button>
          )}
        </Box>
      </motion.div>
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
