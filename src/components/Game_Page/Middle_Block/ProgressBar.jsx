import React from "react";
import { Box, Stat, StatLabel, StatNumber, Progress } from "@chakra-ui/react";

function ProgressBar({ score, platform }) {
  return (
    <Box
      bg="rgba(24,23,22,0.7)"
      borderRadius="xl"
      p={4}
      mb={4}
      boxShadow="0 0 16px #1A74E2"
    >
      <Stat>
        <StatLabel color="gray.300" fontSize="lg">
          {platform}
        </StatLabel>
        <StatNumber
          color="orange.400"
          fontSize="3xl"
          textShadow="0 0 8px #ff2c02"
        >
          {score}
        </StatNumber>
        <Progress
          value={score}
          max={100}
          colorScheme="orange"
          size="lg"
          borderRadius="md"
          mt={2}
        />
      </Stat>
    </Box>
  );
}

export default ProgressBar;
