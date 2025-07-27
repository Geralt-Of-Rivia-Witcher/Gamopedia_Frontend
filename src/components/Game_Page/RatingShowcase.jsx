import React from "react";
import {
  Box,
  Text,
  Flex,
  Progress,
  Badge,
  Tooltip,
  VStack,
  HStack,
  Icon,
  CircularProgress,
  CircularProgressLabel,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaGamepad } from "react-icons/fa";

// 1. Neon Horizontal Progress Bars
export function NeonBars({ ratings }) {
  return (
    <Box mb={8}>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Neon Progress Bars
      </Text>
      <VStack spacing={4} align="stretch">
        {ratings.map((r, i) => (
          <Flex key={i} align="center" gap={3}>
            <Icon as={FaGamepad} color={r.color} boxSize={6} />
            <Text w={32} color={r.color} fontWeight="bold">
              {r.label}
            </Text>
            <Progress
              value={r.value}
              max={100}
              flex={1}
              h={3}
              borderRadius={8}
              sx={{
                'div[role="progressbar"]': {
                  background: `linear-gradient(90deg, ${r.color}, #fff0 80%)`,
                  boxShadow: `0 0 12px 2px ${r.color}`,
                },
              }}
            />
            <Text ml={3} color={r.color} fontWeight="bold">
              {r.value}
            </Text>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
}

export function GlassCards({ ratings }) {
  return (
    <Box mb={8}>
      <Flex wrap="wrap" gap={4} justify="center">
        {ratings.map((r, i) => (
          <Box
            key={i}
            p={5}
            minW={40}
            bg="rgba(24,23,22,0.7)"
            borderRadius="2xl"
            boxShadow={`0 0 16px ${r.color}`}
            backdropFilter="blur(8px)"
            transition="0.3s"
            _hover={{
              transform: "scale(1.05)",
              boxShadow: `0 0 32px ${r.color}`,
            }}
          >
            <Icon as={FaGamepad} color={r.color} boxSize={8} mb={2} />
            <Text color={r.color} fontWeight="bold">
              {r.label}
            </Text>
            <Text fontSize="2xl" color={r.color} fontWeight="extrabold">
              {r.value}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}

// 3. Stacked Badges with Tooltips
export function BadgeStack({ ratings }) {
  return (
    <Box mb={8}>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Stacked Badges with Tooltips
      </Text>
      <HStack spacing={4} wrap="wrap">
        {ratings.map((r, i) => (
          <Tooltip key={i} label={`${r.label}: ${r.value}/100`} hasArrow>
            <Badge
              px={4}
              py={2}
              fontSize="lg"
              colorScheme="orange"
              bg={r.color}
              color="#fff"
              borderRadius="full"
              boxShadow={`0 0 8px ${r.color}`}
            >
              {r.label}: {r.value}
            </Badge>
          </Tooltip>
        ))}
      </HStack>
    </Box>
  );
}

// 4. Animated Score Dials
export function ScoreDials({ ratings }) {
  const trackColor = useColorModeValue("gray.200", "gray.700");
  return (
    <Box mb={8}>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Animated Score Dials
      </Text>
      <HStack spacing={8} wrap="wrap" justify="center">
        {ratings.map((r, i) => (
          <Box key={i} textAlign="center">
            <CircularProgress
              value={r.value}
              max={100}
              size="80px"
              thickness="10px"
              color={r.color}
              trackColor={trackColor}
            >
              <CircularProgressLabel>
                <Text fontSize="2xl" fontWeight="bold" color={r.color}>
                  {r.value}
                </Text>
              </CircularProgressLabel>
            </CircularProgress>
            <Text mt={2} color={r.color} fontWeight="bold">
              {r.label}
            </Text>
          </Box>
        ))}
      </HStack>
    </Box>
  );
}

// 5. Minimalist List with Icons
export function MinimalList({ ratings }) {
  return (
    <Box mb={8}>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Minimalist List with Icons
      </Text>
      <VStack spacing={2} align="stretch">
        {ratings.map((r, i) => (
          <Flex
            key={i}
            align="center"
            gap={3}
            p={2}
            borderBottom="1px solid"
            borderColor="gray.600"
          >
            <Icon as={FaGamepad} color={r.color} boxSize={5} />
            <Text color={r.color} fontWeight="bold">
              {r.label}
            </Text>
            <Text ml="auto" color={r.color} fontWeight="bold">
              {r.value}
            </Text>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
}
