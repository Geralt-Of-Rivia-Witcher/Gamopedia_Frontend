import React from "react";
import ProgressBar from "./ProgressBar";
import { VStack, Link } from "@chakra-ui/react";

function PlatformRatings(array) {
  return (
    <VStack spacing={4} align="stretch">
      {array.array.map((rating) => (
        <Link
          key={rating.platform.platform}
          href={rating.url}
          target="_blank"
          rel="noreferrer"
          _hover={{
            textDecoration: "none",
            transform: "scale(1.03)",
            boxShadow: "0 0 8px #ff2c02",
          }}
        >
          <ProgressBar
            score={rating.metascore}
            platform={rating.platform.name}
          />
        </Link>
      ))}
    </VStack>
  );
}

export default PlatformRatings;
