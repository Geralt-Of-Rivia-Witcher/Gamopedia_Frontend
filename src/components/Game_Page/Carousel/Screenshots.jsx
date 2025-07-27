import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Image,
  Flex,
  Spinner,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";

let BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/";

function getScreenshots(gameName) {
  return axios
    .post(BACKEND_URL + "api/screenshots", { gameName })
    .then((res) => res.data.results || [])
    .catch((error) => {
      console.log(error);
      return [];
    });
}

function Screenshots({ gameName }) {
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setLoading(true);
    getScreenshots(gameName).then((shots) => {
      setScreenshots(shots);
      setLoading(false);
    });
  }, [gameName]);

  const openModal = (idx) => {
    setSelected(idx);
    onOpen();
  };

  const closeModal = () => {
    setSelected(null);
    onClose();
  };

  const prev = () =>
    setSelected((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  const next = () =>
    setSelected((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));

  if (loading) return <Spinner color="orange.400" size="xl" />;
  if (!screenshots.length)
    return <Text color="gray.300">No screenshots available.</Text>;

  const isScrollable = screenshots.length > 3;
  return (
    <>
      <Flex
        overflowX={isScrollable ? "auto" : "visible"}
        gap={4}
        py={2}
        px={2}
        justify="center"
        align="center"
        w="100%"
        minH="200px"
        sx={
          isScrollable
            ? {
                scrollbarWidth: "none",
                "::-webkit-scrollbar": { display: "none" },
              }
            : {}
        }
      >
        {screenshots.map((shot, idx) => (
          <Box
            minW="320px"
            key={shot.id}
            boxShadow="lg"
            borderRadius="lg"
            overflow="hidden"
            cursor="pointer"
            _hover={{ boxShadow: "0 0 16px #ff2c02" }}
            onClick={() => openModal(idx)}
          >
            <Image
              src={shot.image}
              alt="Game screenshot"
              w="320px"
              h="180px"
              objectFit="cover"
            />
          </Box>
        ))}
      </Flex>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        size="full"
        motionPreset="slideInBottom"
      >
        {/* Overlay with click-to-close */}
        <ModalOverlay
          bg="blackAlpha.900"
          onClick={closeModal}
          cursor="pointer"
        />
        <ModalContent
          bg="transparent"
          boxShadow="none"
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
          pointerEvents="none"
        >
          {/* Reduced left navigation zone with animated arrow */}
          {screenshots.length > 1 && (
            <Box
              position="fixed"
              left={0}
              top={0}
              h="100vh"
              w={{ base: "15vw", md: "10vw" }}
              zIndex={4}
              cursor="pointer"
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              pr={{ base: 6, md: 8 }}
              bg="transparent"
              _hover={{ bg: "blackAlpha.400" }}
              transition="background 0.2s"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              pointerEvents="auto"
              role="button"
              aria-label="Previous screenshot"
            >
              <ArrowLeftIcon
                boxSize={14}
                color="orange.300"
                opacity={0.7}
                sx={{
                  transition: "transform 0.2s, opacity 0.2s",
                  ".chakra-box:hover &": {
                    transform: "scale(1.2)",
                    opacity: 1,
                    color: "orange.400",
                  },
                }}
              />
            </Box>
          )}
          {/* Main close area with subtle hover effect */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="100vw"
            h="100vh"
            pointerEvents="auto"
            onClick={closeModal}
            zIndex={2}
            bg="transparent"
            _hover={{ bg: "blackAlpha.200" }}
            transition="background 0.2s"
          >
            {selected !== null && (
              <Image
                src={screenshots[selected].image}
                alt="Game screenshot fullscreen"
                maxH="80vh"
                maxW="90vw"
                mx="auto"
                borderRadius="2xl"
                boxShadow="0 0 32px #ff2c02"
                objectFit="contain"
                onClick={(e) => e.stopPropagation()}
                style={{ transition: "box-shadow 0.2s" }}
              />
            )}
          </Box>
          {/* Reduced right navigation zone with animated arrow */}
          {screenshots.length > 1 && (
            <Box
              position="fixed"
              right={0}
              top={0}
              h="100vh"
              w={{ base: "15vw", md: "10vw" }}
              zIndex={4}
              cursor="pointer"
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              pl={{ base: 6, md: 8 }}
              bg="transparent"
              _hover={{ bg: "blackAlpha.400" }}
              transition="background 0.2s"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              pointerEvents="auto"
              role="button"
              aria-label="Next screenshot"
            >
              <ArrowRightIcon
                boxSize={14}
                color="orange.300"
                opacity={0.7}
                sx={{
                  transition: "transform 0.2s, opacity 0.2s",
                  ".chakra-box:hover &": {
                    transform: "scale(1.2)",
                    opacity: 1,
                    color: "orange.400",
                  },
                }}
              />
            </Box>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default Screenshots;
