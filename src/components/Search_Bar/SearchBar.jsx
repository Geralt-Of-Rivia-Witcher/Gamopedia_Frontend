import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Input,
  Button,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  Box,
  List,
  ListItem,
  Spinner,
  useOutsideClick,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// No global gameData, handled in Game.jsx
let BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/";

const MotionBox = motion(Box);

function SearchBar(props) {
  let navigate = useNavigate();
  const [gameName, setGameName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const suggestTimeout = useRef();
  const inputRef = useRef();
  const boxRef = useRef();
  useOutsideClick({ ref: boxRef, handler: () => setShowSuggestions(false) });

  function handleChange(event) {
    const value = event.target.value;
    setGameName(value);
    setError(false);
    setErrorMessage("");
    if (suggestTimeout.current) clearTimeout(suggestTimeout.current);
    if (!value || value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setLoadingSuggest(true);
    suggestTimeout.current = setTimeout(() => {
      axios
        .get(BACKEND_URL + `api/suggest?query=${encodeURIComponent(value)}`)
        .then((res) => {
          setSuggestions(res.data || []);
          setShowSuggestions(true);
          setLoadingSuggest(false);
        })
        .catch(() => {
          setSuggestions([]);
          setShowSuggestions(false);
          setLoadingSuggest(false);
        });
    }, 250);
  }

  function handleSuggestionClick(s) {
    setGameName(s.name);
    setSuggestions([]);
    setShowSuggestions(false);
    handleSubmit(null, s.slug);
  }

  function handleSubmit(event, forcedSlug) {
    if (event) event.preventDefault();
    setShowSuggestions(false);
    setSuggestions([]);
    setError(false);
    setErrorMessage("");
    const searchValue = forcedSlug ? forcedSlug : gameName;
    if (!searchValue) return;
    setGameName("");
    axios
      .post(BACKEND_URL + "api/gameName", { gameName: searchValue })
      .then((res) => {
        const data = res.data;
        if (data.detail === "Not found.") {
          navigate("/");
          setErrorMessage("Game not found. Check for any spelling mistakes.");
          setError(true);
        } else {
          navigate(`/game/${data.slug}`);
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
      ref={boxRef}
      position="relative"
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
          autoComplete="off"
          ref={inputRef}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
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
      {showSuggestions && suggestions.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          w="100%"
          bg="gray.900"
          borderRadius="xl"
          boxShadow="0 0 16px #1A74E2"
          zIndex={10}
          mt={2}
          maxH="320px"
          overflowY="auto"
        >
          <List spacing={0}>
            {suggestions.map((s, idx) => (
              <ListItem
                key={s.slug}
                px={4}
                py={3}
                cursor="pointer"
                _hover={{ bg: "orange.700", color: "white" }}
                borderBottom={
                  idx !== suggestions.length - 1 ? "1px solid #222" : "none"
                }
                onClick={() => handleSuggestionClick(s)}
              >
                <Box fontWeight="bold">{s.name}</Box>
                {s.released && (
                  <Box fontSize="sm" color="gray.400">
                    {s.released}
                  </Box>
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      {loadingSuggest && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          mt={2}
          zIndex={11}
          px={4}
          py={2}
          bg="gray.900"
          borderRadius="xl"
        >
          <Spinner color="orange.300" size="sm" />
        </Box>
      )}
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

export { SearchBar };
