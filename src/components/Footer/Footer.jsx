import { Box, Text, Link, HStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

function Footer() {
  return (
    <Box
      py={3}
      px={6}
      w="95%"
      mx="auto"
      textAlign="right"
      bg="rgba(24, 23, 22, 0.7)"
      borderTopLeftRadius="2xl"
      borderTopRightRadius="2xl"
      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
      backdropFilter="blur(8px)"
      zIndex={20}
    >
      <HStack justify="flex-end" spacing={8}>
        <Text
          fontSize={{ base: "lg", md: "2xl" }}
          color="white"
          fontFamily="Rajdhani, sans-serif"
        >
          By:{" "}
          <MotionLink
            href="https://siddhantkumarsingh.me"
            isExternal
            color="orange.200"
            fontWeight="bold"
            whileHover={{ textShadow: "0 0 8px #ff2c02, 0 0 16px #ff2c02" }}
            _hover={{ textDecoration: "underline" }}
          >
            Siddhant Kumar Singh
          </MotionLink>
        </Text>
        <Text
          fontSize={{ base: "lg", md: "2xl" }}
          color="white"
          fontFamily="Rajdhani, sans-serif"
        >
          Data By:{" "}
          <MotionLink
            href="https://rawg.io/apidocs"
            isExternal
            color="orange.200"
            fontWeight="bold"
            whileHover={{ textShadow: "0 0 8px #ff2c02, 0 0 16px #ff2c02" }}
            _hover={{ textDecoration: "underline" }}
          >
            RAWG Video Game Database
          </MotionLink>
        </Text>
      </HStack>
    </Box>
  );
}

export default Footer;
