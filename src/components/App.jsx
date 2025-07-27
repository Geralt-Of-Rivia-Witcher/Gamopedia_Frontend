import React from "react";

import Game from "./Game_Page/Game.jsx";
import Home from "./Home_Page/Home.jsx";
import NotFound from "./404_Page/404.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:slug" element={<Game />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
