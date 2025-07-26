import React from "react";
import { Box, Heading, Text, VStack, Container } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { SearchBar } from "../Search_Bar/SearchBar.jsx";
import Footer from "../Footer/Footer.jsx";

const MotionHeading = motion(Heading);
const MotionBox = motion(Box);

function Home() {
  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, #18181b, #232526 80%)"
      position="relative"
    >
      {/* Animated Background Placeholder (tsParticles will be added later) */}
      <Container maxW="container.lg" pt={32} pb={12} centerContent>
        <VStack spacing={8}>
          <MotionHeading
            as="h1"
            size="4xl"
            color="orange.400"
            fontFamily="Orbitron, sans-serif"
            fontWeight="extrabold"
            letterSpacing="wider"
            textShadow="0 0 16px #ff2c02, 0 0 32px #ff2c02"
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Gamopedia
          </MotionHeading>
          <MotionBox
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              color="gray.200"
              fontFamily="Rajdhani, sans-serif"
              textAlign="center"
              mb={8}
              px={2}
              maxW="lg"
              textShadow="0 0 8px #000"
            >
              Your ultimate hub for all things video games. Search, discover,
              and explore game data in style.
            </Text>
          </MotionBox>
          <MotionBox
            w="full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.7 }}
          >
            <Box w={{ base: "100%", md: "700px" }} mx="auto">
              <SearchBar />
            </Box>
          </MotionBox>
        </VStack>
      </Container>
      <Box position="fixed" left="0" bottom="0" w="full" zIndex={10}>
        <Footer />
      </Box>
    </Box>
  );
}

export default Home;
