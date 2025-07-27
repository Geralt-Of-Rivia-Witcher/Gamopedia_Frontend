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
  ModalBody,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@chakra-ui/icons";

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
        <ModalOverlay bg="blackAlpha.900" />
        <ModalContent
          bg="transparent"
          boxShadow="none"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <ModalBody
            p={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
          >
            <IconButton
              icon={<ArrowLeftIcon boxSize={8} />}
              aria-label="Previous"
              position="absolute"
              left={4}
              top="50%"
              transform="translateY(-50%)"
              onClick={prev}
              zIndex={2}
              colorScheme="orange"
              variant="ghost"
              size="lg"
              isDisabled={screenshots.length < 2}
            />
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
              />
            )}
            <IconButton
              icon={<ArrowRightIcon boxSize={8} />}
              aria-label="Next"
              position="absolute"
              right={4}
              top="50%"
              transform="translateY(-50%)"
              onClick={next}
              zIndex={2}
              colorScheme="orange"
              variant="ghost"
              size="lg"
              isDisabled={screenshots.length < 2}
            />
            <IconButton
              icon={<CloseIcon boxSize={6} />}
              aria-label="Close"
              position="absolute"
              top={4}
              right={4}
              onClick={closeModal}
              colorScheme="orange"
              variant="solid"
              size="lg"
              zIndex={3}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Screenshots;
