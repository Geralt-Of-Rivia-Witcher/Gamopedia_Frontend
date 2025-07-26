import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App.jsx";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@fontsource/orbitron/700.css";
import "@fontsource/rajdhani/400.css";

// Basic CSS reset and body styling
const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Rajdhani', sans-serif;
    background: #18181b;
    color: white;
    min-height: 100vh;
  }
  
  #root {
    min-height: 100vh;
  }
`;

// Inject global styles
const styleSheet = document.createElement("style");
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

const theme = extendTheme({
  fonts: {
    heading: "Orbitron, sans-serif",
    body: "Rajdhani, sans-serif",
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);
