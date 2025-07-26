import React, { useState } from "react";
import axios from "axios";
import {
  Input,
  Button,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

let gameData;
let BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/";

const MotionBox = motion(Box);

function SearchBar(props) {
  let navigate = useNavigate();
  const [gameName, setGameName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);

  function handleChange(event) {
    setGameName(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setGameName("");
    axios
      .post(BACKEND_URL + "api/gameName", { gameName: gameName })
      .then((res) => {
        gameData = res.data;
        if (gameData.detail === "Not found.") {
          navigate("/");
          setErrorMessage("Game not found. Check for any spelling mistakes.");
          setError(true);
        } else {
          navigate("/Game");
          setErrorMessage("");
          setError(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const inputBg = useColorModeValue("whiteAlpha.200", "whiteAlpha.200");
  const inputBorder = useColorModeValue("orange.300", "orange.400");
  const inputShadow = "0 0 16px #ff2c02, 0 0 32px #ff2c02";

  return (
    <MotionBox
      as="form"
      w="full"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <InputGroup size="lg">
        <Input
          name="gameName"
          value={gameName}
          onChange={handleChange}
          isInvalid={error}
          placeholder="Enter a Game Name."
          fontSize={{ base: "2xl", md: "3xl" }}
          fontFamily="Rajdhani, sans-serif"
          color="white"
          bg={inputBg}
          borderColor={inputBorder}
          borderWidth={2}
          boxShadow={error ? inputShadow : "0 0 8px #ff2c02"}
          _placeholder={{ color: "gray.400" }}
          _focus={{ borderColor: "orange.400", boxShadow: inputShadow }}
          _hover={{ borderColor: "orange.300" }}
          pr="4.5rem"
        />
        <InputRightElement width="4.5rem">
          <Button
            h="2.5rem"
            size="lg"
            type="submit"
            colorScheme="orange"
            variant="solid"
            fontSize="2xl"
            fontWeight="bold"
            boxShadow="0 0 8px #ff2c02"
            _hover={{ boxShadow: "0 0 16px #ff2c02" }}
            className={props.class}
          >
            <SearchIcon boxSize={6} />
          </Button>
        </InputRightElement>
      </InputGroup>
      {error && (
        <Box
          color="red.300"
          fontSize="lg"
          mt={2}
          fontFamily="Rajdhani, sans-serif"
        >
          {errorMessage}
        </Box>
      )}
    </MotionBox>
  );
}

export { gameData, SearchBar };
